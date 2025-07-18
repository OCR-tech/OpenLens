// =========================================//
// SMOKE DETECTION FUNCTIONS
function toggleSmokeDetection() {
  const smokeSwitch = document.getElementById("smoke-switch");
  const smokeSensitivitySlider = document.getElementById(
    "smoke-sensitivity-slider"
  );
  const smokeStatusNormal = document.getElementById("smoke-status-normal");
  const smokeStatusWarn = document.getElementById("smoke-status-warn");
  const smokeStatusAlert = document.getElementById("smoke-status-alert");

  if (!smokeSwitch || !smokeSensitivitySlider) return;

  window.smokeDetectionEnabled = smokeSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Smoke Detection " + (smokeSwitch.checked ? "On" : "Off"));
  }

  smokeSensitivitySlider.disabled = !smokeSwitch.checked;
  smokeStatusNormal.style.display = smokeSwitch.checked
    ? "inline-block"
    : "none";
  smokeStatusWarn.style.display = smokeSwitch.checked ? "inline-block" : "none";
  smokeStatusAlert.style.display = smokeSwitch.checked
    ? "inline-block"
    : "none";

  localStorage.setItem(
    "smokeDetectionMode",
    smokeSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("smokeSensitivity", smokeSensitivitySlider.value);
}

// =========================================//
function updateValueSmoke(val) {
  const slider = document.getElementById("smoke-sensitivity-slider");
  const smokeSensitivityValue = document.getElementById(
    "smoke-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  smokeSensitivityValue.textContent = val;
  window.smokeSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("smokeSensitivity", window.smokeSensitivity);
}

// =========================================//
function setSmokeDetectionMode(mode) {
  const smokeSwitch = document.getElementById("smoke-switch");
  const smokeSensitivitySlider = document.getElementById(
    "smoke-sensitivity-slider"
  );
  const smokeSensitivityValue = document.getElementById(
    "smoke-sensitivity-value"
  );
  const smokeStatusNormal = document.getElementById("smoke-status-normal");
  const smokeStatusWarn = document.getElementById("smoke-status-warn");
  const smokeStatusAlert = document.getElementById("smoke-status-alert");

  if (smokeSwitch && smokeSensitivitySlider) {
    smokeSwitch.checked = mode === "on";
    smokeSwitch.dispatchEvent(new Event("change"));
    smokeSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("smokeSensitivity") || 0;
    smokeSensitivitySlider.value = sensitivityValue;
    smokeSensitivityValue.textContent = sensitivityValue;
  }

  if (smokeStatusNormal && smokeStatusWarn && smokeStatusAlert) {
    smokeStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    smokeStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    smokeStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setSmokeSensitivity(value) {
  const smokeSensitivitySlider = document.getElementById(
    "smoke-sensitivity-slider"
  );
  const smokeSensitivityValue = document.getElementById(
    "smoke-sensitivity-value"
  );

  if (!smokeSensitivitySlider) return;
  smokeSensitivitySlider.value = value;
  smokeSensitivityValue.textContent = value;

  smokeSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("smokeSensitivity", value);
}

// =========================================//
// Function to update smoke detection status
function updateSmokeDetection() {
  const video = document.getElementById("video-file-player");
  const canvas = document.getElementById("overlay");
  const smokeSwitch = document.getElementById("smoke-switch");
  if (!video || !canvas || !smokeSwitch || !smokeSwitch.checked) return;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevSmokeFrame = window.currSmokeFrame || currFrame;
  window.currSmokeFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("smokeSensitivity")) || 0;

  const smokeDetected = detectSmoke(
    window.prevSmokeFrame,
    window.currSmokeFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (smokeDetected) {
    document.getElementById("smoke-status-normal").style.boxShadow = "none";
    document.getElementById("smoke-status-warn").style.boxShadow = "none";
    document.getElementById("smoke-status-alert").style.boxShadow =
      "0 0 10px 10px gray";
  } else {
    document.getElementById("smoke-status-normal").style.boxShadow =
      "0 0 10px 10px green";
    document.getElementById("smoke-status-warn").style.boxShadow = "none";
    document.getElementById("smoke-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Simple smoke detection based on color (gray/white) and intensity changes
function detectSmoke(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let smokePixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 30;
  const MOST_SENSITIVE_RATIO = 0.05; // 0.015
  const LEAST_SENSITIVE_RATIO = 0.003;

  let smokeRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    // Smoke is usually grayish/whitish, so r, g, b are close and relatively high
    const isSmokeColor =
      Math.abs(r - g) < 20 &&
      Math.abs(g - b) < 20 &&
      Math.abs(r - b) < 20 &&
      r > 100 &&
      g > 100 &&
      b > 100;

    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = r + g + b;
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    if (isSmokeColor && intensityChange > intensityThreshold) {
      smokePixels++;
    }
    document.getElementById("status").innerText =
      "Smoke: " +
      window.smokeDetectionEnabled +
      " " +
      threshold +
      " " +
      smokeRatioThreshold.toFixed(3) +
      " " +
      (smokePixels / totalPixels).toFixed(3) +
      " " +
      smokePixels +
      " " +
      intensityChange +
      " " +
      totalPixels;
  }

  return smokePixels / totalPixels > smokeRatioThreshold;
}
