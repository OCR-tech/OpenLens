// =========================================//
// FIRE DETECTION FUNCTIONS
function toggleFireDetection() {
  const fireSwitch = document.getElementById("fire-switch");
  const fireSensitivitySlider = document.getElementById(
    "fire-sensitivity-slider"
  );
  const fireStatusNormal = document.getElementById("fire-status-normal");
  const fireStatusWarn = document.getElementById("fire-status-warn");
  const fireStatusAlert = document.getElementById("fire-status-alert");

  if (!fireSwitch || !fireSensitivitySlider) return;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Fire Detection " + (fireSwitch.checked ? "On" : "Off"));
  }

  fireSensitivitySlider.disabled = !fireSwitch.checked;
  fireStatusNormal.style.display = fireSwitch.checked ? "inline-block" : "none";
  fireStatusWarn.style.display = fireSwitch.checked ? "inline-block" : "none";
  fireStatusAlert.style.display = fireSwitch.checked ? "inline-block" : "none";

  localStorage.setItem("fireDetectionMode", fireSwitch.checked ? "on" : "off");
  localStorage.setItem("fireSensitivity", fireSensitivitySlider.value);
}

// =========================================//
function updateValueFire(val) {
  const slider = document.getElementById("fire-sensitivity-slider");
  const fireSensitivityValue = document.getElementById(
    "fire-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
    // slider.dispatchEvent(new Event("input"));
  }

  fireSensitivityValue.textContent = val;
  window.fireSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("fireSensitivity", window.fireSensitivity);
}

// =========================================//
function setFireDetectionMode(mode) {
  const fireSwitch = document.getElementById("fire-switch");
  const fireSensitivitySlider = document.getElementById(
    "fire-sensitivity-slider"
  );
  const fireSensitivityValue = document.getElementById(
    "fire-sensitivity-value"
  );
  const fireStatusNormal = document.getElementById("fire-status-normal");
  const fireStatusWarn = document.getElementById("fire-status-warn");
  const fireStatusAlert = document.getElementById("fire-status-alert");

  if (fireSwitch && fireSensitivitySlider) {
    fireSwitch.checked = mode === "on";
    fireSwitch.dispatchEvent(new Event("change"));
    fireSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("fireSensitivity") || 0;
    fireSensitivitySlider.value = sensitivityValue;
    fireSensitivityValue.textContent = sensitivityValue;
  }

  if (fireStatusNormal && fireStatusWarn && fireStatusAlert) {
    fireStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    fireStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    fireStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setFireSensitivity(value) {
  const fireSensitivitySlider = document.getElementById(
    "fire-sensitivity-slider"
  );
  const motionSensitivityValue = document.getElementById(
    "motion-sensitivity-value"
  );

  if (!fireSensitivitySlider) return;
  fireSensitivitySlider.value = value;
  motionSensitivityValue.textContent = value;

  fireSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("fireSensitivity", value);
}

// =========================================//
// Function to update fire detection status
function updateFireDetection() {
  const video = document.getElementById("video-file-player");
  const canvas = document.getElementById("overlay");
  const fireSwitch = document.getElementById("fire-switch");
  if (!video || !canvas || !fireSwitch || !fireSwitch.checked) return;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevFireFrame = window.currFireFrame || currFrame;
  window.currFireFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("fireSensitivity")) || 0;

  const fireDetected = detectFire(
    window.prevFireFrame,
    window.currFireFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (fireDetected) {
    document.getElementById("fire-status-normal").style.boxShadow = "none";
    document.getElementById("fire-status-warn").style.boxShadow = "none";
    document.getElementById("fire-status-alert").style.boxShadow =
      "0 0 10px 10px red";
  } else {
    document.getElementById("fire-status-normal").style.boxShadow =
      "0 0 10px 10px green";
    document.getElementById("fire-status-warn").style.boxShadow = "none";
    document.getElementById("fire-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Simple fire detection based on color (red/yellow/orange) and intensity changes
function detectFire(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let firePixels = 0;
  const totalPixels = width * height;
  const MOST_SENSITIVE_RATIO = 0.01;
  const LEAST_SENSITIVE_RATIO = 0.001;
  let FIRE_RATIO_THRESHOLD =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    const isFireColor =
      r > 150 && g > 50 && g < 200 && b < 100 && r > g && g > b;

    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = r + g + b;
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    // if (isFireColor && intensityChange > threshold) {
    if (isFireColor && intensityChange > 50) {
      firePixels++;
    }
  }

  return firePixels / totalPixels > FIRE_RATIO_THRESHOLD; // 0.002
}
