// =========================================//
// Store the selection status of a command button in localStorage
function saveButtonStatus(buttonId, isActive) {
  localStorage.setItem(
    `btnStatus_${buttonId}`,
    isActive ? "active" : "inactive"
  );
}

// Retrieve the selection status of a command button from localStorage
function getButtonStatus(buttonId) {
  return localStorage.getItem(`btnStatus_${buttonId}`) === "active";
}

// Restore button status on startup
document.addEventListener("DOMContentLoaded", function () {
  const buttons = [
    { btn: btnCommand, group: groupFrameCommand },
    { btn: btnVoice, group: groupFrameVoice },
    { btn: btnDetect, group: groupFrameDetect },
    { btn: btnSettings, group: groupFrameSettings },
    // Add more buttons/groups as needed
  ];

  buttons.forEach(({ btn, group }) => {
    if (btn && getButtonStatus(btn.id)) {
      btn.classList.add("active");
      if (group) group.style.display = "flex";
    } else {
      btn.classList.remove("active");
      if (group) group.style.display = "none";
    }
  });
});

// =========================================//
function showCommand() {
  document.getElementById("status").innerText = "Command";
}

btnCommand.addEventListener("click", () => {
  btnCommand.classList.toggle("active");
  btnVoice.classList.remove("active");
  btnDetect.classList.remove("active");
  btnSettings.classList.remove("active");

  if (btnCommand.classList.contains("active")) {
    groupFrameCommand.style.display = "flex";
    groupFrameVoice.style.display = "none";
    groupFrameDetect.style.display = "none";
    groupFrameSettings.style.display = "none";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";
  } else {
    groupFrameCommand.style.display = "none";
    groupFrameVoice.style.display = "none";
    groupFrameDetect.style.display = "none";
    groupFrameSettings.style.display = "none";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";
  }

  // Save status for all buttons
  saveButtonStatus(btnCommand.id, btnCommand.classList.contains("active"));
  saveButtonStatus(btnVoice.id, btnVoice.classList.contains("active"));
  saveButtonStatus(btnDetect.id, btnDetect.classList.contains("active"));
  saveButtonStatus(btnSettings.id, btnSettings.classList.contains("active"));
});

// =========================================//
// Show VoiceControl function
function showVoice() {
  document.getElementById("status").innerText = "Voice";
}

btnVoice.addEventListener("click", () => {
  btnCommand.classList.remove("active");
  btnVoice.classList.toggle("active");
  btnDetect.classList.remove("active");
  btnSettings.classList.remove("active");

  if (btnVoice.classList.contains("active")) {
    groupFrameCommand.style.display = "none";
    groupFrameVoice.style.display = "flex";
    groupFrameDetect.style.display = "none";
    groupFrameSettings.style.display = "none";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";
  } else {
    groupFrameCommand.style.display = "none";
    groupFrameVoice.style.display = "none";
    groupFrameDetect.style.display = "none";
    groupFrameSettings.style.display = "none";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";
  }
  saveButtonStatus(btnCommand.id, btnCommand.classList.contains("active"));
  saveButtonStatus(btnVoice.id, btnVoice.classList.contains("active"));
  saveButtonStatus(btnDetect.id, btnDetect.classList.contains("active"));
  saveButtonStatus(btnSettings.id, btnSettings.classList.contains("active"));
});

// =========================================//
// Show Detect function
function showDetect() {
  document.getElementById("status").innerText = "Detect";
}

btnDetect.addEventListener("click", () => {
  btnCommand.classList.remove("active");
  btnVoice.classList.remove("active");
  btnDetect.classList.toggle("active");
  btnSettings.classList.remove("active");

  if (btnDetect.classList.contains("active")) {
    groupFrameCommand.style.display = "none";
    groupFrameVoice.style.display = "none";
    groupFrameDetect.style.display = "flex";
    groupFrameSettings.style.display = "none";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";
  } else {
    groupFrameCommand.style.display = "none";
    groupFrameVoice.style.display = "none";
    groupFrameDetect.style.display = "none";
    groupFrameSettings.style.display = "none";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";
  }
  saveButtonStatus(btnCommand.id, btnCommand.classList.contains("active"));
  saveButtonStatus(btnVoice.id, btnVoice.classList.contains("active"));
  saveButtonStatus(btnDetect.id, btnDetect.classList.contains("active"));
  saveButtonStatus(btnSettings.id, btnSettings.classList.contains("active"));
  saveButtonStatus(btnDetect.id, btnDetect.classList.contains("active"));
});

// =========================================//
// Show Settings function
function showSettings() {
  document.getElementById("status").innerText = "Settings";
}

btnSettings.addEventListener("click", () => {
  btnCommand.classList.remove("active");
  btnVoice.classList.remove("active");
  btnDetect.classList.remove("active");
  btnSettings.classList.toggle("active");

  if (btnSettings.classList.contains("active")) {
    groupFrameCommand.style.display = "none";
    groupFrameVoice.style.display = "none";
    groupFrameDetect.style.display = "none";
    groupFrameSettings.style.display = "flex";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";

    const videoSource = document.getElementById("video-source").value;
    const btnOk = document.getElementById("btn-ok");
    const ipCameraUrlInput = document.getElementById("ip-camera-url");
    if (
      videoSource === "camera" ||
      videoSource === "webcam" ||
      videoSource === "video_file"
    ) {
      btnOk.style.display = "none"; // Hide the OK button
      ipCameraUrlInput.style.display = "none"; // Hide the IP camera URL input
      // document.getElementById("btn-ok").style.display = "none";
      // document.getElementById("ip-camera-url").style.display = "none";
    }
  } else {
    groupFrameCommand.style.display = "none";
    groupFrameVoice.style.display = "none";
    groupFrameDetect.style.display = "none";
    groupFrameSettings.style.display = "none";
    groupFrameTutorial.style.display = "none";
    groupFrameHelp.style.display = "none";
  }
  saveButtonStatus(btnCommand.id, btnCommand.classList.contains("active"));
  saveButtonStatus(btnVoice.id, btnVoice.classList.contains("active"));
  saveButtonStatus(btnDetect.id, btnDetect.classList.contains("active"));
  saveButtonStatus(btnSettings.id, btnSettings.classList.contains("active"));
});
