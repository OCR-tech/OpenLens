// =========================================//
function resumeVideo() {
  // alert("Resume Video");

  document.getElementById("status").innerText = "Resume";
  const btnResume = document.getElementById("btn-resume");
  const btnPause = document.getElementById("btn-pause");
  btnResume.style.display = "none";
  btnPause.style.display = "inline-block";

  const videoSource = document.getElementById("video-source").value;

  // Use the overlay canvas for recording (contains video + overlays)
  const canvas = document.getElementById("overlay");
  if (!canvas) {
    document.getElementById("status").innerText = "No video found";
    if (window.voiceStatusEnabled) {
      playVoiceStatus("No video found");
    }
    return;
  }

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Resume");
  }

  if (videoSource === "camera") {
    // alert("Playing camera stream...");
    const videoElement = document.getElementById("camera-stream");
    if (videoElement) {
      videoElement.play();
      startButton();
      // detectLoop();
    }
  } else if (videoSource === "camera_usb") {
    // alert("Playing USB camera stream...");
    const videoElement = document.getElementById("usb-camera-stream");
    if (videoElement) {
      videoElement.play();
      startButton();
      // detectLoop();
    }
  } else if (videoSource === "video") {
    // alert("Playing video file playback...");
    const videoElement = document.getElementById("video-file-player");
    if (videoElement) {
      videoElement.play();
      startButton();
      // detectLoop();
    }
  }

  // window.runDetectionLoop = true;
}

// =========================================//
// Video control functions
function pauseVideo() {
  // alert("Pause Video");

  document.getElementById("status").innerText = "Pause";

  const btnResume = document.getElementById("btn-resume");
  const btnPause = document.getElementById("btn-pause");
  btnResume.style.display = "inline-block";
  btnPause.style.display = "none";

  const videoSource = document.getElementById("video-source").value;
  // alert("Video Source: " + videoSource);

  // Use the overlay canvas for recording (contains video + overlays)
  const canvas = document.getElementById("overlay");
  if (!canvas) {
    document.getElementById("status").innerText = "No video found";
    if (window.voiceStatusEnabled) {
      playVoiceStatus("No video found");
    }
    return;
  }

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Pause");
  }

  if (videoSource === "camera") {
    const videoElement = document.getElementById("camera-stream");
    if (videoElement) {
      videoElement.pause();
      // alert("Camera stream paused.");
    }
  } else if (videoSource === "camera_usb") {
    const videoElement = document.getElementById("usb-camera-stream");
    if (videoElement) {
      videoElement.pause();
    }
  } else if (videoSource === "video") {
    const video = document.getElementById("video-file-player");
    if (video) {
      video.pause();
    }
  }

  // Stop the overlay/detection loop
  window.runDetectionLoop = false;
}

// =========================================//
function captureImage() {
  document.getElementById("status").innerText = "Capture Image!";

  // Get overlay and video/image elements
  const overlayCanvas = document.getElementById("overlay");
  const videoElement =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("image_file") ||
    document.getElementById("image_folder");

  if (!overlayCanvas || !videoElement) {
    document.getElementById("status").innerText = "No video or overlay found";
    if (window.voiceStatusEnabled) playVoiceStatus("No video found");
    return;
  }

  // Get source dimensions
  let srcWidth, srcHeight;
  if (videoElement instanceof HTMLVideoElement) {
    srcWidth = videoElement.videoWidth;
    srcHeight = videoElement.videoHeight;
  } else if (videoElement instanceof HTMLImageElement) {
    srcWidth = videoElement.naturalWidth;
    srcHeight = videoElement.naturalHeight;
  } else {
    document.getElementById("status").innerText = "No video found";
    return;
  }

  // Create a new canvas to combine video/image and overlay
  const combinedCanvas = document.createElement("canvas");
  combinedCanvas.width = srcWidth;
  combinedCanvas.height = srcHeight;
  const ctx = combinedCanvas.getContext("2d");

  // Draw video/image
  ctx.drawImage(videoElement, 0, 0, srcWidth, srcHeight);

  // if (window.showBoundingBox) {
  if (window.showOverlays) {
    ctx.drawImage(
      overlayCanvas,
      0,
      0,
      overlayCanvas.width,
      overlayCanvas.height,
      0,
      0,
      srcWidth,
      srcHeight
    );
  }

  saveCanvasAsImage(combinedCanvas);
}

// =========================================//
function saveCanvasAsImage(canvas) {
  // Create a temporary link to trigger download
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");

  // Format date as YYYYMMDD_HHMMSS
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const fileName =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "_" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());

  link.download = `img_${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

let flagCaptureImage = true;
let lastDetectedLabel = null; // Track the last detected label
// =========================================//
function captureImageLabel(detectedLabel) {
  const overlayCanvas = document.getElementById("overlay");
  if (!overlayCanvas) {
    document.getElementById("status").innerText = "No overlay found";
    return;
  }

  const ctx = overlayCanvas.getContext("2d");
  ctx.font = "20px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(detectedLabel, 25, 50);

  if (detectedLabel === "Cars" || detectedLabel === "Persons") {
    // check if the same detected objects
    if (detectedLabel === lastDetectedLabel) {
      console.log("Same object detected, skipping capture.");
    } else {
      if (flagCaptureImage) {
        flagCaptureImage = false;
        captureImage();
      }

      setTimeout(() => {
        flagCaptureImage = true;
      }, 5000); // 5 seconds delay before next capture allowed
    }

    lastDetectedLabel = detectedLabel;
  }
}

// =========================================//
// Capture image with boxes function
// function captureImageWithBoxes() {
//   document.getElementById("status").innerText = "Boxes";
// }

let mediaRecorder = null;
let recordedChunks = [];
// =========================================//
// Start recording the video feed
function recordVideo() {
  // document.getElementById("status").innerText = "Recording...";

  if (mediaRecorder && mediaRecorder.state === "recording") return; // Prevent multiple recordings

  const btnRecord = document.getElementById("btn-record");
  const btnStopRC = document.getElementById("btn-stoprc");
  btnRecord.style.display = "none";
  btnStopRC.style.display = "inline-block";

  // Use the overlay canvas for recording (contains video + overlays)
  const overlayCanvas = document.getElementById("overlay");
  const videoElement =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("image_file");

  // Capture the video stream from the video element
  // const stream = videoElement.captureStream(30);

  // Get source dimensions
  let srcWidth, srcHeight;
  if (videoElement instanceof HTMLVideoElement) {
    srcWidth = videoElement.videoWidth;
    srcHeight = videoElement.videoHeight;
  } else if (videoElement instanceof HTMLImageElement) {
    srcWidth = videoElement.naturalWidth;
    srcHeight = videoElement.naturalHeight;
  } else {
    document.getElementById("status").innerText = "No video found";
    return;
  }

  // // Create a new canvas to combine video/image and overlay
  const combinedCanvas = document.createElement("canvas");
  combinedCanvas.width = srcWidth;
  combinedCanvas.height = srcHeight;
  const ctx = combinedCanvas.getContext("2d");

  let recordingAnimationId = null;

  function drawRecordingFrame() {
    // Draw video frame
    ctx.drawImage(videoElement, 0, 0, srcWidth, srcHeight);

    // Draw overlay if enabled
    if (window.showOverlays) {
      ctx.drawImage(
        overlayCanvas,
        0,
        0,
        overlayCanvas.width,
        overlayCanvas.height,
        0,
        0,
        srcWidth,
        srcHeight
      );
    }

    // Keep drawing frames while recording
    if (mediaRecorder && mediaRecorder.state === "recording") {
      recordingAnimationId = requestAnimationFrame(drawRecordingFrame);
    }
  }

  // Capture the canvas stream
  // const stream = overlayCanvas.captureStream(30); // 30 FPS
  const stream = combinedCanvas.captureStream(30); // 30 FPS

  if (!stream) {
    document.getElementById("status").innerText = "Unable to record video";
    return;
  }

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const fileName =
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      "_" +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    // a.download = `recording_${fileName}.webm`;
    a.download = `recording_${fileName}.mp4`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    if (recordingAnimationId) {
      cancelAnimationFrame(recordingAnimationId);
      recordingAnimationId = null;
    }

    // Reset buttons and status
    document.getElementById("status").innerText = "Recording saved.";
  };

  mediaRecorder.start();
  drawRecordingFrame();

  document.getElementById("status").innerText = "Recording...";
  if (window.voiceStatusEnabled) {
    playVoiceStatus("Recording");
  }
}

// =========================================//
let stopTimeout = null;

// Call this function to start/stop recording based on detection
function recordVideoLabel(detectedLabel) {
  if (detectedLabel === "Cars" || detectedLabel === "Persons") {
    // If detection is present, clear any pending stop and start recording immediately
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
    }
    recordVideo();
  } else {
    // If detection is lost, wait 5 seconds before stopping the recording
    if (!stopTimeout && mediaRecorder && mediaRecorder.state === "recording") {
      stopTimeout = setTimeout(() => {
        stopRCVideo();
        stopTimeout = null;
      }, 5000);
    }
  }
}

// =========================================//
// Call this function to stop and save the recording
function stopRCVideo() {
  // alert("Stop Recording");

  document.getElementById("status").innerText = "Stop Recording.";

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Stop Recording");
  }

  const btnRecord = document.getElementById("btn-record");
  const btnStopRC = document.getElementById("btn-stoprc");
  btnRecord.style.display = "inline-block";
  btnStopRC.style.display = "none";

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    document.getElementById("status").innerText = "Recording stopped.";
  }
}

// =========================================//
function hideFrame() {
  // Update status and buttons
  document.getElementById("status").innerText = "Hide Frame";
  const btnFrame1 = document.getElementById("btn-frame1");
  const btnFrame2 = document.getElementById("btn-frame2");
  if (btnFrame1) btnFrame1.style.display = "none";
  if (btnFrame2) btnFrame2.style.display = "inline-block";

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Hide Frame");
  }
  window.showBoundingBox = false;
}

function showFrame() {
  // Update status and buttons
  document.getElementById("status").innerText = "Show Frame";
  const btnFrame1 = document.getElementById("btn-frame1");
  const btnFrame2 = document.getElementById("btn-frame2");
  if (btnFrame1) btnFrame1.style.display = "inline-block";
  if (btnFrame2) btnFrame2.style.display = "none";

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Frame");
  }
  window.showBoundingBox = true;
}

// =========================================//
function hideOverlay() {
  // alert("Hide Overlay");

  // Hide the overlay canvas
  const overlay = document.getElementById("overlay");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Hide Overlay");
  }

  if (overlay) {
    overlay.style.display = "none";
  }

  window.showOverlays = false;

  // Update status and buttons
  document.getElementById("status").innerText = "Hide Overlay";
  const btnHideOverlay = document.getElementById("btn-overlay1");
  const btnShowOverlay = document.getElementById("btn-overlay2");
  if (btnHideOverlay) btnHideOverlay.style.display = "none";
  if (btnShowOverlay) btnShowOverlay.style.display = "inline-block";
}

function showOverlay() {
  // alert("Show Overlay");

  // Show the overlay canvas
  const overlay = document.getElementById("overlay");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Overlay");
  }

  if (overlay) {
    overlay.style.display = "block";
  }

  window.showOverlays = true;

  // Update status and buttons
  document.getElementById("status").innerText = "Show Overlay";
  const btnHideOverlay = document.getElementById("btn-overlay1");
  const btnShowOverlay = document.getElementById("btn-overlay2");
  if (btnHideOverlay) btnHideOverlay.style.display = "inline-block";
  if (btnShowOverlay) btnShowOverlay.style.display = "none";
}

// =========================================//
function resetVideo() {
  document.getElementById("status").innerText = "Reset Video";

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Reset Video");
  }

  const video = document.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  } else {
    document.getElementById("status").innerText = "No video found";
  }
}

// =========================================//
// function exit() {
//   window.close();
//   // document.getElementById("status").innerText = "Exit";
//   // if (confirm("Are you sure you want to exit?")) {
//   //   window.close();
//   // } else {
//   //   document.getElementById("status").innerText = "Exit cancelled.";
//   // }
// }
