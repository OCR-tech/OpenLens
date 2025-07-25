// =========================================//
// FALLING DETECTION FUNCTIONS
function toggleFallingDetection() {
  const fallingSwitch = document.getElementById("falling-switch");
  const fallingSensitivitySlider = document.getElementById(
    "falling-sensitivity-slider"
  );
  const fallingStatusNormal = document.getElementById("falling-status-normal");
  const fallingStatusWarn = document.getElementById("falling-status-warn");
  const fallingStatusAlert = document.getElementById("falling-status-alert");
  const fallingStatus = document.getElementById("falling-status");

  if (
    !fallingStatusNormal ||
    !fallingStatusWarn ||
    !fallingStatusAlert ||
    !fallingStatus
  )
    return;
  if (!fallingSwitch || !fallingSensitivitySlider) return;

  window.fallingDetectionEnabled = fallingSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Falling Detection " + (fallingSwitch.checked ? "On" : "Off")
    );
  }

  fallingSensitivitySlider.disabled = !fallingSwitch.checked;
  fallingStatusNormal.style.display = fallingSwitch.checked
    ? "inline-block"
    : "none";
  fallingStatusWarn.style.display = fallingSwitch.checked
    ? "inline-block"
    : "none";
  fallingStatusAlert.style.display = fallingSwitch.checked
    ? "inline-block"
    : "none";
  fallingStatus.innerHTML = fallingSwitch.checked
    ? 'Falling: <b style="color:green">o</b>'
    : 'Falling: <b style="color:blue">-</b>';

  localStorage.setItem(
    "fallingDetectionMode",
    fallingSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("fallingSensitivity", fallingSensitivitySlider.value);
}

// =========================================//
function updateValueFalling(val) {
  const slider = document.getElementById("falling-sensitivity-slider");
  const fallingSensitivityValue = document.getElementById(
    "falling-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  fallingSensitivityValue.textContent = val;
  window.fallingSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("fallingSensitivity", window.fallingSensitivity);
}

// =========================================//
function setFallingDetectionMode(mode) {
  const fallingSwitch = document.getElementById("falling-switch");
  const fallingSensitivitySlider = document.getElementById(
    "falling-sensitivity-slider"
  );
  const fallingSensitivityValue = document.getElementById(
    "falling-sensitivity-value"
  );
  const fallingStatusNormal = document.getElementById("falling-status-normal");
  const fallingStatusWarn = document.getElementById("falling-status-warn");
  const fallingStatusAlert = document.getElementById("falling-status-alert");

  if (fallingSwitch && fallingSensitivitySlider) {
    fallingSwitch.checked = mode === "on";
    fallingSwitch.dispatchEvent(new Event("change"));
    fallingSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("fallingSensitivity") || 0;
    fallingSensitivitySlider.value = sensitivityValue;
    fallingSensitivityValue.textContent = sensitivityValue;
  }

  if (fallingStatusNormal && fallingStatusWarn && fallingStatusAlert) {
    fallingStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    fallingStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    fallingStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setFallingSensitivity(value) {
  const fallingSensitivitySlider = document.getElementById(
    "falling-sensitivity-slider"
  );
  const fallingSensitivityValue = document.getElementById(
    "falling-sensitivity-value"
  );

  if (!fallingSensitivitySlider) return;
  fallingSensitivitySlider.value = value;
  fallingSensitivityValue.textContent = value;

  fallingSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("fallingSensitivity", value);
}

// =========================================//
// Function to update falling detection status
function updateFallingDetection() {
  // alert("Falling detection");

  const fallingStatusNormal = document.getElementById("falling-status-normal");
  const fallingStatusWarn = document.getElementById("falling-status-warn");
  const fallingStatusAlert = document.getElementById("falling-status-alert");
  const fallingStatus = document.getElementById("falling-status");

  const canvas = document.getElementById("overlay");
  const fallingSwitch = document.getElementById("falling-switch");

  const source =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("video") ||
    document.getElementById("image") ||
    document.getElementById("image-file-viewer");

  if (!canvas || !fallingSwitch || !fallingSwitch.checked || !source) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (source instanceof HTMLVideoElement) {
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
  } else if (source instanceof HTMLImageElement) {
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
    source.crossOrigin = "anonymous"; // Set Cross-Origin Attribute
  } else {
    document.getElementById("status").innerText = "No video found";
    return;
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevFallingFrame = window.currFallingFrame || currFrame;
  window.currFallingFrame = currFrame;

  const threshold = parseInt(localStorage.getItem("fallingSensitivity")) || 0;

  const fallingDetected = detectFalling(
    window.prevFallingFrame,
    window.currFallingFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  if (fallingDetected) {
    fallingStatus.innerHTML = 'Falling: <b style="color:red">X</b>';
    fallingStatusNormal.style.boxShadow = "none";
    fallingStatusWarn.style.boxShadow = "none";
    fallingStatusAlert.style.boxShadow = "0 0 5px 5px pink";
  } else {
    fallingStatus.innerHTML = 'Falling: <b style="color:green">o</b>';
    fallingStatusNormal.style.boxShadow = "0 0 5px 5px green";
    fallingStatusWarn.style.boxShadow = "none";
    fallingStatusAlert.style.boxShadow = "none";
  }
}

// =========================================//
// Advanced falling detection based on pixel intensity, color, and sudden movement
function detectFalling(prevFrame, currFrame, width, height, threshold) {
  if (!prevFrame || !currFrame) return false;

  let fallingPixels = 0;
  let suddenChangePixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 80; // Sudden movement is often brighter/darker
  const movementThreshold = 60; // Large pixel change for movement
  const MOST_SENSITIVE_RATIO = 0.5;
  const LEAST_SENSITIVE_RATIO = 0.45;
  let fallingRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  // Detect sudden changes in pixel intensity (simulating a falling event)
  for (let i = 0; i < totalPixels * 4; i += 4) {
    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = currFrame[i] + currFrame[i + 1] + currFrame[i + 2];
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    // Falling pixels: sudden large change in intensity
    const isFallingPixel = intensityChange > intensityThreshold;

    if (isFallingPixel) {
      fallingPixels++;
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
  const fallingDetected =
    fallingPixels / totalPixels > fallingRatioThreshold ||
    suddenChangePixels / totalPixels > fallingRatioThreshold / 2;

  // document.getElementById("status").innerText =
  //   "Falling: " +
  //   window.fallingDetectionEnabled +
  //   " " +
  //   threshold +
  //   " " +
  //   fallingRatioThreshold.toFixed(3) +
  //   " " +
  //   (fallingPixels / totalPixels).toFixed(3) +
  //   " " +
  //   fallingPixels +
  //   " Sudden: " +
  //   suddenChangePixels +
  //   " " +
  //   totalPixels;

  return fallingDetected;
}
