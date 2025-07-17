// =========================================//
function showHelp() {
  document.getElementById("status").innerText = "Help";

  btnCommand.classList.remove("active");
  btnVoice.classList.remove("active");
  btnSettings.classList.remove("active");

  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "none";
  groupFrameHelp.style.display = "flex";

  // move the cursor to the help section
  document
    .getElementById("group-frame-help")
    .scrollIntoView({ behavior: "smooth" });
}

// =========================================//
function HideHelp() {
  document.getElementById("status").innerText = "Ready!";
  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "none";
  groupFrameHelp.style.display = "none";
}
