// =========================================//
function stopButton() {
  // alert("StopButton");

  const placeholder = document.getElementById("video-placeholder");
  const btnOk = document.getElementById("btn-ok");
  // const videoSourceStatus = document.getElementById("video-source");

  document.getElementById("btn-start").style.display = "inline-block";
  document.getElementById("btn-stop").style.display = "none";
  document.getElementById("status").innerText = "Stopped";
  document.getElementById("video-source").disabled = false;

  // Set all buttons to inactive
  // btnCommand.classList.remove("active");
  // btnVoice.classList.remove("active");
  // btnSettings.classList.remove("active");
  btnOk.disabled = false; // Disable the OK button after setting the URL

  window.motionDetectionEnabled = false;
  window.fireDetectionEnabled = false;
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
