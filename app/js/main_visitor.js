// =========================================//
function showVisitor() {
  document.getElementById("status").innerText = "Visitor";

  btnCommand.classList.remove("active");
  btnVoice.classList.remove("active");
  btnSettings.classList.remove("active");

  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "none";
  groupFrameHelp.style.display = "none";
  groupFrameVisitor.style.display = "flex";

  // getVisitorInfo();

  // move the cursor to the visitor section
  document
    .getElementById("group-frame-visitor")
    .scrollIntoView({ behavior: "smooth" });
}

// =========================================//
function hideVisitor() {
  document.getElementById("status").innerText = "Ready!";
  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "none";
  groupFrameHelp.style.display = "none";
  groupFrameVisitor.style.display = "none";
}

// =========================================//
// function getVisitorInfo() {
//   alert("getVisitorInfo");
// }
