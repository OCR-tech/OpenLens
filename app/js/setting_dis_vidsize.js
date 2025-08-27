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
  } else {
    videoSizeLabel.style.display = "inline-block";

    if (!video) {
      videoSizeLabel.textContent = "WxH: N/A";
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

  if (
    videoSource.value === "image_file" ||
    videoSource.value === "image_folder" ||
    videoSource.value === "camera_ip"
  ) {
    widthVideo = video.naturalWidth;
    heightVideo = video.naturalHeight;
  } else {
    widthVideo = video.videoWidth;
    heightVideo = video.videoHeight;
  }

  if (!ctx || !canvas) return;

  // alert(
  //   "DisplayVideoSize: " +
  //     widthVideo +
  //     "x" +
  //     heightVideo +
  //     video +
  //     videoSource.value
  // );

  const sizeText = video ? widthVideo + "x" + heightVideo : "off";

  if (!sizeText) return;
  ctx.save();

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const fontSize = Math.round(canvasWidth / 25);
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = "top"; // Align text to the top of the rectangle

  const textWidth = ctx.measureText("WxH: " + sizeText).width;
  const textHeight = Math.round(fontSize * 1.2); // Adjust text height based on font size

  const paddingX = Math.round(canvasWidth / 100); // Horizontal padding
  const paddingY = Math.round(canvasWidth / 100); // Vertical padding

  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = textHeight + paddingY * 1;
  const x = canvasWidth - boxWidth - paddingX;
  const y = canvasHeight - boxHeight - paddingY;

  // Draw background rectangle
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x, y, boxWidth, boxHeight);

  // Draw background rectangle
  ctx.fillStyle = "#FFF";
  ctx.fillText("Size: " + sizeText, x + paddingX, y + paddingY);
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

// =========================================//
function updateVideoResolution() {
  // alert("UpdateVideoResolution");

  const videoSizeSelect = document.getElementById("video-size-select");
  const videoFeed = document.getElementById("video-feed");
  if (!videoFeed || !videoSizeSelect) return;

  const selectedValue = videoSizeSelect.value;
  const [width, height] = selectedValue.split("x").map(Number);

  const video = videoFeed.querySelector("video");
  const img = videoFeed.querySelector("img");
  const canvas = videoFeed.querySelector("canvas");

  if (video) {
    video.width = width;
    video.height = height;
    video.style.width = "100%";
    video.style.height = "100%";
  }
  if (img) {
    img.width = width;
    img.height = height;
    img.style.width = "100%";
    img.style.height = "100%";
  }
  if (canvas) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  // widthVideo = width;
  // heightVideo = height;
  // displayVideoSize();
  // updateVideoSizeLabel();
}
