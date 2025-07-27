// =========================================//
function stopButton() {
  // alert("StopButton");

  const placeholder = document.getElementById("video-placeholder");
  const btnOk = document.getElementById("btn-ok");
  const status = document.getElementById("status");

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
  window.audioContext = false;

  //=========================================//
  window.runDetectionLoop = false; // Stop the detection loop
  stopCamera();

  cancelAnimationFrame(window.animationId);
  cancelAnimationFrame(window.detectionLoopId);

  window.animationId = null;
  window.detectionLoopId = null;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Stopped");
  }

  if (window.voiceAlertEnabled) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
  }

  //=========================================//
  window.voiceAlertEnabled = false;
  window.notificationEnabled = false;

  if (placeholder) placeholder.style.display = "block";
  if (status) status.innerText = "Stopped";
}

// =========================================//
function stopCamera() {
  // List all possible video/image element IDs
  const videoIds = [
    "camera-stream",
    "usb-camera-stream",
    "stream-player",
    "video-file-player",
    "video",
    "image",
  ];

  videoIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      // Stop media tracks if present
      if (el.srcObject && typeof el.srcObject.getTracks === "function") {
        el.srcObject.getTracks().forEach((track) => track.stop());
        el.srcObject = null;
      }
      // Pause video if possible
      if (typeof el.pause === "function") el.pause();
      // Clear src for <video> and <img>
      el.src = "";
      // Optionally remove element from DOM
      // el.remove();
    }
  });

  // Clear all canvas overlays
  const canvasIds = ["canvas", "overlay"];
  canvasIds.forEach((id) => {
    const canvas = document.getElementById(id);
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
  const soundStatusNormal = document.getElementById("sound-status-normal");
  const soundStatusWarn = document.getElementById("sound-status-warn");
  const soundStatusAlert = document.getElementById("sound-status-alert");
  const smokeStatusNormal = document.getElementById("smoke-status-normal");
  const smokeStatusWarn = document.getElementById("smoke-status-warn");
  const smokeStatusAlert = document.getElementById("smoke-status-alert");
  const fireStatusNormal = document.getElementById("fire-status-normal");
  const fireStatusWarn = document.getElementById("fire-status-warn");
  const fireStatusAlert = document.getElementById("fire-status-alert");
  const floodStatusNormal = document.getElementById("flood-status-normal");
  const floodStatusWarn = document.getElementById("flood-status-warn");
  const floodStatusAlert = document.getElementById("flood-status-alert");
  const lightStatusNormal = document.getElementById("light-status-normal");
  const lightStatusWarn = document.getElementById("light-status-warn");
  const lightStatusAlert = document.getElementById("light-status-alert");
  const rainStatusNormal = document.getElementById("rain-status-normal");
  const rainStatusWarn = document.getElementById("rain-status-warn");
  const rainStatusAlert = document.getElementById("rain-status-alert");
  const fallingStatusNormal = document.getElementById("falling-status-normal");
  const fallingStatusWarn = document.getElementById("falling-status-warn");
  const fallingStatusAlert = document.getElementById("falling-status-alert");
  const breakingStatusNormal = document.getElementById(
    "breaking-status-normal"
  );
  const breakingStatusWarn = document.getElementById("breaking-status-warn");
  const breakingStatusAlert = document.getElementById("breaking-status-alert");

  // Set initial states
  if (btnStart) btnStart.style.display = "inline-block";
  if (btnStop) btnStop.style.display = "none";
  if (status) status.innerText = "Stopped";
  if (videoSource) videoSource.disabled = false;

  if (motionStatusNormal) motionStatusNormal.style.boxShadow = "none";
  if (motionStatusWarn) motionStatusWarn.style.boxShadow = "none";
  if (motionStatusAlert) motionStatusAlert.style.boxShadow = "none";

  if (soundStatusNormal) soundStatusNormal.style.boxShadow = "none";
  if (soundStatusWarn) soundStatusWarn.style.boxShadow = "none";
  if (soundStatusAlert) soundStatusAlert.style.boxShadow = "none";

  if (smokeStatusNormal) smokeStatusNormal.style.boxShadow = "none";
  if (smokeStatusWarn) smokeStatusWarn.style.boxShadow = "none";
  if (smokeStatusAlert) smokeStatusAlert.style.boxShadow = "none";

  if (fireStatusNormal) fireStatusNormal.style.boxShadow = "none";
  if (fireStatusWarn) fireStatusWarn.style.boxShadow = "none";
  if (fireStatusAlert) fireStatusAlert.style.boxShadow = "none";

  if (floodStatusNormal) floodStatusNormal.style.boxShadow = "none";
  if (floodStatusWarn) floodStatusWarn.style.boxShadow = "none";
  if (floodStatusAlert) floodStatusAlert.style.boxShadow = "none";

  if (lightStatusNormal) lightStatusNormal.style.boxShadow = "none";
  if (lightStatusWarn) lightStatusWarn.style.boxShadow = "none";
  if (lightStatusAlert) lightStatusAlert.style.boxShadow = "none";

  if (rainStatusNormal) rainStatusNormal.style.boxShadow = "none";
  if (rainStatusWarn) rainStatusWarn.style.boxShadow = "none";
  if (rainStatusAlert) rainStatusAlert.style.boxShadow = "none";

  if (fallingStatusNormal) fallingStatusNormal.style.boxShadow = "none";
  if (fallingStatusWarn) fallingStatusWarn.style.boxShadow = "none";
  if (fallingStatusAlert) fallingStatusAlert.style.boxShadow = "none";

  if (breakingStatusNormal) breakingStatusNormal.style.boxShadow = "none";
  if (breakingStatusWarn) breakingStatusWarn.style.boxShadow = "none";
  if (breakingStatusAlert) breakingStatusAlert.style.boxShadow = "none";
}
