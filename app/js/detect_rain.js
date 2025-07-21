// =========================================//
// RAIN DETECTION FUNCTIONS
function toggleRainDetection() {
  const rainSwitch = document.getElementById("rain-switch");
  const rainSensitivitySlider = document.getElementById(
    "rain-sensitivity-slider"
  );
  const rainStatusNormal = document.getElementById("rain-status-normal");
  const rainStatusWarn = document.getElementById("rain-status-warn");
  const rainStatusAlert = document.getElementById("rain-status-alert");

  if (!rainSwitch || !rainSensitivitySlider) return;

  window.rainDetectionEnabled = rainSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Rain Detection " + (rainSwitch.checked ? "On" : "Off"));
  }

  rainSensitivitySlider.disabled = !rainSwitch.checked;
  rainStatusNormal.style.display = rainSwitch.checked ? "inline-block" : "none";
  rainStatusWarn.style.display = rainSwitch.checked ? "inline-block" : "none";
  rainStatusAlert.style.display = rainSwitch.checked ? "inline-block" : "none";

  localStorage.setItem("rainDetectionMode", rainSwitch.checked ? "on" : "off");
  localStorage.setItem("rainSensitivity", rainSensitivitySlider.value);
}

// =========================================//
function updateValueRain(val) {
  const slider = document.getElementById("rain-sensitivity-slider");
  const rainSensitivityValue = document.getElementById(
    "rain-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  rainSensitivityValue.textContent = val;
  window.rainSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("rainSensitivity", window.rainSensitivity);
}

// =========================================//
function setRainDetectionMode(mode) {
  const rainSwitch = document.getElementById("rain-switch");
  const rainSensitivitySlider = document.getElementById(
    "rain-sensitivity-slider"
  );
  const rainSensitivityValue = document.getElementById(
    "rain-sensitivity-value"
  );
  const rainStatusNormal = document.getElementById("rain-status-normal");
  const rainStatusWarn = document.getElementById("rain-status-warn");
  const rainStatusAlert = document.getElementById("rain-status-alert");

  if (rainSwitch && rainSensitivitySlider) {
    rainSwitch.checked = mode === "on";
    rainSwitch.dispatchEvent(new Event("change"));
    rainSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("rainSensitivity") || 0;
    rainSensitivitySlider.value = sensitivityValue;
    rainSensitivityValue.textContent = sensitivityValue;
  }

  if (rainStatusNormal && rainStatusWarn && rainStatusAlert) {
    rainStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    rainStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    rainStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setRainSensitivity(value) {
  const rainSensitivitySlider = document.getElementById(
    "rain-sensitivity-slider"
  );
  const rainSensitivityValue = document.getElementById(
    "rain-sensitivity-value"
  );

  if (!rainSensitivitySlider) return;
  rainSensitivitySlider.value = value;
  rainSensitivityValue.textContent = value;

  rainSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("rainSensitivity", value);
}

// =========================================//
// Function to update rain detection status
function updateRainDetection() {
  // alert("Rain detection");

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
  const rainSwitch = document.getElementById("rain-switch");
  if (!video || !canvas || !rainSwitch || !rainSwitch.checked) return;

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevRainFrame = window.currRainFrame || currFrame;
  window.currRainFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("rainSensitivity")) || 0;

  const rainDetected = detectRain(
    window.prevRainFrame,
    window.currRainFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (rainDetected) {
    document.getElementById("rain-status").innerHTML =
      'Rain: <b style="color:red">X</b>';
    document.getElementById("rain-status-normal").style.boxShadow = "none";
    document.getElementById("rain-status-warn").style.boxShadow = "none";
    document.getElementById("rain-status-alert").style.boxShadow =
      "0 0 5px 5px blue"; // Use a more vivid blue for alert
  } else {
    document.getElementById("rain-status").innerHTML =
      'Rain: <b style="color:green">--</b>';
    document.getElementById("rain-status-normal").style.boxShadow =
      "0 0 5px 5px green";
    document.getElementById("rain-status-warn").style.boxShadow = "none";
    document.getElementById("rain-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Advanced rain detection based on pixel intensity, color, and streak pattern
function detectRain(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let rainPixels = 0;
  let streakPixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 40; // Rain streaks are often brighter
  const blueThreshold = 100; // Rain can reflect blue/gray sky
  const streakLength = 3; // Minimum streak length for rain

  const MOST_SENSITIVE_RATIO = 0.8;
  const LEAST_SENSITIVE_RATIO = 0.6;
  let rainRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  // Detect bright changes and blueish pixels
  for (let i = 0; i < totalPixels * 4; i += 4) {
    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = currFrame[i] + currFrame[i + 1] + currFrame[i + 2];
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    // Rain pixels: sudden bright change and blueish/grayish color
    const isRainPixel =
      intensityChange > intensityThreshold &&
      b > blueThreshold &&
      Math.abs(r - g) < 40 &&
      Math.abs(g - b) < 60;

    if (isRainPixel) {
      rainPixels++;
      // Streak detection: check vertical neighbors for similar rain pixels
      const pixelIndex = i / 4;
      const belowIndex = pixelIndex + width;
      if (
        belowIndex < totalPixels &&
        Math.abs(currFrame[belowIndex * 4] - r) < 30 &&
        Math.abs(currFrame[belowIndex * 4 + 1] - g) < 30 &&
        Math.abs(currFrame[belowIndex * 4 + 2] - b) < 30
      ) {
        streakPixels++;
      }
    }
  }

  // Optionally, use streakPixels for more robust detection
  const rainDetected =
    rainPixels / totalPixels > rainRatioThreshold ||
    streakPixels / totalPixels > rainRatioThreshold / 2;

  // document.getElementById("status").innerText =
  //   "Rain: " +
  //   window.rainDetectionEnabled +
  //   " " +
  //   threshold +
  //   " " +
  //   rainRatioThreshold.toFixed(3) +
  //   " " +
  //   (rainPixels / totalPixels).toFixed(3) +
  //   " " +
  //   rainPixels +
  //   " Streaks: " +
  //   streakPixels +
  //   " " +
  //   totalPixels;

  return rainDetected;
}
