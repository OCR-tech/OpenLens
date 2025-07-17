// =========================================//
function toggleLineInput() {
  // alert("toggleLineInput");
  const lineAlertSwitch = document.getElementById("line-switch");
  const lineInput = document.getElementById("line-user");
  const btnOkLine = document.getElementById("btn-ok-line");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("LINE Alert " + (lineAlertSwitch.checked ? "On" : "Off"));
  }

  if (lineAlertSwitch && lineAlertSwitch.checked) {
    if (lineInput) lineInput.style.display = "inline-block";
    if (btnOkLine) btnOkLine.style.display = "inline-block";
  } else {
    if (lineInput) lineInput.style.display = "none";
    if (btnOkLine) btnOkLine.style.display = "none";
  }
}

// =========================================//
// Function to handle the LINE alert submission
function okLineAlert() {
  alert("okLineAlert");
  const lineInput = document.getElementById("line-user");
  const lineId = lineInput ? lineInput.value.trim() : "";

  if (lineId) {
    // Optionally validate LINE ID format here

    // Send the LINE alert
    sendLineAlert(
      lineId,
      "[OpenLens] Alert Notification",
      "Object Detection: " +
        new Date().toLocaleString() +
        "," +
        // Include GPS coordinates if available using cachedGPS
        (cachedGPS && cachedGPS.latitude
          ? ` Latitude: ${cachedGPS.latitude}, Longitude: ${cachedGPS.longitude}`
          : "")
    );
    document.getElementById("status").innerText =
      "Sending LINE alert to " + lineId + "...";
  } else {
    document.getElementById("status").innerText = "LINE ID cannot be empty.";
  }
}

// =========================================//
/**
 * Send a LINE alert using a backend API endpoint.
 * @param {string} toLineId - Recipient LINE ID.
 * @param {string} subject - Alert subject.
 * @param {string} message - Alert body content.
 */
function sendLineAlert(toLineId, subject, message) {
  fetch("/api/send-line", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: toLineId,
      subject: subject,
      text: message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("status").innerText =
          "LINE alert sent successfully!";
      } else {
        document.getElementById("status").innerText =
          "Failed to send LINE alert.";
      }
    })
    .catch((error) => {
      console.error("Error sending LINE alert:", error);
      document.getElementById("status").innerText =
        "An error occurred while sending the LINE alert.";
    });
}
