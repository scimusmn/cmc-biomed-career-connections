#ifndef SMM_EYETRACKER_H
#define SMM_EYETRACKER_H

#include <string>
#include <atomic>
#include <thread>

#include <napi.h>

extern "C" {
#include <tobii/tobii.h>
#include <tobii/tobii_streams.h>
#include <tobii/tobii_licensing.h>
}

class EyeTracker : public Napi::ObjectWrap<EyeTracker>
{
 public:
    EyeTracker(const Napi::CallbackInfo&);

    Napi::Value isOpened(const Napi::CallbackInfo&);
    Napi::Value isLicenseOk(const Napi::CallbackInfo&);
    Napi::Value getFeatures(const Napi::CallbackInfo&);

    void launch(const Napi::CallbackInfo&);
    void shutdown(const Napi::CallbackInfo&);

    Napi::Value gazeX(const Napi::CallbackInfo&);
    Napi::Value gazeY(const Napi::CallbackInfo&);

    Napi::Value isUserPresent(const Napi::CallbackInfo&);

    void startCalibration(const Napi::CallbackInfo&);
    void collectData(const Napi::CallbackInfo&);
    void discardData(const Napi::CallbackInfo&);
    void finishCalibration(const Napi::CallbackInfo&);

    /** Callback function for gaze point information.
     *
     * This function is public for interoperability with the underlying Tobii C library;
     * you should not call it yourself!
     **/
    void onGazePoint(tobii_gaze_point_t const* gazePoint);

    /** Callback function for user presence information.
     *
     * This function is public for interoperability with the underlying Tobii C library;
     * you should not call it yourself!
     */
    void onUserPresence(tobii_user_presence_status_t presence);

    static Napi::Function GetClass(Napi::Env);

private:
    void loop();

    std::thread loopThread;
    bool licenseOk;

    std::atomic<float> gazePointX, gazePointY;
    std::atomic<bool> running, paused, waitForCallbacks, userIsPresent;

    tobii_api_t* api;
    tobii_device_t* device;
    bool deviceOpened;
};

#endif
