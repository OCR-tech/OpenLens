// =========================================//
// LIGHT DETECTION FUNCTIONS
function toggleLightDetection() {
  const lightSwitch = document.getElementById("light-switch");
  const lightSensitivitySlider = document.getElementById(
    "light-sensitivity-slider"
  );
  const lightStatusNormal = document.getElementById("light-status-normal");
  const lightStatusWarn = document.getElementById("light-status-warn");
  const lightStatusAlert = document.getElementById("light-status-alert");
  const lightStatus = document.getElementById("light-status");

  if (
    !lightStatusNormal ||
    !lightStatusWarn ||
    !lightStatusAlert ||
    !lightStatus
  )
    return;
  if (!lightSwitch || !lightSensitivitySlider) return;

  window.lightDetectionEnabled = lightSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Light Detection " + (lightSwitch.checked ? "On" : "Off"));
  }

  lightSensitivitySlider.disabled = !lightSwitch.checked;
  lightStatusNormal.style.display = lightSwitch.checked
    ? "inline-block"
    : "none";
  lightStatusWarn.style.display = lightSwitch.checked ? "inline-block" : "none";
  lightStatusAlert.style.display = lightSwitch.checked
    ? "inline-block"
    : "none";
  lightStatus.innerHTML = lightSwitch.checked
    ? 'Light: <b style="color:green">o</b>'
    : 'Light: <b style="color:blue">-</b>';

  localStorage.setItem(
    "lightDetectionMode",
    lightSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("lightSensitivity", lightSensitivitySlider.value);
}

// =========================================//
function updateValueLight(val) {
  const slider = document.getElementById("light-sensitivity-slider");
  const lightSensitivityValue = document.getElementById(
    "light-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  lightSensitivityValue.textContent = val;
  window.lightSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("lightSensitivity", window.lightSensitivity);
}

// =========================================//
function setLightDetectionMode(mode) {
  const lightSwitch = document.getElementById("light-switch");
  const lightSensitivitySlider = document.getElementById(
    "light-sensitivity-slider"
  );
  const lightSensitivityValue = document.getElementById(
    "light-sensitivity-value"
  );
  const lightStatusNormal = document.getElementById("light-status-normal");
  const lightStatusWarn = document.getElementById("light-status-warn");
  const lightStatusAlert = document.getElementById("light-status-alert");

  if (lightSwitch && lightSensitivitySlider) {
    lightSwitch.checked = mode === "on";
    lightSwitch.dispatchEvent(new Event("change"));
    lightSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("lightSensitivity") || 0;
    lightSensitivitySlider.value = sensitivityValue;
    lightSensitivityValue.textContent = sensitivityValue;
  }

  if (lightStatusNormal && lightStatusWarn && lightStatusAlert) {
    lightStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    lightStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    lightStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setLightSensitivity(value) {
  const lightSensitivitySlider = document.getElementById(
    "light-sensitivity-slider"
  );
  const lightSensitivityValue = document.getElementById(
    "light-sensitivity-value"
  );

  if (!lightSensitivitySlider) return;
  lightSensitivitySlider.value = value;
  lightSensitivityValue.textContent = value;

  lightSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("lightSensitivity", value);
}

// =========================================//
// Function to update light detection status
function updateLightDetection() {
  const lightStatusNormal = document.getElementById("light-status-normal");
  const lightStatusWarn = document.getElementById("light-status-warn");
  const lightStatusAlert = document.getElementById("light-status-alert");
  const lightStatus = document.getElementById("light-status");

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
  const lightSwitch = document.getElementById("light-switch");
  if (!video || !canvas || !lightSwitch || !lightSwitch.checked) return;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevLightFrame = window.currLightFrame || currFrame;
  window.currLightFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("lightSensitivity")) || 0;

  const lightDetected = detectLight(
    window.prevLightFrame,
    window.currLightFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (lightDetected) {
    lightStatus.innerHTML = 'Light: <b style="color:red">X</b>';
    lightStatusNormal.style.boxShadow = "none";
    lightStatusWarn.style.boxShadow = "none";
    lightStatusAlert.style.boxShadow = "0 0 5px 5px orange";
  } else {
    lightStatus.innerHTML = 'Light: <b style="color:green">o</b>';
    lightStatusNormal.style.boxShadow = "0 0 5px 5px green";
    lightStatusWarn.style.boxShadow = "none";
    lightStatusAlert.style.boxShadow = "none";
  }
}

// =========================================//
function detectLight(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  const totalPixels = width * height;
  let prevTotalIntensity = 0;
  let currTotalIntensity = 0;
  const histogram = new Array(256).fill(0);

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const prevIntensity = Math.round(
      (prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2]) / 3
    );
    const currIntensity = Math.round(
      (currFrame[i] + currFrame[i + 1] + currFrame[i + 2]) / 3
    );
    prevTotalIntensity += prevIntensity;
    currTotalIntensity += currIntensity;
    histogram[currIntensity]++;
  }

  const prevAvgIntensity = prevTotalIntensity / totalPixels;
  const currAvgIntensity = currTotalIntensity / totalPixels;
  const intensityChange = Math.abs(currAvgIntensity - prevAvgIntensity);

  // Histogram peak detection (simple example)
  const peak = Math.max(...histogram);
  const peakIndex = histogram.indexOf(peak);

  // Adaptive threshold
  const minChange = 80;
  const maxChange = 100;
  const intensityThreshold =
    minChange + ((maxChange - minChange) * (10 - threshold)) / 10;

  // Advanced: trigger if intensity change OR histogram peak shifts significantly
  const histogramChange =
    Math.abs(peakIndex - Math.round(prevAvgIntensity)) > 100;

  // document.getElementById("status").innerText =
  //   "Light: " +
  //   window.lightDetectionEnabled +
  //   " " +
  //   threshold +
  //   " " +
  //   intensityThreshold.toFixed(1) +
  //   " " +
  //   intensityChange.toFixed(1) +
  //   " " +
  //   peakIndex +
  //   " " +
  //   prevAvgIntensity.toFixed(1) +
  //   " " +
  //   Math.abs(peakIndex - Math.round(prevAvgIntensity)) +
  //   " " +
  //   histogramChange;

  return intensityChange > intensityThreshold || histogramChange;
}
