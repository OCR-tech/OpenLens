// =========================================//
// BREAKING DETECTION FUNCTIONS
function toggleBreakingDetection() {
  const breakingSwitch = document.getElementById("breaking-switch");
  const breakingSensitivitySlider = document.getElementById(
    "breaking-sensitivity-slider"
  );
  const breakingStatusNormal = document.getElementById(
    "breaking-status-normal"
  );
  const breakingStatusWarn = document.getElementById("breaking-status-warn");
  const breakingStatusAlert = document.getElementById("breaking-status-alert");

  if (!breakingSwitch || !breakingSensitivitySlider) return;

  window.breakingDetectionEnabled = breakingSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Breaking Detection " + (breakingSwitch.checked ? "On" : "Off")
    );
  }

  breakingSensitivitySlider.disabled = !breakingSwitch.checked;
  breakingStatusNormal.style.display = breakingSwitch.checked
    ? "inline-block"
    : "none";
  breakingStatusWarn.style.display = breakingSwitch.checked
    ? "inline-block"
    : "none";
  breakingStatusAlert.style.display = breakingSwitch.checked
    ? "inline-block"
    : "none";

  localStorage.setItem(
    "breakingDetectionMode",
    breakingSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("breakingSensitivity", breakingSensitivitySlider.value);
}

// =========================================//
function updateValueBreaking(val) {
  const slider = document.getElementById("breaking-sensitivity-slider");
  const breakingSensitivityValue = document.getElementById(
    "breaking-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  breakingSensitivityValue.textContent = val;
  window.breakingSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("breakingSensitivity", window.breakingSensitivity);
}

// =========================================//
function setBreakingDetectionMode(mode) {
  const breakingSwitch = document.getElementById("breaking-switch");
  const breakingSensitivitySlider = document.getElementById(
    "breaking-sensitivity-slider"
  );
  const breakingSensitivityValue = document.getElementById(
    "breaking-sensitivity-value"
  );
  const breakingStatusNormal = document.getElementById(
    "breaking-status-normal"
  );
  const breakingStatusWarn = document.getElementById("breaking-status-warn");
  const breakingStatusAlert = document.getElementById("breaking-status-alert");

  if (breakingSwitch && breakingSensitivitySlider) {
    breakingSwitch.checked = mode === "on";
    breakingSwitch.dispatchEvent(new Event("change"));
    breakingSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("breakingSensitivity") || 0;
    breakingSensitivitySlider.value = sensitivityValue;
    breakingSensitivityValue.textContent = sensitivityValue;
  }

  if (breakingStatusNormal && breakingStatusWarn && breakingStatusAlert) {
    breakingStatusNormal.style.display =
      mode === "on" ? "inline-block" : "none";
    breakingStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    breakingStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setBreakingSensitivity(value) {
  const breakingSensitivitySlider = document.getElementById(
    "breaking-sensitivity-slider"
  );
  const breakingSensitivityValue = document.getElementById(
    "breaking-sensitivity-value"
  );

  if (!breakingSensitivitySlider) return;
  breakingSensitivitySlider.value = value;
  breakingSensitivityValue.textContent = value;

  breakingSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("breakingSensitivity", value);
}

// =========================================//
// Function to update breaking detection status
function updateBreakingDetection() {
  // alert("Breaking detection");

  const videoIds = [
    "camera-stream",
    "usb-camera-stream",
    "stream-player",
    "video-file-player",
  ];
  let video = null;
  for (const id of videoIds) {
    video = document.getElementById(id);
    if (video) break;
  }
  const canvas = document.getElementById("overlay");
  const breakingSwitch = document.getElementById("breaking-switch");
  if (!video || !canvas || !breakingSwitch || !breakingSwitch.checked) return;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevBreakingFrame = window.currBreakingFrame || currFrame;
  window.currBreakingFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("breakingSensitivity")) || 0;

  const breakingDetected = detectBreaking(
    window.prevBreakingFrame,
    window.currBreakingFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (breakingDetected) {
    document.getElementById("breaking-status-normal").style.boxShadow = "none";
    document.getElementById("breaking-status-warn").style.boxShadow = "none";
    document.getElementById("breaking-status-alert").style.boxShadow =
      "0 0 5px 5px indigo";
  } else {
    document.getElementById("breaking-status-normal").style.boxShadow =
      "0 0 5px 5px green";
    document.getElementById("breaking-status-warn").style.boxShadow = "none";
    document.getElementById("breaking-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Advanced glass breaking detection based on pixel intensity, color, and sudden movement
function detectBreaking(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let breakingPixels = 0;
  let suddenChangePixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 80; // Sudden movement is often brighter/darker
  const movementThreshold = 60; // Large pixel change for movement
  const glassColorThreshold = 180; // Glass fragments are often bright/white
  const MOST_SENSITIVE_RATIO = 0.03;
  const LEAST_SENSITIVE_RATIO = 0.001;
  let breakingRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  // Detect sudden changes in pixel intensity and bright fragments
  for (let i = 0; i < totalPixels * 4; i += 4) {
    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = currFrame[i] + currFrame[i + 1] + currFrame[i + 2];
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    // Glass breaking pixel: sudden large change in intensity and bright color
    const isBreakingPixel =
      intensityChange > intensityThreshold &&
      r > glassColorThreshold &&
      g > glassColorThreshold &&
      b > glassColorThreshold &&
      Math.abs(r - g) < 30 &&
      Math.abs(g - b) < 30;

    if (isBreakingPixel) {
      breakingPixels++;
      // Sudden movement detection: check horizontal neighbors for similar changes
      const pixelIndex = i / 4;
      const rightIndex = pixelIndex + 1;
      if (
        rightIndex % width !== 0 &&
        Math.abs(currFrame[rightIndex * 4] - currFrame[i]) > movementThreshold
      ) {
        suddenChangePixels++;
      }
    }
  }

  // Optionally, use suddenChangePixels for more robust detection
  const breakingDetected =
    breakingPixels / totalPixels > breakingRatioThreshold ||
    suddenChangePixels / totalPixels > breakingRatioThreshold / 2;

  document.getElementById("status").innerText =
    "Breaking: " +
    window.breakingDetectionEnabled +
    " " +
    threshold +
    " " +
    breakingRatioThreshold.toFixed(3) +
    " " +
    (breakingPixels / totalPixels).toFixed(3) +
    " " +
    breakingPixels +
    " Sudden: " +
    suddenChangePixels +
    " " +
    totalPixels;

  return breakingDetected;
}
