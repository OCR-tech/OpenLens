// =========================================//
function stopButton() {
  // alert("StopButton");

  const placeholder = document.getElementById("video-placeholder");
  const btnOk = document.getElementById("btn-ok");

  // Reset the video source selection
  // document.getElementById("btn-start").style.display = "inline-block";
  // document.getElementById("btn-stop").style.display = "none";
  // document.getElementById("status").innerText = "Stopped";
  // document.getElementById("video-source").disabled = false;

  // document.getElementById("motion-status-normal").style.boxShadow = "none";
  // document.getElementById("motion-status-warn").style.boxShadow = "none";
  // document.getElementById("motion-status-alert").style.boxShadow = "none";

  // document.getElementById("fire-status-normal").style.boxShadow = "none";
  // document.getElementById("fire-status-warn").style.boxShadow = "none";
  // document.getElementById("fire-status-alert").style.boxShadow = "none";

  ReInitUI(); // Reinitialize UI elements

  btnOk.disabled = false; // Disable the OK button after setting the URL

  //=========================================//
  // window.motionDetectionEnabled = false;
  // window.smokeDetectionEnabled = false;
  // window.fireDetectionEnabled = false;

  //=========================================//
  window.runDetectionLoop = false; // Stop the detection loop
  stopCamera();
  cancelAnimationFrame(window.animationId);

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Stopped");
  }

  if (window.voiceAlertEnabled) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
  }

  //=========================================//
  window.voiceAlertEnabled = false;
  window.notificationEnabled = false;

  //=========================================//
  if (video) {
    video.pause();
    if (video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
    video.remove();
    video = null;
  }
  if (canvas) {
    canvas.remove();
    canvas = null;
  }

  if (placeholder) placeholder.style.display = "block";
}

// =========================================//
function stopCamera() {
  // Stop the camera stream
  if (window.cameraStream) {
    window.cameraStream.getTracks().forEach((track) => track.stop());
    window.cameraStream = null;
  }

  // Reset all possible video elements
  // const videoIds = ["camera", "camera_usb", "camera_ip", "stream", "video"];
  const videoIds = [
    "video",
    "camera-stream",
    "usb-camera-stream",
    "stream-player",
    "video-file-player",
  ];

  videoIds.forEach((id) => {
    const video = document.getElementById(id);
    if (video) {
      // If the video element has a srcObject, stop its tracks
      if (video.srcObject && typeof video.srcObject.getTracks === "function") {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      video.srcObject = null;
      video.pause();
    }
  });

  // Reset all possible canvas elements
  const canvasIds = ["canvas", "overlay"];
  canvasIds.forEach((id) => {
    const canvas = document.getElementById(id);
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // canvas.remove();
    }
  });
}

// =========================================//
function ReInitUI() {
  // alert("ReInitUI");

  // Initialize UI elements
  const videoSource = document.getElementById("video-source");
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  const status = document.getElementById("status");

  const motionStatusNormal = document.getElementById("motion-status-normal");
  const motionStatusWarn = document.getElementById("motion-status-warn");
  const motionStatusAlert = document.getElementById("motion-status-alert");
  const smokeStatusNormal = document.getElementById("smoke-status-normal");
  const smokeStatusWarn = document.getElementById("smoke-status-warn");
  const smokeStatusAlert = document.getElementById("smoke-status-alert");
  const fireStatusNormal = document.getElementById("fire-status-normal");
  const fireStatusWarn = document.getElementById("fire-status-warn");
  const fireStatusAlert = document.getElementById("fire-status-alert");

  // Set initial states
  if (btnStart) btnStart.style.display = "inline-block";
  if (btnStop) btnStop.style.display = "none";
  if (status) status.innerText = "Stopped";
  if (videoSource) videoSource.disabled = false;

  if (motionStatusNormal) motionStatusNormal.style.boxShadow = "none";
  if (motionStatusWarn) motionStatusWarn.style.boxShadow = "none";
  if (motionStatusAlert) motionStatusAlert.style.boxShadow = "none";

  if (smokeStatusNormal) smokeStatusNormal.style.boxShadow = "none";
  if (smokeStatusWarn) smokeStatusWarn.style.boxShadow = "none";
  if (smokeStatusAlert) smokeStatusAlert.style.boxShadow = "none";

  if (fireStatusNormal) fireStatusNormal.style.boxShadow = "none";
  if (fireStatusWarn) fireStatusWarn.style.boxShadow = "none";
  if (fireStatusAlert) fireStatusAlert.style.boxShadow = "none";
}
