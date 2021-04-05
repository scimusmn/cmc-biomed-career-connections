# EyeTracker.js API

### EyeTracker.EyeTracker([string, optional] licenseFile)

licenseFile, if provided, should be a valid Tobii license file's name.

This function will throw an error if:

* The stream engine fails to start.
* No eye tracker device is connected.
* licenseFile is not a valid file name.
* licenseFile is specified and the license file is invalid.
* licenseFile is specified and the license file does not support the required features.
* The eye tracker device failed to open.
* Subscription to eye position or user presence data failed.

**Returns:** A tracker object.

### tracker.launch()

Launches the thread subscribed to the eye tracker data stream.

**Returns:** Nothing.

### tracker.shutdown()

Closes the thread subscribed to the eye tracker data stream and releases the eye tracker device.

**Returns:** Nothing.

### tracker.isLicenseOk()

Check if a license was successfully validated for this device.

**Returns:** True if a license was successfully applied; false otherwise.

### tracker.getFeatures()

See the Tobii stream engine API reference for tobii_get_feature_group() for more information.

**Returns:** An integer corresponding to one of the Tobii feature groups, representing the available features for this device.

### tracker.gazeX()

**Returns:** The most recent gaze point's X coordinate, in normalized screen coordinates.

### tracker.gazeY()

**Returns:** The most recent gaze point's Y coordinate, in normalized screen coordinates.

### tracker.isUserPresent()

**Returns:** True if a user is presently detected in front of the device; false otherwise.

### tracker.startCalibration()

Reset the current calibration to default and begin new calibration procedure. This function must be called before calling any other calibration function.

Throws an error if a Tobii internal error is encountered when attempting to begin calibration.

**Returns:** Nothing.

### tracker.collectData([float] x, [float] y)

Collect calibration data for the specified point in normalized screen coordinates. The user should already be looking at the point specified before calling this function.

Throws an error if a Tobii internal error is encountered when attempting to begin calibration.

**Returns:** Nothing.

### tracker.discardData([float] x, [float] y)

Discard calibration data previously collected for the specified point in normalized screen coordinates.

Throws an error if a Tobii internal error is encountered when attempting to begin calibration.

**Returns:** Nothing.

### tracker.finishCalibration()

Compute and apply a new calibration based on the collected data. This ends the calibration procedure and must be called when finish calibration.

Throws an error if a Tobii internal error is encountered when attempting to begin calibration.

**Returns:** Nothing.
