// =========================================//
function showTutorial() {
  document.getElementById("status").innerText = "Tutorial";

  btnCommand.classList.remove("active");
  btnVoice.classList.remove("active");
  btnSettings.classList.remove("active");

  // show the tutorial content
  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "flex";
  groupFrameHelp.style.display = "none";
  groupFrameVisitor.style.display = "none";

  // move the cursor to the tutorial section
  document
    .getElementById("group-frame-tutorial")
    .scrollIntoView({ behavior: "smooth" });
}

// =========================================//
function hideTutorial() {
  document.getElementById("status").innerText = "Ready!";
  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "none";
  groupFrameHelp.style.display = "none";
  groupFrameVisitor.style.display = "none";
}
