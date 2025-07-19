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

  window.fireDetectionEnabled = fireSwitch.checked;

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
  const fireSensitivityValue = document.getElementById(
    "fire-sensitivity-value"
  );

  if (!fireSensitivitySlider) return;
  fireSensitivitySlider.value = value;
  fireSensitivityValue.textContent = value;

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
      "0 0 10px 10px orange";
  } else {
    document.getElementById("fire-status-normal").style.boxShadow =
      "0 0 10px 10px green";
    document.getElementById("fire-status-warn").style.boxShadow = "none";
    document.getElementById("fire-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Simple fire detection based on color (orange/yellow/red) and intensity changes
function detectFire(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let firePixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 40;
  const MOST_SENSITIVE_RATIO = 0.05;
  const LEAST_SENSITIVE_RATIO = 0.003;

  let fireRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    // Fire is usually reddish/orange/yellow, so r is high, g moderate, b low
    const isFireColor =
      r > 150 && g > 80 && b < 80 && r > g && g > b && r - g > 40 && g - b > 20;

    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = r + g + b;
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    if (isFireColor && intensityChange > intensityThreshold) {
      firePixels++;
    }
    document.getElementById("status").innerText =
      "Fire: " +
      window.fireDetectionEnabled +
      " " +
      threshold +
      " " +
      fireRatioThreshold.toFixed(3) +
      " " +
      (firePixels / totalPixels).toFixed(3) +
      " " +
      firePixels +
      " " +
      intensityChange +
      " " +
      totalPixels;
  }

  return firePixels / totalPixels > fireRatioThreshold;
}

// =========================================//
// Simple fire detection based on color (red/yellow/orange) and intensity changes
// function detectFire(prevFrame, currFrame, width, height, threshold) {
//   if (!prevFrame || !currFrame) return false;

//   let firePixels = 0;
//   const totalPixels = width * height;
//   const intensityThreshold = 50;
//   const MOST_SENSITIVE_RATIO = 0.003; // least sensitive // 0  => 0.003
//   const LEAST_SENSITIVE_RATIO = 0.0015; // most sensitive  // 10 => 0.0015

//   let fireRatioThreshold =
//     LEAST_SENSITIVE_RATIO +
//     ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

//   // document.getElementById("status").innerText = "Fire";

//   for (let i = 0; i < totalPixels * 4; i += 4) {
//     const r = currFrame[i];
//     const g = currFrame[i + 1];
//     const b = currFrame[i + 2];

//     const isFireColor =
//       r > 150 && g > 50 && g < 200 && b < 100 && r > g && g > b;

//     const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
//     const currIntensity = r + g + b;
//     const intensityChange = Math.abs(currIntensity - prevIntensity);

//     if (isFireColor && intensityChange > intensityThreshold) {
//       firePixels++;

//       document.getElementById("status").innerText =
//         "Fire: " +
//         window.fireDetectionEnabled +
//         " " +
//         threshold +
//         " " +
//         fireRatioThreshold.toFixed(3) +
//         " " +
//         (firePixels / totalPixels).toFixed(3) +
//         " " +
//         firePixels +
//         " " +
//         intensityChange.toFixed(1) +
//         " " +
//         totalPixels;
//     }
//   }

//   return firePixels / totalPixels > fireRatioThreshold; // 0.002
// }
