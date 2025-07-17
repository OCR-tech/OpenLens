window.voiceStatusEnabled = true;

// =========================================//
function toggleVoiceStatus() {
  // alert("ToggleVoiceStatus");
  const voiceStatusSwitch = document.getElementById("voice-status-switch");
  const volumeSliderStatus = document.getElementById("volume-slider-status");

  window.voiceStatusEnabled = voiceStatusSwitch && voiceStatusSwitch.checked;

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Voice Status " + (voiceStatusSwitch.checked ? "On" : "Off")
    );
  }

  if (voiceStatusSwitch && volumeSliderStatus) {
    volumeSliderStatus.disabled = !voiceStatusSwitch.checked;
    // window.speechSynthesis.cancel();

    localStorage.setItem(
      "voiceStatusMode",
      voiceStatusSwitch.checked ? "on" : "off"
    );
    localStorage.setItem("volumeSliderStatusValue", volumeSliderStatus.value);
  }
}

// =========================================//
function playVoiceStatus(message = "Object detected!") {
  // Check the global flag before playing
  if (
    typeof window.voiceStatusEnabled !== "undefined" &&
    !window.voiceStatusEnabled
  ) {
    return; // Do not play if disabled
  }

  const voiceStatusSwitch = document.getElementById("voice-status-switch");
  const volumeSliderStatus = document.getElementById("volume-slider-status");

  if (voiceStatusSwitch && voiceStatusSwitch.checked) {
    const utter = new SpeechSynthesisUtterance(message);
    if (volumeSliderStatus) {
      utter.volume = Math.max(0, Math.min(1, volumeSliderStatus.value / 100));
    }
    window.speechSynthesis.speak(utter);
  }
}

// =========================================//
function updateValueStatus(val) {
  document.getElementById("volume-value-status").textContent = val;

  // change the volume of the speech synthesis based on the slider value
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    const utter = new SpeechSynthesisUtterance();
    utter.volume = Math.max(0, Math.min(1, val / 100));
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utter); // Speak with the new volume
  }
}

// =========================================//
function setVoiceStatusMode(mode) {
  const voiceStatusSwitch = document.getElementById("voice-status-switch");

  if (voiceStatusSwitch) {
    voiceStatusSwitch.checked = mode === "on";
    voiceStatusSwitch.dispatchEvent(new Event("change"));
  }
}

// =========================================//
function setVolumeSliderStatusValue(value) {
  const voiceStatusSwitch = document.getElementById("voice-status-switch");
  const volumeSliderStatus = document.getElementById("volume-slider-status");
  if (!volumeSliderStatus) return;

  // Enable or disable the slider based on the switch state
  volumeSliderStatus.disabled = !(
    voiceStatusSwitch && voiceStatusSwitch.checked
  );

  // Set the slider value
  volumeSliderStatus.value = value;

  // Optionally trigger input event if needed
  volumeSliderStatus.dispatchEvent(new Event("input"));
}

// =========================================//
document.getElementById("source-switch").onclick = function () {
  const sourceSwitch = document.getElementById("source-switch");
  if (window.voiceStatusEnabled) {
    playVoiceStatus("Source" + (sourceSwitch.checked ? "On" : "Off"));
  }
};
document.getElementById("screen-switch").onclick = function () {
  const screenSwitch = document.getElementById("screen-switch");
  if (window.voiceStatusEnabled) {
    playVoiceStatus((screenSwitch.checked ? "Full" : "Normal") + " Screen");
  }
};
document.getElementById("theme-switch").onclick = function () {
  const themeSwitch = document.getElementById("theme-switch");
  if (window.voiceStatusEnabled) {
    playVoiceStatus((themeSwitch.checked ? "Dark" : "Light ") + "Theme");
  }
};
// =========================================//
document.getElementById("btn-command").onclick = function () {
  // window.speechSynthesis.speak(new SpeechSynthesisUtterance("Hello world"));
  if (window.voiceStatusEnabled) {
    playVoiceStatus("Command");
  }
};
document.getElementById("btn-voice").onclick = function () {
  if (window.voiceStatusEnabled) {
    playVoiceStatus("Voice");
  }
};
document.getElementById("btn-settings").onclick = function () {
  if (window.voiceStatusEnabled) {
    playVoiceStatus("Settings");
  }
};
