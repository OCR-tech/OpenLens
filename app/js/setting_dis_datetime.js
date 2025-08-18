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
  // alert("DisplayDateTime");
  if (!ctx || !canvas) return;
  const now = new Date();
  const dateTimeString = now.toLocaleString();
  ctx.save();

  const canvasWidth = canvas.width;
  const fontSize = Math.round(canvasWidth / 25);
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = "top"; // Align text to the top of the rectangle

  const textWidth = ctx.measureText(dateTimeString).width;
  const textHeight = Math.round(fontSize * 1.2);

  const paddingX = Math.round(canvasWidth / 100); // Horizontal padding
  const paddingY = Math.round(canvasWidth / 100); // Vertical padding

  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = textHeight + paddingY * 1;
  const x = paddingX;
  const y = paddingY;

  // Draw background rectangle
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x, y, boxWidth, boxHeight);

  // Draw text centered in the rectangle
  ctx.fillStyle = "#FFF";
  ctx.fillText(dateTimeString, x + paddingX, y + paddingY);
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
