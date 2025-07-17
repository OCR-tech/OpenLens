// =========================================//
function toggleVoiceCommand() {
  // alert("toggleVoiceCommand");

  const voiceCommandSwitch = document.getElementById("voice-command-switch");
  const volumeSliderCommand = document.getElementById("volume-slider-command");

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Voice Command " + (voiceCommandSwitch.checked ? "On" : "Off")
    );
  }

  if (voiceCommandSwitch && volumeSliderCommand) {
    volumeSliderCommand.disabled = !voiceCommandSwitch.checked;
    window.voiceCommandEnabled = voiceCommandSwitch.checked;

    if (voiceCommandSwitch.checked) {
      voiceCommand();
    }

    localStorage.setItem(
      "voiceCommandMode",
      voiceCommandSwitch.checked ? "on" : "off"
    );
    localStorage.setItem("volumeSliderCommandValue", volumeSliderCommand.value);
  }
}

// =========================================//
function updateValueCommand(val) {
  document.getElementById("volume-value-command").textContent = val;

  // change the volume of the user microphone input based on the slider value
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    const utter = new SpeechSynthesisUtterance();
    utter.volume = Math.max(0, Math.min(1, val / 100));
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utter); // Speak with the new volume
  }
}

// =========================================//
function setVoiceCommandMode(mode) {
  const voiceCommandSwitch = document.getElementById("voice-command-switch");

  if (voiceCommandSwitch) {
    voiceCommandSwitch.checked = mode === "on";

    // Optionally trigger change event if needed
    voiceCommandSwitch.dispatchEvent(new Event("change"));
  }
}

// =========================================//
function setVolumeSliderCommandValue(value) {
  const voiceCommandSwitch = document.getElementById("voice-command-switch");
  const volumeSliderCommand = document.getElementById("volume-slider-command");
  if (!volumeSliderCommand) return;

  // Enable or disable the slider based on the switch state
  volumeSliderCommand.disabled = !(
    voiceCommandSwitch && voiceCommandSwitch.checked
  );

  // Set the slider value
  volumeSliderCommand.value = value;

  // Optionally trigger input event if needed
  volumeSliderCommand.dispatchEvent(new Event("input"));
}

// =========================================//
function extractVolumeLevel(commandText) {
  alert("extractVolumeLevel: " + commandText);
  // Extract volume level from command text
  const match = commandText.match(/volume\s*(?:to\s*)?(\d+)/i);
  if (match && match[1]) {
    const volume = parseInt(match[1], 10);
    return Math.max(0, Math.min(100, volume)); // Ensure volume is between 0 and 100
  }
  return null; // No valid volume level found
}

// =========================================//
function setVolume(val) {
  if (val === null) return; // Ignore invalid volume
  alert("Setting volume to: " + val);
  document.getElementById("volume-slider-command").value = val;
  document.getElementById("volume-value-command").textContent = val;
}

// =========================================//
function voiceCommand() {
  // alert("Voice command");

  setVoiceCommand(function (commandText) {
    // Handle the recognized command here
    console.log("Recognized command:", commandText);

    if (commandText.includes("volume")) {
      const volumeLevel = extractVolumeLevel(commandText);
      setVolume(volumeLevel);
    }

    // You can trigger other actions based on commandText
  });
}

// =========================================//
/**
 * Start voice command recognition and handle recognized commands.
 * Requires browser support for the Web Speech API.
 * @param {function} onCommand - Callback to handle recognized command text.
 */
function setVoiceCommand(onCommand) {
  // alert("setVoiceCommand");

  // Check for browser support
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById("status").innerText =
      "Voice recognition not supported in this browser.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = function () {
    document.getElementById("status").innerText =
      "Listening for voice command...";
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.trim();
    document.getElementById("status").innerText = `Heard: "${transcript}"`;
    if (typeof onCommand === "function") {
      onCommand(transcript);
    }
  };

  recognition.onerror = function (event) {
    document.getElementById("status").innerText =
      "Voice recognition error: " + event.error;
  };

  recognition.onend = function () {
    // Optionally restart or update status
    document.getElementById("status").innerText = "Voice recognition stopped.";
    // console.log("Voice recognition ended.");
  };

  recognition.start();
}
