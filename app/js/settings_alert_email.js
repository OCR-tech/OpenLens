// =========================================//
function toggleEmailInput() {
  // alert("ToggleEmailInput");
  const emailAlertSwitch = document.getElementById("email-switch");
  const emailInput = document.getElementById("email-user");
  const btnOkEmail = document.getElementById("btn-ok-email");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Email Alert " + (emailAlertSwitch.checked ? "On" : "Off"));
  }

  if (emailAlertSwitch && emailAlertSwitch.checked) {
    if (emailInput) emailInput.style.display = "inline-block";
    if (btnOkEmail) btnOkEmail.style.display = "inline-block";
  } else {
    if (emailInput) emailInput.style.display = "none";
    if (btnOkEmail) btnOkEmail.style.display = "none";
  }
}

// =========================================//
// Function to handle the email alert submission
function okEmailAlert() {
  // alert("OkEmailAlert");

  const emailInput = document.getElementById("email-user");
  const email = emailInput ? emailInput.value.trim() : "";

  if (email) {
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      document.getElementById("status").innerText =
        "Please enter a valid email address.";
      return;
    }

    // Send the email alert
    sendEmailAlert(
      email,
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
      "Sending email alert to " + email + "...";
  } else {
    document.getElementById("status").innerText =
      "Email address cannot be empty.";
  }
}

// =========================================//
/**
 * Send an email alert using a backend API endpoint.
 * @param {string} toEmail - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} message - Email body content.
 */
function sendEmailAlert(toEmail, subject, message) {
  // alert("SendEmailAlert");

  // Send the email using fetch API
  fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: toEmail,
      subject: subject,
      text: message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("status").innerText =
          "Email alert sent successfully!";
      } else {
        document.getElementById("status").innerText =
          "Failed to send email alert.";
      }
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      document.getElementById("status").innerText =
        "An error occurred while sending the email.";
    });
}
