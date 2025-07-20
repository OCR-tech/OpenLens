// =========================================//
// SOUND DETECTION FUNCTIONS
function toggleSoundDetection() {
  const soundSwitch = document.getElementById("sound-switch");
  const soundSensitivitySlider = document.getElementById(
    "sound-sensitivity-slider"
  );
  const soundStatusNormal = document.getElementById("sound-status-normal");
  const soundStatusWarn = document.getElementById("sound-status-warn");
  const soundStatusAlert = document.getElementById("sound-status-alert");

  if (!soundSwitch || !soundSensitivitySlider) return;

  window.soundDetectionEnabled = soundSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Sound Detection " + (soundSwitch.checked ? "On" : "Off"));
  }

  soundSensitivitySlider.disabled = !soundSwitch.checked;
  soundStatusNormal.style.display = soundSwitch.checked
    ? "inline-block"
    : "none";
  soundStatusWarn.style.display = soundSwitch.checked ? "inline-block" : "none";
  soundStatusAlert.style.display = soundSwitch.checked
    ? "inline-block"
    : "none";

  localStorage.setItem(
    "soundDetectionMode",
    soundSwitch.checked ? "on" : "off"
  );
  localStorage.setItem("soundSensitivity", soundSensitivitySlider.value);
}

// =========================================//
function updateValueSound(val) {
  const slider = document.getElementById("sound-sensitivity-slider");
  const soundSensitivityValue = document.getElementById(
    "sound-sensitivity-value"
  );
  if (slider) {
    slider.value = val;
  }

  soundSensitivityValue.textContent = val;
  window.soundSensitivity = Math.max(0, Math.min(10, val));
  localStorage.setItem("soundSensitivity", window.soundSensitivity);
}

// =========================================//
function setSoundDetectionMode(mode) {
  const soundSwitch = document.getElementById("sound-switch");
  const soundSensitivitySlider = document.getElementById(
    "sound-sensitivity-slider"
  );
  const soundSensitivityValue = document.getElementById(
    "sound-sensitivity-value"
  );
  const soundStatusNormal = document.getElementById("sound-status-normal");
  const soundStatusWarn = document.getElementById("sound-status-warn");
  const soundStatusAlert = document.getElementById("sound-status-alert");

  if (soundSwitch && soundSensitivitySlider) {
    soundSwitch.checked = mode === "on";
    soundSwitch.dispatchEvent(new Event("change"));
    soundSensitivitySlider.disabled = mode !== "on";
    const sensitivityValue = localStorage.getItem("soundSensitivity") || 0;
    soundSensitivitySlider.value = sensitivityValue;
    soundSensitivityValue.textContent = sensitivityValue;
  }

  if (soundStatusNormal && soundStatusWarn && soundStatusAlert) {
    soundStatusNormal.style.display = mode === "on" ? "inline-block" : "none";
    soundStatusWarn.style.display = mode === "on" ? "inline-block" : "none";
    soundStatusAlert.style.display = mode === "on" ? "inline-block" : "none";
  }
}

// =========================================//
function setSoundSensitivity(value) {
  const soundSensitivitySlider = document.getElementById(
    "sound-sensitivity-slider"
  );
  const soundSensitivityValue = document.getElementById(
    "sound-sensitivity-value"
  );

  if (!soundSensitivitySlider) return;
  soundSensitivitySlider.value = value;
  soundSensitivityValue.textContent = value;

  soundSensitivitySlider.dispatchEvent(new Event("input"));
  localStorage.setItem("soundSensitivity", value);
}

// =========================================//
// Function to update sound detection status
function updateSoundDetection() {
  const soundSwitch = document.getElementById("sound-switch");

  if (!soundSwitch || !soundSwitch.checked) return;

  // Setup microphone input and analyser if not already done
  if (window.audioContext) {
    window.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        window.micSource = window.audioContext.createMediaStreamSource(stream);
        window.analyser = window.audioContext.createAnalyser();
        window.micSource.connect(window.analyser);
        window.soundDataArray = new Uint8Array(
          window.analyser.frequencyBinCount
        );
      })
      .catch((err) => {
        document.getElementById("status").innerText =
          "Microphone access denied.";
        return;
      });
  }

  if (!window.audioContext) return;

  // Get frequency data from microphone
  window.analyser.getByteFrequencyData(window.soundDataArray);

  const threshold = parseInt(localStorage.getItem("soundSensitivity")) || 0;
  const soundDetected = detectSound(window.soundDataArray, threshold);

  if (soundDetected) {
    document.getElementById("sound-status-normal").style.boxShadow = "none";
    document.getElementById("sound-status-warn").style.boxShadow = "none";
    document.getElementById("sound-status-alert").style.boxShadow =
      "0 0 5px 5px yellow";
  } else {
    document.getElementById("sound-status-normal").style.boxShadow =
      "0 0 5px 5px green";
    document.getElementById("sound-status-warn").style.boxShadow = "none";
    document.getElementById("sound-status-alert").style.boxShadow = "none";
  }
}

// =========================================//
function detectSound(soundDataArray, threshold) {
  // alert("DetectSound");

  if (!soundDataArray) return false;

  // Average volume
  let sum = 0;
  for (let i = 0; i < soundDataArray.length; i++) {
    sum += soundDataArray[i];
  }
  const avg = sum / soundDataArray.length;

  // Frequency band analysis (e.g., 1000Hz-4000Hz)
  const sampleRate = window.audioContext.sampleRate;
  const minFreq = 1000;
  const maxFreq = 4000;

  const minIndex = Math.floor(
    minFreq / (sampleRate / window.analyser.frequencyBinCount)
  );
  const maxIndex = Math.ceil(
    maxFreq / (sampleRate / window.analyser.frequencyBinCount)
  );

  let bandSum = 0;
  for (let i = minIndex; i <= maxIndex; i++) {
    bandSum += soundDataArray[i];
  }

  const bandAvg = bandSum / (maxIndex - minIndex + 1);

  // Sensitivity: 0 (most sensitive) to 10 (least sensitive)
  const MOST_SENSITIVE_LEVEL = 10;
  const LEAST_SENSITIVE_LEVEL = 100;
  let soundLevelThreshold =
    MOST_SENSITIVE_LEVEL +
    ((LEAST_SENSITIVE_LEVEL - MOST_SENSITIVE_LEVEL) * (10 - threshold)) / 10;

  // Peak detection
  let peak = Math.max(...soundDataArray);

  document.getElementById("status").innerText =
    "Sound: " +
    window.soundDetectionEnabled +
    " " +
    threshold +
    " " +
    soundLevelThreshold.toFixed(2) +
    " avg: " +
    avg.toFixed(1) +
    " BandAvg: " +
    bandAvg.toFixed(1) +
    " Peak: " +
    peak.toFixed(1);

  // Advanced: trigger if average, band average, or peak exceeds threshold
  return (
    avg > soundLevelThreshold ||
    bandAvg > soundLevelThreshold ||
    peak > soundLevelThreshold + 200
  );
}
