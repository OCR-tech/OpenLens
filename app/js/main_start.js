// =========================================//
function startButton() {
  // alert("StartButton");

  stopCamera();

  // document.getElementById("status").innerText = "Start";
  document.getElementById("btn-start").style.display = "none";
  document.getElementById("btn-stop").style.display = "inline-block";

  const videoSource = document.getElementById("video-source").value;
  const ipCameraUrl = document.getElementById("ip-camera-url").value;

  const motionDetectionEnabled =
    document.getElementById("motion-switch").checked;
  const smokeDetectionEnabled = document.getElementById("smoke-switch").checked;
  const fireDetectionEnabled = document.getElementById("fire-switch").checked;
  const floodDetectionEnabled = document.getElementById("flood-switch").checked;
  const lightDetectionEnabled = document.getElementById("light-switch").checked;
  const rainDetectionEnabled = document.getElementById("rain-switch").checked;
  const fallingDetectionEnabled =
    document.getElementById("falling-switch").checked;
  const BreakingDetectionEnabled =
    document.getElementById("breaking-switch").checked;
  const soundDetectionEnabled = document.getElementById("sound-switch").checked;

  // ==============================//
  window.timerDelay3000ms = true; // Reset the timer
  window.runDetectionLoop = true; // Start the detection loop
  window.voiceAlertEnabled = true;
  window.notificationEnabled = true;

  // ==============================//
  if (motionDetectionEnabled) {
    window.motionDetectionEnabled = true; // Enable motion detection
  }
  if (smokeDetectionEnabled) {
    window.smokeDetectionEnabled = true; // Enable smoke detection
  }
  if (fireDetectionEnabled) {
    window.fireDetectionEnabled = true; // Enable fire detection
  }
  if (floodDetectionEnabled) {
    window.floodDetectionEnabled = true; // Enable flood detection
  }
  if (lightDetectionEnabled) {
    window.lightDetectionEnabled = true; // Enable light detection
  }
  if (rainDetectionEnabled) {
    window.rainDetectionEnabled = true; // Enable rain detection
  }
  if (fallingDetectionEnabled) {
    window.fallingDetectionEnabled = true; // Enable falling detection
  }
  if (BreakingDetectionEnabled) {
    window.BreakingDetectionEnabled = true; // Enable breaking detection
  }
  if (soundDetectionEnabled) {
    window.soundDetectionEnabled = true; // Enable sound detection
  }

  // ==============================//
  window.audioContext = true;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Start");
    // playVoiceStatus("Start, Detecting...");
  }

  // Check Video source selection
  if (videoSource === "camera") {
    startIntegratedCamera();
  } else if (videoSource === "camera_usb") {
    startUSBCamera();
  } else if (videoSource === "camera_ip") {
    startIPCamera(ipCameraUrl);
  } else if (videoSource === "stream") {
    startStream();
  } else if (videoSource === "video") {
    startVideo(window.selectedVideoFilePath);
  } else if (videoSource === "image") {
    startImage(window.selectedImageFilePath);
  }

  if (window.timerDelay3000ms) {
    enableTimerDelay3000ms();
  }
}

// =========================================//
function enableTimerDelay3000ms() {
  // alert("EnableTimerDelay3000ms");
  window.timerDelay3000ms = setTimeout(updateLabelSettings, 3000);
}

// ==============================//
function updateLabelSettings() {
  // alert("UpdateLabelSettings");

  updateVideoSizeLabel();
  updateFramerateLabel();
  window.timerDelay3000ms = false;
}
