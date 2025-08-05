// =========================================//
document.addEventListener("DOMContentLoaded", function () {
  const videoSizeSwitch = document.getElementById("video-size-switch");

  if (!videoSizeSwitch) return;

  // Set the switch state from localStorage
  videoSizeSwitch.checked = localStorage.getItem("videoSizeMode") === "on";

  // Set initial video size state
  window.showVideoSizeOverlay = videoSizeSwitch.checked;

  // Add event listener
  videoSizeSwitch.addEventListener("change", toggleVideoSize);
});

// =========================================//
function toggleVideoSize() {
  // alert("ToggleVideoSize");

  const videoSizeLabel = document.getElementById("video-size-label");
  const videoSizeSwitch = document.getElementById("video-size-switch");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Video Size " + (videoSizeSwitch.checked ? "On" : "Off"));
  }

  if (videoSizeSwitch) {
    window.showVideoSizeOverlay = videoSizeSwitch.checked;
    localStorage.setItem(
      "videoSizeMode",
      videoSizeSwitch.checked ? "on" : "off"
    );

    // display the label with current video size
    if (window.showVideoSizeOverlay) {
      if (videoSizeLabel) {
        videoSizeLabel.style.display = "inline-block";
        updateVideoSizeLabel();
      }
    } else {
      if (videoSizeLabel) {
        videoSizeLabel.style.display = "none";
      }
    }
  }
}

// =========================================//
function updateVideoSizeLabel() {
  // alert("UpdateVideoSizeLabel");

  const videoSizeSwitch = document.getElementById("video-size-switch");
  const videoSizeLabel = document.getElementById("video-size-label");

  if (!videoSizeSwitch || !videoSizeLabel) return;

  if (!videoSizeSwitch.checked) {
    videoSizeLabel.style.display = "none";
    videoSizeLabel.textContent = "";
    // return;
  } else {
    videoSizeLabel.style.display = "inline-block";

    if (!video) {
      videoSizeLabel.textContent = "WxH: N/A";
      // return;
    } else {
      videoSizeLabel.textContent = "WxH: " + widthVideo + "x" + heightVideo;
    }
  }
}

widthVideo = 0;
heightVideo = 0;
// =========================================//
// Display current video size on canvas
function displayVideoSize() {
  // alert("displayVideoSize");

  const videoSource = document.getElementById("video-source");

  const videoIds = [
    "camera-stream",
    "usb-camera-stream",
    "stream-player",
    "video-file-player",
    "image-file-viewer",
  ];
  let video = null;
  for (const id of videoIds) {
    video = document.getElementById(id);
    if (video) break;
  }

  if (videoSource.value === "image" || videoSource.value === "camera_ip") {
    widthVideo = video.naturalWidth;
    heightVideo = video.naturalHeight;
  } else {
    widthVideo = video.videoWidth;
    heightVideo = video.videoHeight;
  }

  if (!ctx || !canvas) return;

  const sizeText = video ? widthVideo + "x" + heightVideo : "off";

  if (!sizeText) return;
  ctx.save();
  ctx.font = "40px Arial";
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  const textWidth = ctx.measureText("WxH: " + sizeText).width;

  // Draw background rectangle for better readability
  const padding = 8;
  const textHeight = 24;
  const x = canvas.width - textWidth - padding - 10; // 10px margin from right edge
  const y = canvas.height - textHeight - padding;
  ctx.fillRect(x, y, textWidth + padding, textHeight);
  ctx.fillStyle = "#FFF";
  ctx.fillText("Size: " + sizeText, x + 4, y + textHeight - 6);
  ctx.restore();
}

// =========================================//
function setVideoSizeMode(mode) {
  // alert("SetVideoSizeMode: " + mode);

  const videoSizeSwitch = document.getElementById("video-size-switch");
  const videoSizeLabel = document.getElementById("video-size-label");
  if (videoSizeSwitch) {
    videoSizeSwitch.checked = mode === "on";
    videoSizeSwitch.dispatchEvent(new Event("change"));
    videoSizeLabel.style.display = videoSizeSwitch.checked ? "block" : "none";
  }
}
