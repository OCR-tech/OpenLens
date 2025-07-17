// =========================================//
// Set toggle state from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  const modeSwitch = document.getElementById("mode-switch");
  const groupFrameMode = document.getElementById("group-frame-mode");
  if (!modeSwitch) return;

  // Set the switch state from localStorage
  modeSwitch.checked = localStorage.getItem("mode") === "on";
  if (groupFrameMode)
    groupFrameMode.style.display = modeSwitch.checked ? "flex" : "none";

  // Add event listener
  modeSwitch.addEventListener("change", toggleMode);
});

// =========================================//
function toggleMode() {
  // alert("toggleMode");

  const modeSwitch = document.getElementById("mode-switch");
  const groupFrameMode = document.getElementById("group-frame-mode");
  if (!modeSwitch) return;

  // Save the toggle state to localStorage
  localStorage.setItem("mode", modeSwitch.checked ? "on" : "off");

  // Show or hide the group based on toggle
  if (groupFrameMode)
    groupFrameMode.style.display = modeSwitch.checked ? "flex" : "none";
}

// =========================================//
function setMode(mode) {
  // alert("setMode");

  const modeSwitch = document.getElementById("mode-switch");
  // alert("setMode called, modeSwitch:", modeSwitch, "mode:", mode);

  if (modeSwitch) {
    modeSwitch.checked = mode === "on";
    modeSwitch.dispatchEvent(new Event("change"));
  }
}
