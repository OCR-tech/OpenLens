// =========================================//
document.addEventListener("DOMContentLoaded", function () {
  const dateTimeSwitch = document.getElementById("datetime-switch");
  if (!dateTimeSwitch) return;

  // Set the switch state from localStorage
  dateTimeSwitch.checked = localStorage.getItem("datetimeMode") === "on";

  // Set initial overlay state
  window.showDateTimeOverlay = dateTimeSwitch.checked;

  // Add event listener
  dateTimeSwitch.addEventListener("change", toggleDateTime);
});

// =========================================//
function toggleDateTime() {
  // alert("ToggleDateTime");

  const dateTimeLabel = document.getElementById("datetime-label");
  const dateTimeSwitch = document.getElementById("datetime-switch");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("DateTime " + (dateTimeSwitch.checked ? "On" : "Off"));
  }

  if (dateTimeSwitch) {
    window.showDateTimeOverlay = dateTimeSwitch.checked;
    localStorage.setItem("datetimeMode", dateTimeSwitch.checked ? "on" : "off");

    // display the label with current date and time
    if (window.showDateTimeOverlay) {
      if (dateTimeLabel) {
        dateTimeLabel.style.display = "inline-block";
        updateDateTime();
      }
    } else {
      if (dateTimeLabel) {
        dateTimeLabel.style.display = "none";
      }
    }
  }
}

// =========================================//
function updateDateTime() {
  const now = new Date();
  const formatted = now.toLocaleString();
  const dateTimeLabel = document.getElementById("datetime-label");
  if (dateTimeLabel) {
    dateTimeLabel.textContent = formatted;
  }
}
// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();

// =========================================//
// Display current date and time in on canvas
function displayDateTime() {
  if (!ctx || !canvas) return;
  const now = new Date();
  const dateTimeString = now.toLocaleString();
  ctx.save();
  // ctx.font = "16px Arial";
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(0,0,0,0.5)";

  // Draw background rectangle for better readability
  const textWidth = ctx.measureText(dateTimeString).width;
  ctx.fillRect(8, 8, textWidth + 8, 24);
  ctx.fillStyle = "#FFF";
  ctx.fillText(dateTimeString, 12, 26);
  ctx.restore();
}

// =========================================//
function setDatetimeMode(mode) {
  // alert("SetDatetimeMode: " + mode);

  const dateTimeSwitch = document.getElementById("datetime-switch");
  const dateTimeLabel = document.getElementById("datetime-label");
  if (dateTimeSwitch) {
    dateTimeSwitch.checked = mode === "on";
    dateTimeSwitch.dispatchEvent(new Event("change"));
    dateTimeLabel.style.display = dateTimeSwitch.checked ? "block" : "none";
  }
}
