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
  } else {
    if (window.voiceStatusEnabled) {
      playVoiceStatus("Resume");
    }

    if (videoSource === "camera") {
      // alert("Playing camera stream...");
      const videoElement = document.getElementById("camera-stream");
      if (videoElement) {
        videoElement.play();
        detectFrame();
      }
    } else if (videoSource === "camera_usb") {
      // alert("Playing USB camera stream...");
      const videoElement = document.getElementById("usb-camera-stream");
      if (videoElement) {
        videoElement.play();
        detectFrame();
      }
    } else if (videoSource === "video") {
      // alert("Playing video file playback...");
      const videoElement = document.getElementById("video-file-player");
      if (videoElement) {
        videoElement.play();
        detectFrame();
      }
    }
  }
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

  // Use the overlay canvas for recording (contains video + overlays)
  const canvas = document.getElementById("overlay");
  if (!canvas) {
    document.getElementById("status").innerText = "No video found";
    if (window.voiceStatusEnabled) {
      playVoiceStatus("No video found");
    }
    return;
  } else {
    if (window.voiceStatusEnabled) {
      playVoiceStatus("Pause");
    }

    if (videoSource === "camera") {
      const videoElement = document.getElementById("camera-stream");
      if (videoElement) {
        videoElement.pause();
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
  }
}

// =========================================//
// Capture image functions
function captureImage() {
  document.getElementById("status").innerText = "Capture Image";

  // Use the overlay canvas for capture
  const canvas = document.getElementById("overlay");

  const videoElement =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("image") ||
    document.getElementById("image_folder");

  if (!canvas) {
    document.getElementById("status").innerText = "No video found";
    if (window.voiceStatusEnabled) {
      playVoiceStatus("No video found");
    }
    return;
  } else {
    if (window.voiceStatusEnabled) {
      playVoiceStatus("Capture Image");
    }
    if (videoElement instanceof HTMLVideoElement) {
      const ctx = canvas.getContext("2d");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    } else if (videoElement instanceof HTMLImageElement) {
      const ctx = canvas.getContext("2d");
      canvas.width = videoElement.naturalWidth;
      canvas.height = videoElement.naturalHeight;
      videoElement.crossOrigin = "anonymous"; // *** Set Cross-Origin Attribute ***
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    }

    saveCanvasAsImage(canvas);
  }
}

// =========================================//
// function saveCanvasAsImage0(canvas) {
//   // ------------------------------- //
//   // Add time and date to the canvas
//   const ctx = canvas.getContext("2d");
//   ctx.font = "15px Arial";
//   // ctx.fillStyle = "White";
//   // ctx.fillStyle = "Blue";
//   ctx.fillStyle = "White";
//   // ctx.fillText("Date: " + new Date().toLocaleString(), 10, canvas.height - 150);
//   ctx.fillText(new Date().toLocaleString(), 10, 25);

//   // Create a temporary link to trigger download
//   const link = document.createElement("a");
//   link.href = canvas.toDataURL("image/png");

//   // Format date as YYYYMMDD_HHMMSS
//   const now = new Date();
//   const pad = (n) => n.toString().padStart(2, "0");
//   const fileName =
//     now.getFullYear().toString() +
//     pad(now.getMonth() + 1) +
//     pad(now.getDate()) +
//     "_" +
//     pad(now.getHours()) +
//     pad(now.getMinutes()) +
//     pad(now.getSeconds());

//   link.download = `img_${fileName}.png`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }

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

// =========================================//
// Capture image with boxes function
function captureImageWithBoxes() {
  document.getElementById("status").innerText = "Boxes";
}

let mediaRecorder = null;
let recordedChunks = [];
// =========================================//
// Start recording the video feed
function recordVideo() {
  // document.getElementById("status").innerText = "Recording...";

  const btnRecord = document.getElementById("btn-record");
  const btnStopRC = document.getElementById("btn-stoprc");
  btnRecord.style.display = "none";
  btnStopRC.style.display = "inline-block";

  // Use the overlay canvas for recording (contains video + overlays)
  const canvas = document.getElementById("overlay");
  if (!canvas) {
    document.getElementById("status").innerText = "No video found";
    if (window.voiceStatusEnabled) {
      playVoiceStatus("No video found");
    }
    return;
  }

  // Get the video element (try all possible sources)
  const videoElement =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("image");

  if (!videoElement) {
    document.getElementById("status").innerText = "No video found";

    return;
  }

  // Capture the video stream from the video element
  const stream = videoElement.captureStream
    ? videoElement.captureStream()
    : videoElement.mozCaptureStream
    ? videoElement.mozCaptureStream()
    : null;

  // Capture the canvas stream
  // const stream = canvas.captureStream(30); // 30 FPS

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
    document.getElementById("status").innerText = "Recording saved.";
  };

  mediaRecorder.start();
  document.getElementById("status").innerText = "Recording...";
  if (window.voiceStatusEnabled) {
    playVoiceStatus("Recording");
  }
}

// =========================================//
// Call this function to stop and save the recording
function stopRCVideo() {
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
  // Hide the overlay canvas
  const overlay = document.getElementById("overlay");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Hide Overlay");
  }

  if (overlay) {
    overlay.style.display = "none";
  }

  // Stop the overlay/detection loop
  window.flagOverlay = false;

  // Update status and buttons
  document.getElementById("status").innerText = "Hide Overlay";
  const btnHideOverlay = document.getElementById("btn-overlay1");
  const btnShowOverlay = document.getElementById("btn-overlay2");
  if (btnHideOverlay) btnHideOverlay.style.display = "none";
  if (btnShowOverlay) btnShowOverlay.style.display = "inline-block";
}

function showOverlay() {
  // Show the overlay canvas
  const overlay = document.getElementById("overlay");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Overlay");
  }

  if (overlay) {
    overlay.style.display = "block";
  }

  // Start the overlay/detection loop
  window.flagOverlay = true;
  if (typeof detectFrame === "function") {
    detectFrame();
  }

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
