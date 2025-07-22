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
  const fireStatus = document.getElementById("fire-status");

  if (!fireStatusNormal || !fireStatusWarn || !fireStatusAlert || !fireStatus)
    return;
  if (!fireSwitch || !fireSensitivitySlider) return;

  window.fireDetectionEnabled = fireSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Fire Detection " + (fireSwitch.checked ? "On" : "Off"));
  }

  fireSensitivitySlider.disabled = !fireSwitch.checked;
  fireStatusNormal.style.display = fireSwitch.checked ? "inline-block" : "none";
  fireStatusWarn.style.display = fireSwitch.checked ? "inline-block" : "none";
  fireStatusAlert.style.display = fireSwitch.checked ? "inline-block" : "none";
  fireStatus.innerHTML = fireSwitch.checked
    ? 'Fire: <b style="color:green">o</b>'
    : 'Fire: <b style="color:blue">-</b>';

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
  const fireStatusNormal = document.getElementById("fire-status-normal");
  const fireStatusWarn = document.getElementById("fire-status-warn");
  const fireStatusAlert = document.getElementById("fire-status-alert");
  const fireStatus = document.getElementById("fire-status");

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
    fireStatus.innerHTML = 'Fire: <b style="color:red">X</b>';
    fireStatusNormal.style.boxShadow = "none";
    fireStatusWarn.style.boxShadow = "none";
    fireStatusAlert.style.boxShadow = "0 0 5px 5px red";
  } else {
    fireStatus.innerHTML = 'Fire: <b style="color:green">o</b>';
    fireStatusNormal.style.boxShadow = "0 0 5px 5px green";
    fireStatusWarn.style.boxShadow = "none";
    fireStatusAlert.style.boxShadow = "none";
  }
}

// =========================================//
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;
  let d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, v];
}

// =========================================//
// Simple fire detection based on color (orange/yellow/red) and intensity changes
function detectFire(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let firePixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 15;
  const MOST_SENSITIVE_RATIO = 0.005;
  const LEAST_SENSITIVE_RATIO = 0.002;

  let fireRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    // Fire is usually reddish/orange/yellow, so r is high, g moderate, b low
    // const isFireColor =
    //   r > 150 &&
    //   g > 100 &&
    //   b < 100 &&
    //   r > g &&
    //   g > b &&
    //   r - g > 40 &&
    //   g - b > 20;

    const [h, s, v] = rgbToHsv(r, g, b);
    const isFireColor = h >= 10 && h <= 60 && s > 0.4 && v > 0.5;

    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = r + g + b;
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    if (isFireColor && intensityChange > intensityThreshold) {
      firePixels++;
    }
    // document.getElementById("status").innerText =
    //   "Fire: " +
    //   window.fireDetectionEnabled +
    //   " " +
    //   threshold +
    //   " " +
    //   fireRatioThreshold.toFixed(3) +
    //   " " +
    //   (firePixels / totalPixels).toFixed(3) +
    //   " " +
    //   firePixels +
    //   " " +
    //   intensityChange +
    //   " " +
    //   totalPixels +
    //   " " +
    //   isFireColor +
    //   " " +
    //   intensityChange +
    //   " " +
    //   (isFireColor && intensityChange);
  }

  return firePixels / totalPixels > fireRatioThreshold;
}
