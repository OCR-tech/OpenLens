// =========================================//
// MOTION DETECTION FUNCTIONS
function toggleMotionDetection() {
  const motionSwitch = document.getElementById("motion-switch");
  const motionSensitivitySlider = document.getElementById(
    "motion-sensitivity-slider"
  );
  const motionStatusNormal = document.getElementById("motion-status-normal");
  const motionStatusWarn = document.getElementById("motion-status-warn");
  const motionStatusAlert = document.getElementById("motion-status-alert");

  if (!motionSwitch || !motionSensitivitySlider) return;

  window.motionDetectionEnabled = motionSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Motion Detection " + (motionSwitch.checked ? "On" : "Off")
    );
  }

  motionSensitivitySlider.disabled = !motionSwitch.checked;
  motionStatusNormal.style.display = motionSwitch.checked
    ? "inline-block"
    : "none";
  motionStatusWarn.style.display = motionSwitch.checked
    ? "inline-block"
    : "none";
  motionStatusAlert.style.display = motionSwitch.checked
    ? "inline-block"
    : "none";

  localStorage.setItem(
    "motionDetectionMode",
    motionSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("motionSensitivity", motionSensitivitySlider.value);
}

// =========================================//
function updateValueMotion(val) {
  const slider = document.getElementById("motion-sensitivity-slider");
  const motionSensitivityValue = document.getElementById(
    "motion-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  motionSensitivityValue.textContent = val;
  window.motionSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("motionSensitivity", window.motionSensitivity);
}

// =========================================//
function setMotionDetectionMode(mode) {
  const motionSwitch = document.getElementById("motion-switch");
  const motionSensitivitySlider = document.getElementById(
    "motion-sensitivity-slider"
  );
  const motionSensitivityValue = document.getElementById(
    "motion-sensitivity-value"
  );
  const motionStatusNormal = document.getElementById("motion-status-normal");
  const motionStatusWarn = document.getElementById("motion-status-warn");
  const motionStatusAlert = document.getElementById("motion-status-alert");

  if (motionSwitch && motionSensitivitySlider) {
    motionSwitch.checked = mode === "on";
    motionSwitch.dispatchEvent(new Event("change"));
    motionSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("motionSensitivity") || 0;
    motionSensitivitySlider.value = sensitivityValue;
    motionSensitivityValue.textContent = sensitivityValue;
  }

  if (motionStatusNormal && motionStatusWarn && motionStatusAlert) {
    motionStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    motionStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    motionStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setMotionSensitivity(value) {
  const motionSensitivitySlider = document.getElementById(
    "motion-sensitivity-slider"
  );
  const motionSensitivityValue = document.getElementById(
    "motion-sensitivity-value"
  );

  if (!motionSensitivitySlider) return;
  motionSensitivitySlider.value = value;
  motionSensitivityValue.textContent = value;

  motionSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("motionSensitivity", value);
}

// =========================================//
// Function to update motion detection status
function updateMotionDetection() {
  const video = document.getElementById("video-file-player");
  const canvas = document.getElementById("overlay");
  const motionSwitch = document.getElementById("motion-switch");
  if (!video || !canvas || !motionSwitch || !motionSwitch.checked) return;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevMotionFrame = window.currMotionFrame || currFrame;
  window.currMotionFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("motionSensitivity")) || 0;

  const motionDetected = detectMotion(
    window.prevMotionFrame,
    window.currMotionFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (motionDetected) {
    document.getElementById("motion-status-normal").style.boxShadow = "none";
    document.getElementById("motion-status-warn").style.boxShadow = "none";
    document.getElementById("motion-status-alert").style.boxShadow =
      "0 0 10px 10px orange";
  } else {
    document.getElementById("motion-status-normal").style.boxShadow =
      "0 0 10px 10px green";
    document.getElementById("motion-status-warn").style.boxShadow = "none";
    document.getElementById("motion-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Simple motion detection based on pixel intensity changes
function detectMotion(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let motionPixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 30;
  const MOST_SENSITIVE_RATIO = 0.05;
  const LEAST_SENSITIVE_RATIO = 0.01;

  let motionRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = currFrame[i] + currFrame[i + 1] + currFrame[i + 2];
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    if (intensityChange > intensityThreshold) {
      motionPixels++;
    }
    document.getElementById("status").innerText =
      "Motion: " +
      window.motionDetectionEnabled +
      " " +
      threshold +
      " " +
      motionRatioThreshold.toFixed(3) +
      " " +
      (motionPixels / totalPixels).toFixed(3) +
      " " +
      motionPixels +
      " " +
      intensityChange +
      " " +
      totalPixels;
  }

  return motionPixels / totalPixels > motionRatioThreshold;
}
