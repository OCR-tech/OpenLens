// =========================================//
function toggleMotionDetection() {
  // alert("toggleMotionDetection");

  const motionSwitch = document.getElementById("motion-switch");
  const motionSensitivitySlider = document.getElementById(
    "motion-sensitivity-slider"
  );

  if (!motionSwitch || !motionSensitivitySlider) return;

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Motion Detection " + (motionSwitch.checked ? "On" : "Off")
    );
  }

  // Enable/disable motion sensitivity slider based on motion detection switch
  motionSensitivitySlider.disabled = !motionSwitch.checked;

  // Save motion detection mode and sensitivity to localStorage
  localStorage.setItem(
    "motionDetectionMode",
    motionSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("motionSensitivity", motionSensitivitySlider.value);
}

// =========================================//
function updateMotionSensitivity(val) {
  const slider = document.getElementById("motion-sensitivity-slider");
  if (slider) {
    slider.value = val;
  }

  // Change the motion detection sensitivity based on the slider value
  window.motionSensitivity = Math.max(1, Math.min(100, val));
  localStorage.setItem("motionSensitivity", window.motionSensitivity);
}

// =========================================//
function setMotionDetectionMode(mode) {
  // alert("setMotionDetectionMode: " + mode);

  const motionSwitch = document.getElementById("motion-switch");
  const motionSensitivitySlider = document.getElementById(
    "motion-sensitivity-slider"
  );

  if (motionSwitch && motionSensitivitySlider) {
    // Set the switch state
    motionSwitch.checked = mode === "on";
    motionSwitch.dispatchEvent(new Event("change"));
    // Set the sensitivity slider enabled/disabled based on motion detection state
    motionSensitivitySlider.disabled = mode !== "on";
    // Set the sensitivity value
    const sensitivityValue = localStorage.getItem("motionSensitivity") || 30;
    motionSensitivitySlider.value = sensitivityValue;
  }
}

// =========================================//
function setMotionSensitivity(value) {
  const motionSensitivitySlider = document.getElementById(
    "motion-sensitivity-slider"
  );
  if (!motionSensitivitySlider) return;

  // Set the slider value
  motionSensitivitySlider.value = value;

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
  if (motionSwitch && !motionSwitch.checked) {
    document.getElementById("status").innerText = "Motion detection off";
    return;
  }

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
  const threshold = parseInt(localStorage.getItem("motionSensitivity")) || 80;

  const motionDetected = detectObjectMotion(
    window.prevFrame,
    window.currFrame,
    canvas.width,
    canvas.height,
    threshold
  );

  // set voicealert if motion is detected
  if (motionDetected) {
    // alert("Motion detected");
    // setVoiceAlert("Motion detected");
    document.getElementById("status").innerText = " Motion detected!";
  } else {
    document.getElementById("status").innerText = " No motion detected.";
  }
}

// =========================================//
function detectObjectMotion(
  prevFrame,
  currFrame,
  width,
  height,
  threshold = 50
) {
  // alert("detectObjectMotion");
  if (!prevFrame || !currFrame) return false;

  let motionPixels = 0;
  const totalPixels = width * height;

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const prevGray =
      0.299 * prevFrame[i] +
      0.587 * prevFrame[i + 1] +
      0.114 * prevFrame[i + 2];
    const currGray =
      0.299 * currFrame[i] +
      0.587 * currFrame[i + 1] +
      0.114 * currFrame[i + 2];
    if (Math.abs(currGray - prevGray) > threshold) {
      motionPixels++;
    }
  }

  // higher value means less sensitive
  return motionPixels / totalPixels > 0.05;
}
