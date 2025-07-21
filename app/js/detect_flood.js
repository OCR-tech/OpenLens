// =========================================//
// FLOOD DETECTION FUNCTIONS
function toggleFloodDetection() {
  const floodSwitch = document.getElementById("flood-switch");
  const floodSensitivitySlider = document.getElementById(
    "flood-sensitivity-slider"
  );
  const floodStatusNormal = document.getElementById("flood-status-normal");
  const floodStatusWarn = document.getElementById("flood-status-warn");
  const floodStatusAlert = document.getElementById("flood-status-alert");

  if (!floodSwitch || !floodSensitivitySlider) return;

  window.floodDetectionEnabled = floodSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Flood Detection " + (floodSwitch.checked ? "On" : "Off"));
  }

  floodSensitivitySlider.disabled = !floodSwitch.checked;
  floodStatusNormal.style.display = floodSwitch.checked
    ? "inline-block"
    : "none";
  floodStatusWarn.style.display = floodSwitch.checked ? "inline-block" : "none";
  floodStatusAlert.style.display = floodSwitch.checked
    ? "inline-block"
    : "none";

  localStorage.setItem(
    "floodDetectionMode",
    floodSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("floodSensitivity", floodSensitivitySlider.value);
}

// =========================================//
function updateValueFlood(val) {
  const slider = document.getElementById("flood-sensitivity-slider");
  const floodSensitivityValue = document.getElementById(
    "flood-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  floodSensitivityValue.textContent = val;
  window.floodSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("floodSensitivity", window.floodSensitivity);
}

// =========================================//
function setFloodDetectionMode(mode) {
  const floodSwitch = document.getElementById("flood-switch");
  const floodSensitivitySlider = document.getElementById(
    "flood-sensitivity-slider"
  );
  const floodSensitivityValue = document.getElementById(
    "flood-sensitivity-value"
  );
  const floodStatusNormal = document.getElementById("flood-status-normal");
  const floodStatusWarn = document.getElementById("flood-status-warn");
  const floodStatusAlert = document.getElementById("flood-status-alert");

  if (floodSwitch && floodSensitivitySlider) {
    floodSwitch.checked = mode === "on";
    floodSwitch.dispatchEvent(new Event("change"));
    floodSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("floodSensitivity") || 0;
    floodSensitivitySlider.value = sensitivityValue;
    floodSensitivityValue.textContent = sensitivityValue;
  }

  if (floodStatusNormal && floodStatusWarn && floodStatusAlert) {
    floodStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    floodStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    floodStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setFloodSensitivity(value) {
  const floodSensitivitySlider = document.getElementById(
    "flood-sensitivity-slider"
  );
  const floodSensitivityValue = document.getElementById(
    "flood-sensitivity-value"
  );

  if (!floodSensitivitySlider) return;
  floodSensitivitySlider.value = value;
  floodSensitivityValue.textContent = value;

  floodSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("floodSensitivity", value);
}

// =========================================//
// Function to update flood detection status
function updateFloodDetection() {
  // alert("UpdateFloodDetection");

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
  const floodSwitch = document.getElementById("flood-switch");
  if (!video || !canvas || !floodSwitch || !floodSwitch.checked) return;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevFloodFrame = window.currFloodFrame || currFrame;
  window.currFloodFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("floodSensitivity")) || 0;

  const floodDetected = detectFlood(
    window.prevFloodFrame,
    window.currFloodFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (floodDetected) {
    document.getElementById("flood-status-normal").style.boxShadow = "none";
    document.getElementById("flood-status-warn").style.boxShadow = "none";
    document.getElementById("flood-status-alert").style.boxShadow =
      "0 0 5px 5px purple";
  } else {
    document.getElementById("flood-status-normal").style.boxShadow =
      "0 0 5px 5px green";
    document.getElementById("flood-status-warn").style.boxShadow = "none";
    document.getElementById("flood-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Simple water flood detection based on pixel intensity changes (customize as needed)
function detectFlood(prevFrame, currFrame, width, height, threshold) {
  // alert("detectFlood");

  if (!prevFrame || !currFrame) return false;

  let floodPixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 30;
  const MOST_SENSITIVE_RATIO = 0.5;
  const LEAST_SENSITIVE_RATIO = 0.3;

  let floodRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    // Water is usually bluish or grayish
    // const isWaterColor = b > 100 && b > r && b > g;
    const isWaterColor =
      b > 100 && b > r && b > g && Math.abs(r - g) < 30 && Math.abs(g - b) < 60;

    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = r + g + b;
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    if (isWaterColor && intensityChange > intensityThreshold) {
      floodPixels++;
    }
    // document.getElementById("status").innerText =
    //   "Flood: " +
    //   window.floodDetectionEnabled +
    //   " " +
    //   threshold +
    //   " " +
    //   floodRatioThreshold.toFixed(3) +
    //   " " +
    //   (floodPixels / totalPixels).toFixed(3) +
    //   " " +
    //   floodPixels +
    //   " " +
    //   intensityChange +
    //   " " +
    //   totalPixels;
  }

  return floodPixels / totalPixels > floodRatioThreshold;
}
