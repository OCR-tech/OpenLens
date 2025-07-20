// =========================================//
function startButton() {
  // alert("StartButton");
  stopCamera();

  // document.getElementById("status").innerText = "Start";
  document.getElementById("btn-start").style.display = "none";
  document.getElementById("btn-stop").style.display = "inline-block";

  const videoSource = document.getElementById("video-source").value;

  // ==============================//
  window.timerDelay3000ms = true; // Reset the timer
  window.runDetectionLoop = true; // Start the detection loop
  window.voiceAlertEnabled = true;
  window.notificationEnabled = true;
  // window.motionDetectionEnabled = true;
  // window.smokeDetectionEnabled = true;
  // window.fireDetectionEnabled = true;
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
    okSourceCamera();
    // startIPCamera();
  } else if (videoSource === "stream") {
    startStream();
  } else if (videoSource === "video") {
    startVideo(window.selectedVideoFilePath);
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
