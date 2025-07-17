// =========================================//
// Set toggle state from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  const sourceSwitch = document.getElementById("source-switch");
  const groupFrameSource = document.getElementById("group-frame-source");
  if (!sourceSwitch) return;

  // Set the switch state from localStorage
  sourceSwitch.checked = localStorage.getItem("sourceMode") === "on";
  if (groupFrameSource)
    groupFrameSource.style.display = sourceSwitch.checked ? "flex" : "none";

  // Add event listener
  sourceSwitch.addEventListener("change", toggleSource);
});

// =========================================//
function toggleSource() {
  const sourceSwitch = document.getElementById("source-switch");
  const groupFrameSource = document.getElementById("group-frame-source");
  if (!sourceSwitch) return;

  // Save the toggle state to localStorage
  localStorage.setItem("sourceMode", sourceSwitch.checked ? "on" : "off");

  // Show or hide the group based on toggle
  if (groupFrameSource)
    groupFrameSource.style.display = sourceSwitch.checked ? "flex" : "none";
}

// =========================================//
function setSourceMode(mode) {
  const sourceSwitch = document.getElementById("source-switch");
  // alert("setSourceMode called, sourceSwitch:", sourceSwitch, "mode:", mode);

  if (sourceSwitch) {
    sourceSwitch.checked = mode === "on";
    sourceSwitch.dispatchEvent(new Event("change"));
  }
}
