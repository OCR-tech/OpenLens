// =========================================//
// Set toggle state from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  const statusSwitch = document.getElementById("status-switch");
  const groupFrameStatus = document.getElementById("group-frame-status");
  if (!statusSwitch || !groupFrameStatus) return;

  // Set the switch state from localStorage
  statusSwitch.checked = localStorage.getItem("status") === "on";
  groupFrameStatus.style.display = statusSwitch.checked ? "flex" : "none";

  // Add event listener
  statusSwitch.addEventListener("change", function () {
    localStorage.setItem("status", statusSwitch.checked ? "on" : "off");
    groupFrameStatus.style.display = statusSwitch.checked ? "flex" : "none";
  });
});

// =========================================//
function toggleStatus() {
  // alert("toggleStatus");

  const statusSwitch = document.getElementById("status-switch");
  const groupFrameStatus = document.getElementById("group-frame-status");
  if (!statusSwitch) return;

  // Save the toggle state to localStorage
  localStorage.setItem("status", statusSwitch.checked ? "on" : "off");

  // Show or hide the group based on toggle
  if (groupFrameStatus)
    groupFrameStatus.style.display = statusSwitch.checked ? "flex" : "none";
}

// =========================================//
function setStatus(status) {
  // alert("setStatus");

  const statusSwitch = document.getElementById("status-switch");
  // alert("setStatus called, statusSwitch:", statusSwitch, "status:", status);

  if (statusSwitch) {
    statusSwitch.checked = status === "on";
    statusSwitch.dispatchEvent(new Event("change"));
  }
}
