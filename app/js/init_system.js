// =========================================//
let model = null;
let animationId = null;
let video = null;
let canvas = null;
let ctx = null;
let stream = null;

// =========================================//
const btnCommand = document.getElementById("btn-command");
const btnVoice = document.getElementById("btn-voice");
const btnDetect = document.getElementById("btn-detect");
const btnSettings = document.getElementById("btn-settings");
const btnHelp = document.getElementById("btn-help");
const btnTutorial = document.getElementById("btn-tutorial");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const groupFrameSource = document.getElementById("group-frame-source");
const groupFrameMode = document.getElementById("group-frame-mode");
const groupFrameText = document.getElementById("group-frame-text");
const groupFrameGrade = document.getElementById("group-frame-grade");
const groupFrameObject = document.getElementById("group-frame-object");
const groupFrameCommand = document.getElementById("group-frame-command");
const groupFrameVoice = document.getElementById("group-frame-voice");
const groupFrameDetect = document.getElementById("group-frame-detect");
const groupFrameSettings = document.getElementById("group-frame-settings");
const groupFrameTutorial = document.getElementById("group-frame-tutorial");
const groupFrameHelp = document.getElementById("group-frame-help");
const groupFrameVisitor = document.getElementById("group-frame-visitor");

// document.getElementById("btn-command").disabled = true;
// document.getElementById("btn-voice").disabled = true;
// document.getElementById("btn-settings").disabled = true;
// document.getElementById("theme-switch").disabled = false;
// document.getElementById("screen-switch").disabled = false;
// document.getElementById("source-switch").disabled = false;
// document.getElementById("video-source").disabled = false;

// btnCommand.disabled = true;
// btnVoice.disabled = true;
// btnSettings.disabled = true;
// btnHelp.disabled = true;
// btnTutorial.disabled = true;
// btnStart.disabled = true;
// btnStop.disabled = true;

// =========================================//
// Import the COCO-SSD model from TensorFlow.js
// Load the COCO-SSD model on page load
window.addEventListener("DOMContentLoaded", function () {
  cocoSsd
    .load()
    .then(function (loadedModel) {
      model = loadedModel;

      // alert(model);

      initSystem();
      // requestCameraPermission(); // Request camera permission
      // requestMicrophonePermission(); // Request microphone permission
      // requestLocationPermission(); // Request location permission
      // requestNotificationPermission(); // Request notification permission
      // listAllCameras();
      initUI();

      document.getElementById("status").innerText = "Ready!";

      // document.getElementById("status").innerText =
      //   " window.motionDetectionEnabled: " +
      //   window.motionDetectionEnabled +
      //   " window.soundDetectionEnabled: " +
      //   window.soundDetectionEnabled +
      //   " window.smokeDetectionEnabled: " +
      //   window.smokeDetectionEnabled +
      //   " window.fireDetectionEnabled: " +
      //   window.fireDetectionEnabled;
    })
    .catch(function (err) {
      document.getElementById("status").innerText = "Model load error: " + err;
      alert("Model load error: " + err);
    });
});

// =========================================//
function initSystem() {
  // alert("InitializeSystem");
  window.timerDelay3000ms = false;
  window.runDetectionLoop = false;
  window.voiceCommandEnabled = true;
  window.voiceAlertEnabled = true;
  window.emailAlertEnabled = true;
  window.notificationEnabled = true;
  window.showBoundingBox = true;
  window.showDateTimeOverlay = true;
  window.showGPSLocationOverlay = true;
  window.showVideoSizeOverlay = true;
  window.showFramerateOverlay = true;
  //------------//
  window.objectDetectionEnabled = true;
  window.textDetectionEnabled = true;
  window.gradeDetectionEnabled = true;
  window.redBoxesDetectionEnabled = true;
  window.motionDetectionEnabled = true;
  window.soundDetectionEnabled = true;
  window.smokeDetectionEnabled = true;
  window.fireDetectionEnabled = true;
  window.floodDetectionEnabled = true;
  window.lightDetectionEnabled = true;
  window.rainDetectionEnabled = true;
  window.fallingDetectionEnabled = true;
  window.breakingDetectionEnabled = true;
  //------------//
  window.audioContext = true;
  window.detectionLoopId = null;

  // console.log("Initializing system");
}

// =========================================//
function initUI() {
  // alert("InitializeUI");

  // Enable buttons and switches
  [
    "theme-switch",
    "screen-switch",
    "source-switch",
    "mode-switch",
    "status-switch",
    "video-source",
    "video-unit",
    "btn-start",
    "btn-stop",
    "btn-command",
    "btn-voice",
    "btn-detect",
    "btn-settings",
    "btn-pause",
    "btn-capture",
    "btn-overlay1",
    "btn-overlay2",
    "btn-frame1",
    "btn-frame2",
    "btn-record",
    "btn-reset",
    "datetime-switch",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = false;
  });

  // document.getElementById("video-size-label").style.display = "inline-block";
  // document.getElementById("frame-rate-label").style.display = "inline-block";
  // document.getElementById("video-size-label").textContent = "WxH: N/A";
  // document.getElementById("frame-rate-label").textContent = "FPS: N/A";

  updateVideoSource();
}

// =========================================//
function requestCameraPermission() {
  // alert("RequestingCameraPermission");

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      console.log("Camera access granted!");
    })
    .catch((err) => {
      document.getElementById("status").innerText =
        "Camera permission denied: " + err;
      alert("Camera permission denied: " + err);
    });
}

// =========================================//
function requestMicrophonePermission() {
  // alert("RequestingMicrophonePermission");

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      stream.getTracks().forEach((track) => track.stop());
    })
    .catch(function (err) {
      document.getElementById("status").innerText =
        "Microphone permission denied: " + err;
      alert("Microphone permission denied: " + err);
    });
}

// =========================================//
function requestLocationPermission() {
  // alert("RequestingLocationPermission");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Successfully retrieved location
        console.log("Location retrieved:", position);
      },
      function (err) {
        // Error retrieving location
        document.getElementById("status").innerText =
          "Location permission denied: " + err.message;
        alert("Location permission denied: " + err.message);
      }
    );
  } else {
    document.getElementById("status").innerText =
      "Geolocation is not supported by this browser.";
    alert("Geolocation is not supported by this browser.");
  }
}

// =========================================//
function requestNotificationPermission() {
  // alert("RequestingNotificationPermission");

  Notification.requestPermission()
    .then(function (result) {
      if (result === "granted") {
        console.log("Notification permission granted.");
      } else {
        document.getElementById("status").innerText =
          "Notification permission denied: " + result;
        alert("Notification permission denied: " + result);
      }
    })
    .catch(function (err) {
      document.getElementById("status").innerText =
        "Notification permission error: " + err;
      alert("Notification permission error: " + err);
    });
}

// =========================================//
flag_videoSource0 = false; // Integrated camera
flag_videoSource1 = false; // USB camera
// =========================================//
function listAllCameras() {
  // alert("listAllCameras");

  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (videoInputs.length === 0) {
        alert("No cameras found.");
      } else {
        videoInputs.forEach((input) => {
          if (input.label.includes("Integrated")) {
            flag_videoSource0 = true;
            // alert("Integrated camera found: " + input.label);
          } else if (input.label.includes("USB")) {
            flag_videoSource1 = true;
            // alert("USB camera found: " + input.label);
          }
        });
      }
    })
    .catch(function (err) {
      alert("Error enumerating devices: " + err);
    });
}
