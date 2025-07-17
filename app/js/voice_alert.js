// =========================================//
function toggleVoiceAlert() {
  // alert("toggleVoiceAlert");

  const voiceAlertSwitch = document.getElementById("voice-alert-switch");
  const volumeSliderAlert = document.getElementById("volume-slider-alert");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Voice Alert " + (voiceAlertSwitch.checked ? "On" : "Off"));
  }

  if (voiceAlertSwitch && volumeSliderAlert) {
    volumeSliderAlert.disabled = !voiceAlertSwitch.checked;
    window.voiceAlertEnabled = voiceAlertSwitch.checked;
    window.speechSynthesis.cancel();

    localStorage.setItem(
      "voiceAlertMode",
      voiceAlertSwitch.checked ? "on" : "off"
    );
    localStorage.setItem("volumeSliderAlertValue", volumeSliderAlert.value);
  }
}

// =========================================//
function setVoiceAlert(message = "Object detected") {
  const voiceAlertSwitch = document.getElementById("voice-alert-switch");
  const volumeSliderAlert = document.getElementById("volume-slider-alert");

  if (voiceAlertSwitch && voiceAlertSwitch.checked) {
    const utter = new SpeechSynthesisUtterance(message);
    if (volumeSliderAlert) {
      utter.volume = Math.max(0, Math.min(1, volumeSliderAlert.value / 100));
    }
    window.speechSynthesis.speak(utter);
  }
}

// =========================================//
function stopVoiceAlert() {
  window.speechSynthesis.cancel();
}

// =========================================//
function updateValueAlert(val) {
  document.getElementById("volume-value-alert").textContent = val;

  // change the volume of the speech synthesis based on the slider value
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    const utter = new SpeechSynthesisUtterance();
    utter.volume = Math.max(0, Math.min(1, val / 100));
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utter); // Speak with the new volume
  }
}

// =========================================//
function setVoiceAlertMode(mode) {
  const voiceAlertSwitch = document.getElementById("voice-alert-switch");

  if (voiceAlertSwitch) {
    voiceAlertSwitch.checked = mode === "on";
    voiceAlertSwitch.dispatchEvent(new Event("change"));
  }
}

// =========================================//
function setVolumeSliderAlertValue(value) {
  const voiceAlertSwitch = document.getElementById("voice-alert-switch");
  const volumeSliderAlert = document.getElementById("volume-slider-alert");
  if (!volumeSliderAlert) return;

  // Enable or disable the slider based on the switch state
  volumeSliderAlert.disabled = !(voiceAlertSwitch && voiceAlertSwitch.checked);

  // Set the slider value
  volumeSliderAlert.value = value;

  // Optionally trigger input event if needed
  volumeSliderAlert.dispatchEvent(new Event("input"));
}

// =========================================//
function speak(text) {
  if ("speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
}
// Call speak("Command received") after a command is recognized.
