// =========================================//
function toggleMotionDetection() {
  // alert("toggleMotionDetection");

  const motionSwitch = document.getElementById("motion-switch");
  const motionSensitivitySlider = document.getElementById(
    "motion-sensitivity-slider"
  );
  const motionStatusNormal = document.getElementById("motion-status-normal");
  const motionStatusWarn = document.getElementById("motion-status-warn");
  const motionStatusAlert = document.getElementById("motion-status-alert");

  if (!motionSwitch || !motionSensitivitySlider) return;

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Motion Detection " + (motionSwitch.checked ? "On" : "Off")
    );
  }

  // Enable/disable motion sensitivity slider based on motion detection switch
  motionSensitivitySlider.disabled = !motionSwitch.checked;
  if (motionSwitch.checked) {
    motionStatusNormal.style.display = "inline-block";
    motionStatusWarn.style.display = "inline-block";
    motionStatusAlert.style.display = "inline-block";
  } else {
    motionStatusNormal.style.display = "none";
    motionStatusWarn.style.display = "none";
    motionStatusAlert.style.display = "none";
  }

  // Save motion detection mode and sensitivity to localStorage
  localStorage.setItem(
    "motionDetectionMode",
    motionSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("motionSensitivity", motionSensitivitySlider.value);
}

// =========================================//
function updateValueMotion(val) {
  const slider = document.getElementById("motion-sensitivity-slider");
  if (slider) {
    slider.value = val;
  }
  document.getElementById("motion-sensitivity-value").textContent = val;

  // Change the motion detection sensitivity based on the slider value
  window.motionSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("motionSensitivity", window.motionSensitivity);
  // alert("Motion sensitivity set to: " + window.motionSensitivity);
}

// =========================================//
function setMotionDetectionMode(mode) {
  // alert("setMotionDetectionMode: " + mode);

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
    // Set the switch state
    motionSwitch.checked = mode === "on";
    motionSwitch.dispatchEvent(new Event("change"));
    // Set the sensitivity slider enabled/disabled based on motion detection state
    motionSensitivitySlider.disabled = mode !== "on";
    // Set the sensitivity value
    const sensitivityValue = localStorage.getItem("motionSensitivity") || 0;
    // alert("setMotionDetectionMode: " + sensitivityValue);
    motionSensitivitySlider.value = sensitivityValue;
    motionSensitivityValue.textContent = sensitivityValue;
  }

  if (motionStatusNormal && motionStatusWarn && motionStatusAlert) {
    if (mode === "on") {
      motionStatusNormal.style.display = "inline-block";
      motionStatusWarn.style.display = "inline-block";
      motionStatusAlert.style.display = "inline-block";
    } else {
      motionStatusNormal.style.display = "none";
      motionStatusWarn.style.display = "none";
      motionStatusAlert.style.display = "none";
    }
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

  if (!motionSensitivitySlider || !motionSensitivityValue) return;

  // Set the slider value
  motionSensitivitySlider.value = value;
  motionSensitivityValue.textContent = value;

  // Optionally trigger input event if needed
  motionSensitivitySlider.dispatchEvent(new Event("input"));

  // Save to localStorage
  localStorage.setItem("motionSensitivity", value);
}

// =========================================//
// Function to update motion detection status
function updateMotionDetection() {
  // alert("updateMotionDetection");
  const video = document.getElementById("video-file-player");
  // const video = document.getElementById("usb-camera-stream");

  const canvas = document.getElementById("overlay");

  const motionSwitch = document.getElementById("motion-switch");
  if (!video || !canvas) return;

  // alert("updateMotionDetection: " + video.videoWidth + "x" + video.videoHeight);

  // Only run if motion detection is enabled
  // if (motionSwitch && !motionSwitch.checked) {
  //   document.getElementById("status").innerText = "Motion detection off";
  //   return;
  // }

  if (video.videoWidth === 0 || video.videoHeight === 0) {
    document.getElementById("status").innerText = "Video not loaded.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  window.prevFrame = window.currFrame || currFrame;
  window.currFrame = currFrame;

  // higher value means less sensitive
  const threshold = parseInt(localStorage.getItem("motionSensitivity")) || 0;
  // alert("threshold: " + threshold);

  const motionDetected = detectObjectMotion(
    window.prevFrame,
    window.currFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  // set voicealert if motion is detected
  if (motionDetected) {
    // setVoiceAlert("Motion detected");
    // document.getElementById("status").innerText = " Motion";
    document.getElementById("motion-status-normal").style.boxShadow = "none";
    document.getElementById("motion-status-warn").style.boxShadow = "none";
    document.getElementById("motion-status-alert").style.boxShadow =
      "0 0 10px 10px red";
  } else {
    // document.getElementById("status").innerText = " No motion";
    document.getElementById("motion-status-normal").style.boxShadow =
      "0 0 10px 10px green";
    document.getElementById("motion-status-warn").style.boxShadow = "none";
    document.getElementById("motion-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
function detectObjectMotion(
  prevFrame,
  currFrame,
  width,
  height,
  threshold
  // threshold = 50 // default threshold value
) {
  // alert("detectObjectMotion");
  if (!prevFrame || !currFrame) return false;

  let motionPixels = 0;
  const totalPixels = width * height;
  // const MOTION_RATIO_THRESHOLD = 0.05; // default motion ratio threshold
  // Map sensitivity slider (0 = most sensitive, 10 = least sensitive) to ratio threshold (0.2 = most sensitive, 0.001 = least sensitive)
  const MOST_SENSITIVE_RATIO = 0.02;
  const LEAST_SENSITIVE_RATIO = 0.001;
  let MOTION_RATIO_THRESHOLD =
    LEAST_SENSITIVE_RATIO +
    ((MOST_SENSITIVE_RATIO - LEAST_SENSITIVE_RATIO) * (10 - threshold)) / 10;
  // alert(threshold + " " + MOTION_RATIO_THRESHOLD);

  for (let i = 0; i < totalPixels * 4; i += 4) {
    // for (let i = 0; i < totalPixels * 4; i += 8) {
    const prevGray =
      0.299 * prevFrame[i] +
      0.587 * prevFrame[i + 1] +
      0.114 * prevFrame[i + 2];
    const currGray =
      0.299 * currFrame[i] +
      0.587 * currFrame[i + 1] +
      0.114 * currFrame[i + 2];
    // if (Math.abs(currGray - prevGray) > threshold) {
    if (Math.abs(currGray - prevGray) > 50) {
      motionPixels++;
    }
  }

  // higher value means less sensitive
  return motionPixels / totalPixels > MOTION_RATIO_THRESHOLD;
}
