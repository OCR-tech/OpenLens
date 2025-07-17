// =========================================//
function toggleSmsInput() {
  // alert("ToggleSmsInput");
  const smsAlertSwitch = document.getElementById("sms-switch");
  const smsInput = document.getElementById("sms-user");
  const btnOkSms = document.getElementById("btn-ok-sms");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("SMS Alert " + (smsAlertSwitch.checked ? "On" : "Off"));
  }

  if (smsAlertSwitch && smsAlertSwitch.checked) {
    if (smsInput) smsInput.style.display = "inline-block";
    if (btnOkSms) btnOkSms.style.display = "inline-block";
  } else {
    if (smsInput) smsInput.style.display = "none";
    if (btnOkSms) btnOkSms.style.display = "none";
  }
}

// =========================================//
// Function to handle the SMS alert submission
function okSmsAlert() {
  // alert("OkSmsAlert");

  const smsInput = document.getElementById("sms-user");
  const phoneNumber = smsInput ? smsInput.value.trim() : "";

  if (phoneNumber) {
    // Validate phone number format (basic international format check)
    const phonePattern = /^\+\d{10,15}$/;
    if (!phonePattern.test(phoneNumber)) {
      document.getElementById("status").innerText =
        "Please enter a valid phone number in international format (e.g., +12345678900).";
      return;
    }

    // Send the SMS alert
    sendSmsAlert(
      phoneNumber,
      "Object Detection: " +
        new Date().toLocaleString() +
        // Include GPS coordinates if available using cachedGPS
        (cachedGPS && cachedGPS.latitude
          ? `, Latitude: ${cachedGPS.latitude}, Longitude: ${cachedGPS.longitude}`
          : "")
    );
    document.getElementById("status").innerText =
      "Sending SMS alert to " + phoneNumber + "...";
  } else {
    document.getElementById("status").innerText =
      "Phone number cannot be empty.";
  }
}

// =========================================//
/**
 * Send an SMS mobile alert using a backend API endpoint.
 * @param {string} phoneNumber - The recipient's phone number (in international format).
 * @param {string} message - The SMS message content.
 */

function sendSmsAlert(phoneNumber, message) {
  // alert("SendSmsAlert");

  fetch("/api/send-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: phoneNumber,
      body: message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("status").innerText = "SMS alert sent!";
      } else {
        document.getElementById("status").innerText =
          "Failed to send SMS alert.";
      }
    })
    .catch((error) => {
      document.getElementById("status").innerText = "Error sending SMS alert.";
      console.error("SMS Alert Error:", error);
    });
}
