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

  // Enable/disable fire sensitivity slider based on fire detection switch
  fireSensitivitySlider.disabled = !fireSwitch.checked;
  if (fireSwitch.checked) {
    fireStatusNormal.style.display = "inline-block";
    fireStatusWarn.style.display = "inline-block";
    fireStatusAlert.style.display = "inline-block";
  } else {
    fireStatusNormal.style.display = "none";
    fireStatusWarn.style.display = "none";
    fireStatusAlert.style.display = "none";
  }

  // Save fire detection mode and sensitivity to localStorage
  localStorage.setItem("fireDetectionMode", fireSwitch.checked ? "on" : "off");
  localStorage.setItem("fireSensitivity", fireSensitivitySlider.value);
}

// =========================================//
function updateFireSensitivity(val) {
  const slider = document.getElementById("fire-sensitivity-slider");
  if (slider) {
    slider.value = val;
  }

  // Change the fire detection sensitivity based on the slider value
  window.fireSensitivity = Math.max(1, Math.min(100, val));
  localStorage.setItem("fireSensitivity", window.fireSensitivity);
}

// =========================================//
function setFireDetectionMode(mode) {
  const fireSwitch = document.getElementById("fire-switch");
  const fireSensitivitySlider = document.getElementById(
    "fire-sensitivity-slider"
  );
  const fireStatusNormal = document.getElementById("fire-status-normal");
  const fireStatusWarn = document.getElementById("fire-status-warn");
  const fireStatusAlert = document.getElementById("fire-status-alert");

  if (fireSwitch && fireSensitivitySlider) {
    // Set the switch state
    fireSwitch.checked = mode === "on";
    fireSwitch.dispatchEvent(new Event("change"));
    // Set the sensitivity slider enabled/disabled based on fire detection state
    fireSensitivitySlider.disabled = mode !== "on";
    // Set the sensitivity value
    const sensitivityValue = localStorage.getItem("fireSensitivity") || 30;
    fireSensitivitySlider.value = sensitivityValue;
  }

  if (fireStatusNormal && fireStatusWarn && fireStatusAlert) {
    if (mode === "on") {
      fireStatusNormal.style.display = "inline-block";
      fireStatusWarn.style.display = "inline-block";
      fireStatusAlert.style.display = "inline-block";
    } else {
      fireStatusNormal.style.display = "none";
      fireStatusWarn.style.display = "none";
      fireStatusAlert.style.display = "none";
    }
  }
}

// =========================================//
function setFireSensitivity(value) {
  const fireSensitivitySlider = document.getElementById(
    "fire-sensitivity-slider"
  );
  if (!fireSensitivitySlider) return;

  // Set the slider value
  fireSensitivitySlider.value = value;

  // Optionally trigger input event if needed
  fireSensitivitySlider.dispatchEvent(new Event("input"));

  // Save to localStorage
  localStorage.setItem("fireSensitivity", value);
}

// =========================================//
// Function to update fire detection status
function updateFireDetection() {
  // const video = document.getElementById("video-feed");
  const video = document.getElementById("video-file-player");
  const canvas = document.getElementById("overlay");
  const fireSwitch = document.getElementById("fire-switch");
  if (!video || !canvas) return;

  // alert(video.videoWidth + " + " + video.videoHeight);

  // Check if video is loaded
  // Only run if fire detection is enabled
  if (fireSwitch && !fireSwitch.checked) {
    document.getElementById("status").innerText = "Fire detection off";
    return;
  }

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  // alert(canvas.width + " + " + canvas.height);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevFrame = window.currFrame || currFrame;
  window.currFrame = currFrame;

  // higher value means less sensitive
  const threshold = parseInt(localStorage.getItem("fireSensitivity")) || 25;

  const fireDetected = detectFire(
    window.prevFrame,
    window.currFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  // set voicealert if fire is detected
  if (fireDetected) {
    // document.getElementById("status").innerText = " Fire";
    document.getElementById("fire-status-normal").style.boxShadow = "none";
    document.getElementById("fire-status-warn").style.boxShadow = "none";
    document.getElementById("fire-status-alert").style.boxShadow =
      "0 0 10px 10px red";
  } else {
    // document.getElementById("status").innerText = " No fire";
    document.getElementById("fire-status-normal").style.boxShadow =
      "0 0 10px 10px green";
    document.getElementById("fire-status-warn").style.boxShadow = "none";
    document.getElementById("fire-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
// Simple fire detection based on color (red/yellow/orange) and intensity changes
function detectFire(prevFrame, currFrame, width, height, threshold = 50) {
  if (!prevFrame || !currFrame) return false;

  let firePixels = 0;
  const totalPixels = width * height;
  // alert(width + " + " + height);
  // alert("totalPixels:", totalPixels);

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const r = currFrame[i];
    const g = currFrame[i + 1];
    const b = currFrame[i + 2];

    // Fire color detection: high R, moderate G, low B
    const isFireColor =
      r > 150 && g > 50 && g < 200 && b < 100 && r > g && g > b;
    // r > 150 && g > 50 && g < 200 && b < 100 && r > g && g > b;

    // Intensity change detection (optional, can be removed)
    const prevIntensity = prevFrame[i] + prevFrame[i + 1] + prevFrame[i + 2];
    const currIntensity = r + g + b;
    const intensityChange = Math.abs(currIntensity - prevIntensity);

    if (isFireColor && intensityChange > threshold) {
      firePixels++;
    }
  }

  // alert("firePixels:" + firePixels + "totalPixels:" + totalPixels);

  // higher value means less sensitive
  return firePixels / totalPixels > 0.002;
}
