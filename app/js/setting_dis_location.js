// =========================================//
let cachedGPS = { latitude: null, longitude: null };

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    function (position) {
      cachedGPS.latitude = position.coords.latitude;
      cachedGPS.longitude = position.coords.longitude;
    }
    // ,
    // function (err) {
    //   alert("Geolocation error:", err);
    //   console.log("Geolocation error:", err);
    //   document.getElementById("status").innerText = "Geolocation: disabled";
    // }
  );
} else {
  alert("Geolocation not supported by this browser.");
}

// =========================================//
document.addEventListener("DOMContentLoaded", function () {
  const gpsSwitch = document.getElementById("gps-switch");

  if (!gpsSwitch) return;

  // Set the switch state from localStorage
  gpsSwitch.checked = localStorage.getItem("gpsLocationMode") === "true";

  // Set initial GPS location mode
  window.showGPSLocationOverlay = gpsSwitch.checked;

  // Add event listener
  gpsSwitch.addEventListener("change", toggleGPS);
});

// =========================================//
function toggleGPS() {
  // alert("ToggleGPS");

  const gpsSwitch = document.getElementById("gps-switch");
  const gpsLabel = document.getElementById("gps-label");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("GPS Location " + (gpsSwitch.checked ? "On" : "Off"));
  }

  if (gpsSwitch) {
    window.showGPSLocationOverlay = gpsSwitch.checked;
    localStorage.setItem("gpsLocationMode", gpsSwitch.checked ? "on" : "off");

    // display the label with current GPS location
    if (window.showGPSLocationOverlay) {
      if (gpsLabel) {
        gpsLabel.style.display = "inline-block";
        updateGPSlocation(cachedGPS.latitude, cachedGPS.longitude);
      }
    } else {
      if (gpsLabel) {
        gpsLabel.style.display = "none";
      }
    }
  }
}

// =========================================//
function updateGPSlocation() {
  // alert("UpdateGPSlocation");
  const gpsLabel = document.getElementById("gps-label");
  if (!gpsLabel) return;
  // cachedGPS.latitude = 13.7563;
  // cachedGPS.longitude = 100.5018;
  // alert(cachedGPS);
  if (
    typeof cachedGPS.latitude === "number" &&
    typeof cachedGPS.longitude === "number"
  ) {
    gpsLabel.textContent = `Lat: ${cachedGPS.latitude.toFixed(
      2
    )}, Lon: ${cachedGPS.longitude.toFixed(2)}`;
  } else {
    gpsLabel.textContent = "GPS unavailable";
  }
}
// Update every second
setInterval(updateGPSlocation, 1000);
updateGPSlocation();

// =========================================//
// Display current GPS location on canvas
function displayGPSlocation(latitude, longitude) {
  if (!ctx || !canvas) return;
  const gpsString = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
  ctx.save();
  // ctx.font = "40px Arial";

  const canvasWidth = canvas.width;
  const fontSize = Math.round(canvasWidth / 25);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  const textWidth = ctx.measureText(gpsString).width;

  // Draw background rectangle below the date/time
  const padding = Math.round(canvasWidth / 100); // Adjust padding based on canvas width
  const textHeight = Math.round(fontSize * 1.2); // Adjust text height based on font size
  const x = padding;
  const y = canvas.height - textHeight - padding;
  ctx.fillRect(x, y, textWidth + padding, textHeight);
  ctx.fillStyle = "#FFF";
  ctx.fillText(gpsString, x + 5, y - 5 + textHeight);
  ctx.restore();
}

// =========================================//
function setGPSLocationMode(mode) {
  // alert("SetGPSLocationMode : " + mode);

  const gpsSwitch = document.getElementById("gps-switch");
  const gpsLabel = document.getElementById("gps-label");

  if (gpsSwitch) {
    gpsSwitch.checked = mode === "on";
    gpsSwitch.dispatchEvent(new Event("change"));
    gpsLabel.style.display = gpsSwitch.checked ? "block" : "none";
  }
}
