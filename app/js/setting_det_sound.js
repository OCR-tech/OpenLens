// =========================================//
function toggleSoundDetection() {
  // alert("toggleSoundDetection");

  // Toggle sound detection mode
  const soundDetectionSwitch = document.getElementById("sound-switch");
  const soundSensitivitySlider = document.getElementById(
    "sound-sensitivity-slider"
  );

  if (window.soundDetectionEnabled) {
    playVoiceStatus(
      "Sound Detection " + (soundDetectionSwitch.checked ? "On" : "Off")
    );
  }

  if (soundDetectionSwitch && soundSensitivitySlider) {
    soundSensitivitySlider.disabled = !soundDetectionSwitch.checked;

    localStorage.setItem(
      "soundDetectionMode",
      soundDetectionSwitch.checked ? "on" : "off"
    );
    localStorage.setItem("soundSensitivityValue", soundSensitivitySlider.value);
  }
}

// =========================================//
function updateSoundSensitivity(val) {
  document.getElementById("sound-sensitivity-slider").textContent = val;

  // Change the sound detection sensitivity based on the slider value
  window.soundSensitivity = Math.max(1, Math.min(100, val));
}

// =========================================//
function setSoundDetectionMode(mode) {
  // alert("setSoundDetectionMode: " + mode);

  // Set the sound detection mode based on the provided mode
  const soundDetectionSwitch = document.getElementById("sound-switch");

  if (soundDetectionSwitch) {
    soundDetectionSwitch.checked = mode === "on";
    soundDetectionSwitch.dispatchEvent(new Event("change"));
  }
}

// =========================================//
function updateValueSound(val) {
  document.getElementById("sound-sensitivity-slider").textContent = val;

  // change the volume of the user microphone input based on the slider value
  // if (typeof window.soundSensitivitySlider !== "undefined") {
  //   window.soundSensitivitySlider.value = Math.max(0, Math.min(100, val));
  // }
}

// =========================================//
function setSoundSensitivityValue(value) {
  // alert("setSoundSensitivityValue: " + value);

  const soundDetectionSwitch = document.getElementById("sound-switch");
  const soundSensitivitySlider = document.getElementById(
    "sound-sensitivity-slider"
  );
  if (!soundSensitivitySlider) return;

  // Enable or disable the slider based on the switch state
  soundSensitivitySlider.disabled = !(
    soundDetectionSwitch && soundDetectionSwitch.checked
  );

  // Set the slider value
  soundSensitivitySlider.value = value;

  // Optionally trigger input event if needed
  soundSensitivitySlider.dispatchEvent(new Event("input"));
}

// =========================================//
// Basic sound detection function
function detectSoundLevel(prevSamples, currSamples, threshold = 30) {
  alert("detectSoundLevel");
  // prevSamples and currSamples are Float32Array (audio PCM samples)
  // Returns true if sound is detected, false otherwise

  let soundChanges = 0;
  const totalSamples = Math.min(prevSamples.length, currSamples.length);

  for (let i = 0; i < totalSamples; i++) {
    if (Math.abs(currSamples[i] - prevSamples[i]) > threshold / 100) {
      soundChanges++;
    }
  }

  // If more than 2% of samples have changed, consider it sound
  return soundChanges / totalSamples > 0.02;
}
