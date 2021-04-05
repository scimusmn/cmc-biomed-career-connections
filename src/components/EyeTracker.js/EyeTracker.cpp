#include "EyeTracker.h"

#include <cstdio>
#include <iostream>
#include <iterator>
#include <fstream>
#include <vector>
#include <string>
#include <stdexcept>

#include <napi.h>

extern "C" {
#include <tobii/tobii_licensing.h>
#include <tobii/tobii_config.h>
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Helper functions
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

static void getDeviceUrl(char const* url, void* userData)
{
    std::string* deviceUrl = (std::string*) userData;
    *deviceUrl = std::string(url);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

static void callEyeTrackerOnGazePoint(tobii_gaze_point_t const* gazePoint, void* userdata)
{
    EyeTracker* self = (EyeTracker*) userdata;
    self->onGazePoint(gazePoint);
}

static void callEyeTrackerOnUserPresence(tobii_user_presence_status_t presence,
					 int64_t timestamp,
					 void* userdata)
{
    EyeTracker* self = (EyeTracker*) userdata;
    self->onUserPresence(presence);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

static std::vector<uint16_t> readFile(std::string filename)
{
    std::ifstream file(filename, std::ios::binary);
    file.unsetf(std::ios::skipws);

    std::vector<uint16_t> buffer;
    uint16_t block;
    while( file.read(reinterpret_cast<char*>(&block), sizeof(uint16_t)) )
	buffer.push_back(block);

    return buffer;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void throwJsError(Napi::Env env, std::string error)
{
    Napi::Error::New(env, error).ThrowAsJavaScriptException();
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Setup & shutdown functions
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

EyeTracker::EyeTracker(const Napi::CallbackInfo& info) : ObjectWrap(info)
{
    Napi::Env env = info.Env();

    deviceOpened = false;
    paused = false;
    userIsPresent = false;

    bool useLicense = info.Length() == 1;
    licenseOk = false;

    api = NULL;
    tobii_error_t result = tobii_api_create(&api, NULL, NULL);
    if (result != TOBII_ERROR_NO_ERROR)
	throwJsError(env, "failed to create Tobii API!");

    std::string deviceUrl = "no device";
    result = tobii_enumerate_local_device_urls(api, getDeviceUrl, &deviceUrl);
    if (result != TOBII_ERROR_NO_ERROR)
	throwJsError(env, "error encountered when acquiring device URL");

    if (deviceUrl == "no device")
	throwJsError(env, "no Tobii device found");

    if (useLicense) {
	if (!info[0].IsString())
	    throwJsError(env, "could not convert argument 1 to license filename");

	Napi::String jsLicenseFilename = info[0].As<Napi::String>();
        std::string licenseFilename(jsLicenseFilename);
        std::cout << "use license: " << licenseFilename << std::endl;
	std::vector<uint16_t> licenseKey = readFile(licenseFilename);
	tobii_license_key_t license = { licenseKey.data(), sizeof(uint16_t) * licenseKey.size() };
	tobii_license_validation_result_t validation;

	result = tobii_device_create_ex(api, deviceUrl.c_str(),
					TOBII_FIELD_OF_USE_INTERACTIVE,
					&license, 1, &validation,
					&device);
	if (validation != TOBII_LICENSE_VALIDATION_RESULT_OK)
	    throwJsError(env, "failed to validate license!");

        tobii_feature_group_t features;
        tobii_get_feature_group(device, &features);
        if (features == TOBII_FEATURE_GROUP_BLOCKED ||
            features == TOBII_FEATURE_GROUP_CONSUMER)
            throwJsError(env, "license failed to activate features!");
        
        licenseOk = true;
    }
    else {
	result = tobii_device_create(api, deviceUrl.c_str(),
				     TOBII_FIELD_OF_USE_INTERACTIVE,
				     &device);
    }

    if (result != TOBII_ERROR_NO_ERROR)
	throwJsError(env, "failed to open Tobii device!");

    result = tobii_gaze_point_subscribe(device, callEyeTrackerOnGazePoint, this);
    if (result != TOBII_ERROR_NO_ERROR)
	throwJsError(env, "failed to subscribe to gaze point data!");

    result = tobii_user_presence_subscribe(device, callEyeTrackerOnUserPresence, this);
    if (result != TOBII_ERROR_NO_ERROR)
	throwJsError(env, "failed to subscribe to user presence data!");

    deviceOpened = true;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Napi::Value EyeTracker::isLicenseOk(const Napi::CallbackInfo& info)
{
    return Napi::Boolean::New(info.Env(), licenseOk);
}

Napi::Value EyeTracker::isOpened(const Napi::CallbackInfo& info)
{
    return Napi::Boolean::New(info.Env(), deviceOpened);
}

Napi::Value EyeTracker::getFeatures(const Napi::CallbackInfo& info)
{
    tobii_feature_group_t features;
    tobii_get_feature_group(device, &features);
    return Napi::Number::New(info.Env(), features);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::launch(const Napi::CallbackInfo& info)
{
    running = true;
    loopThread = std::thread(&EyeTracker::loop, this);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::shutdown(const Napi::CallbackInfo& info)
{
    running = false;
    if (loopThread.joinable())
	loopThread.join();
    tobii_gaze_point_unsubscribe(device);
    tobii_device_destroy(device);
    tobii_api_destroy(api);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Data functions
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Napi::Value EyeTracker::isUserPresent(const Napi::CallbackInfo& info)
{ return Napi::Boolean::New(info.Env(), userIsPresent.load()); }

Napi::Value EyeTracker::gazeX(const Napi::CallbackInfo& info)
{ return Napi::Number::New(info.Env(), gazePointX.load()); }

Napi::Value EyeTracker::gazeY(const Napi::CallbackInfo& info)
{ return Napi::Number::New(info.Env(), gazePointY.load()); }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Calibration functions
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::startCalibration(const Napi::CallbackInfo& info)
{
    paused = true;
    while(waitForCallbacks) {}

    tobii_error_t result =
        tobii_calibration_start(device, TOBII_ENABLED_EYE_BOTH);
   if (result != TOBII_ERROR_NO_ERROR)
        throwJsError(info.Env(),
                     "encountered an error when starting calibration: " + std::string(tobii_error_message(result))); 
    paused = false;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::collectData(const Napi::CallbackInfo& info)
{
    paused = true;
    while (waitForCallbacks) {}
    
    Napi::Number x = info[0].As<Napi::Number>();
    Napi::Number y = info[1].As<Napi::Number>();
    tobii_error_t result =
        tobii_calibration_collect_data_2d(device, x, y);
    if (result != TOBII_ERROR_NO_ERROR)
        throwJsError(info.Env(),
                     "encountered an error when attempting calibration: " + std::string(tobii_error_message(result)));
    paused = false;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::discardData(const Napi::CallbackInfo& info)
{
    paused = true;
    while(waitForCallbacks) {}

    Napi::Number x = info[0].As<Napi::Number>();
    Napi::Number y = info[1].As<Napi::Number>();
    tobii_error_t result =
        tobii_calibration_discard_data_2d(device, x, y);
    if (result != TOBII_ERROR_NO_ERROR)
        throwJsError(info.Env(),
                     "encountered an error when attempting to discard data: " + std::string(tobii_error_message(result)));

    paused = false;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::finishCalibration(const Napi::CallbackInfo& info)
{
    paused = true;
    while(waitForCallbacks) {}
    
    tobii_error_t result =
        tobii_calibration_compute_and_apply(device);
    if (result != TOBII_ERROR_NO_ERROR)
        throwJsError(info.Env(),
                     "encountered an error when attempting to compute calibration: " + std::string(tobii_error_message(result)));

    result = tobii_calibration_stop(device);
    if (result != TOBII_ERROR_NO_ERROR)
        throwJsError(info.Env(),
                     "encountered an error when attempting to stop calibration: " + std::string(tobii_error_message(result)));

    // unpause main loop
    paused = false;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// Loop functions
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::onGazePoint(tobii_gaze_point_t const* gazePoint)
{
    if (!userIsPresent) {
	return;
    }
    if (gazePoint->validity != TOBII_VALIDITY_VALID) {
	return;
    }

    gazePointX = gazePoint->position_xy[0];
    gazePointY = gazePoint->position_xy[1];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::onUserPresence(tobii_user_presence_status_t presence)
{
    if (presence == TOBII_USER_PRESENCE_STATUS_PRESENT)
	userIsPresent = true;
    else
	userIsPresent = false;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

void EyeTracker::loop()
{
    while(running) {
        if (paused)
            continue;

        waitForCallbacks = true;
        
	tobii_error_t result = tobii_wait_for_callbacks(1, &device);
	if (result != TOBII_ERROR_NO_ERROR && result != TOBII_ERROR_TIMED_OUT)
	    throw(std::runtime_error("waiting for callbacks failed"));

	result = tobii_device_process_callbacks(device);
	if (result != TOBII_ERROR_NO_ERROR)
	    throw(std::runtime_error("failed to process device callbacks!"));

        waitForCallbacks = false;
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// JS bindings
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Napi::Function EyeTracker::GetClass(Napi::Env env) {
    return DefineClass(env, "EyeTracker", {
	    EyeTracker::InstanceMethod("isOpened", &EyeTracker::isOpened),
            EyeTracker::InstanceMethod("isLicenseOk", &EyeTracker::isLicenseOk),
            EyeTracker::InstanceMethod("getFeatures", &EyeTracker::getFeatures),

	    EyeTracker::InstanceMethod("launch", &EyeTracker::launch),
	    EyeTracker::InstanceMethod("shutdown", &EyeTracker::shutdown),

	    EyeTracker::InstanceMethod("gazeX", &EyeTracker::gazeX),
	    EyeTracker::InstanceMethod("gazeY", &EyeTracker::gazeY),
	    EyeTracker::InstanceMethod("isUserPresent", &EyeTracker::isUserPresent),

            EyeTracker::InstanceMethod("startCalibration", &EyeTracker::startCalibration),
            EyeTracker::InstanceMethod("collectData", &EyeTracker::collectData),
            EyeTracker::InstanceMethod("discardData", &EyeTracker::discardData),
            EyeTracker::InstanceMethod("finishCalibration", &EyeTracker::finishCalibration),
    });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    Napi::String name = Napi::String::New(env, "EyeTracker");
    exports.Set(name, EyeTracker::GetClass(env));
    return exports;
}

NODE_API_MODULE(EyeTracker, Init)
