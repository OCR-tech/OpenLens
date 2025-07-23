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
  const motionStatus = document.getElementById("motion-status");

  if (
    !motionStatusNormal ||
    !motionStatusWarn ||
    !motionStatusAlert ||
    !motionStatus
  )
    return;

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

  motionStatus.innerHTML = motionSwitch.checked
    ? 'Motion: <b style="color:green">o</b>'
    : 'Motion: <b style="color:blue">-</b>';

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
  // alert("updateMotionDetection");

  const motionStatusNormal = document.getElementById("motion-status-normal");
  const motionStatusWarn = document.getElementById("motion-status-warn");
  const motionStatusAlert = document.getElementById("motion-status-alert");
  const motionStatus = document.getElementById("motion-status");

  const canvas = document.getElementById("overlay");
  const motionSwitch = document.getElementById("motion-switch");

  if (!canvas || !motionSwitch || !motionSwitch.checked) return;

  canvas.width = widthVideo;
  canvas.height = heightVideo;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
    motionStatus.innerHTML = 'Motion: <b style="color:red">X</b>';
    motionStatusNormal.style.boxShadow = "none";
    motionStatusWarn.style.boxShadow = "none";
    motionStatusAlert.style.boxShadow = "0 0 5px 5px brown";
  } else {
    motionStatus.innerHTML = 'Motion: <b style="color:green">o</b>';
    motionStatusNormal.style.boxShadow = "0 0 5px 5px green";
    motionStatusWarn.style.boxShadow = "none";
    motionStatusAlert.style.boxShadow = "none";
  }
}

// =========================================//
// Simple motion detection based on pixel intensity changes
// function detectMotion0(prevFrame, currFrame, width, height, threshold) {
//   if (!prevFrame || !currFrame) return false;

//   let motionPixels = 0;
//   const totalPixels = width * height;
//   const intensityThreshold = 30;
//   const MOST_SENSITIVE_RATIO = 1.0;
//   const LEAST_SENSITIVE_RATIO = 0.85;

//   let motionRatioThreshold =
//     LEAST_SENSITIVE_RATIO +
//     ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

//   for (let i = 0; i < totalPixels * 4; i += 4) {
//     // for (let i = 0; i < totalPixels * 2; i += 2) {
//     const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
//     const currIntensity = currFrame[i] + currFrame[i + 1] + currFrame[i + 2];
//     const intensityChange = Math.abs(currIntensity - prevIntensity);

//     if (intensityChange > intensityThreshold) {
//       motionPixels++;
//     }

//     // document.getElementById("status").innerText =
//     //   "Motion: " +
//     //   window.motionDetectionEnabled +
//     //   " " +
//     //   threshold +
//     //   " " +
//     //   motionRatioThreshold.toFixed(3) +
//     //   " " +
//     //   (motionPixels / totalPixels).toFixed(3) +
//     //   " " +
//     //   motionPixels +
//     //   " " +
//     //   intensityChange +
//     //   " " +
//     //   totalPixels;
//   }

//   return motionPixels / totalPixels > motionRatioThreshold;
// }

// =========================================//
// Advanced motion detection using pixel intensity, color difference, and noise reduction
function detectMotion(prevFrame, currFrame, width, height, threshold) {
  // alert("detectMotion");

  if (!prevFrame || !currFrame) return false;

  let motionPixels = 0;
  const totalPixels = width * height;
  const intensityThreshold = 50; // Lower for more sensitivity
  const colorThreshold = 50; // Color difference threshold
  const blurRadius = 1; // Simple noise reduction (box blur)
  const MOST_SENSITIVE_RATIO = 0.8;
  const LEAST_SENSITIVE_RATIO = 0.4;

  let motionRatioThreshold =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;

  // Optional: Simple box blur for noise reduction (on currFrame only)
  // This is a fast approximation, not a true blur
  function blurFrame(frame, w, h) {
    const blurred = new Uint8ClampedArray(frame.length);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let dy = -blurRadius; dy <= blurRadius; dy++) {
          for (let dx = -blurRadius; dx <= blurRadius; dx++) {
            const nx = x + dx,
              ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const idx = (ny * w + nx) * 4;
              r += frame[idx];
              g += frame[idx + 1];
              b += frame[idx + 2];
              count++;
            }
          }
        }
        const i = (y * w + x) * 4;
        blurred[i] = r / count;
        blurred[i + 1] = g / count;
        blurred[i + 2] = b / count;
        blurred[i + 3] = frame[i + 3];
      }
    }
    return blurred;
  }

  // Apply blur to current frame for noise reduction
  const blurredCurrFrame = blurFrame(currFrame, width, height);

  for (let i = 0; i < totalPixels * 4; i += 4) {
    // Intensity difference
    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity =
      blurredCurrFrame[i] + blurredCurrFrame[i + 1] + blurredCurrFrame[i + 2];
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    // Color difference (Euclidean distance)
    const dr = Math.abs(blurredCurrFrame[i] - prevFrame[i]);
    const dg = Math.abs(blurredCurrFrame[i + 1] - prevFrame[i + 1]);
    const db = Math.abs(blurredCurrFrame[i + 2] - prevFrame[i + 2]);
    const colorDiff = Math.sqrt(dr * dr + dg * dg + db * db);

    // Advanced motion pixel detection
    if (intensityChange > intensityThreshold || colorDiff > colorThreshold) {
      // if (colorDiff > colorThreshold) {
      // if (intensityChange > intensityThreshold) {
      motionPixels++;
    }

    // document.getElementById("status").innerText =
    //   "Motion: " +
    //   window.motionDetectionEnabled +
    //   " " +
    //   threshold +
    //   " " +
    //   motionRatioThreshold.toFixed(3) +
    //   " " +
    //   (motionPixels / totalPixels).toFixed(3) +
    //   " " +
    //   motionPixels +
    //   " " +
    //   intensityChange +
    //   " " +
    //   totalPixels;
  }

  // Optionally: require a minimum number of contiguous motion pixels (not implemented here)
  return motionPixels / totalPixels > motionRatioThreshold;
}
