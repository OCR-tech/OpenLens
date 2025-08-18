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

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const fontSize = Math.round(canvasWidth / 25);
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = "top"; // Align text to the top of the rectangle

  const textWidth = ctx.measureText(gpsString).width;
  const textHeight = Math.round(fontSize * 1.2);

  const paddingX = Math.round(canvasWidth / 100); // Horizontal padding
  const paddingY = Math.round(canvasWidth / 100); // Vertical padding

  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = textHeight + paddingY * 1;
  const x = paddingX;
  const y = canvasHeight - boxHeight - paddingY;

  // Draw background rectangle
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x, y, boxWidth, boxHeight);

  // Draw text centered in the rectangle
  ctx.fillStyle = "#FFF";
  ctx.fillText(gpsString, x + paddingX, y + paddingY);
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
