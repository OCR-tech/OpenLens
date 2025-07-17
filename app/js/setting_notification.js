window.notificationEnabled = true; // Global flag to track notification status

// =========================================//
// Set notification toggle state from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  const notificationSwitch = document.getElementById("notification-switch");
  if (!notificationSwitch) return;

  // Set the switch state from localStorage
  notificationSwitch.checked =
    localStorage.getItem("notificationMode") === "on";
  window.notificationEnabled = notificationSwitch.checked;

  // Add event listener
  notificationSwitch.addEventListener("change", toggleNotification);
});

// =========================================//
function toggleNotification() {
  // alert("toggleNotification");
  const notificationSwitch = document.getElementById("notification-switch");
  if (!notificationSwitch) return;
  window.notificationEnabled = notificationSwitch.checked; // Toggle the global notification flag

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Notification " + (window.notificationEnabled ? "On" : "Off")
    );
  }
  // Save the toggle state to localStorage
  localStorage.setItem(
    "notificationMode",
    notificationSwitch.checked ? "on" : "off"
  );
}

// =========================================//
function setNotificationMode(mode) {
  const notificationSwitch = document.getElementById("notification-switch");
  if (notificationSwitch) {
    notificationSwitch.checked = mode === "on";
    notificationSwitch.dispatchEvent(new Event("change"));
  }
}

// =========================================//
// Show a browser notification when an object is detected
function notifyDetection(objectName) {
  // alert("notifyDetection: " + objectName);

  if (!window.notificationEnabled) return;

  // Check if Notification API is supported
  if (typeof Notification === "undefined") {
    console.warn("This browser does not support desktop notification");
    return;
  }

  const title = "Object Detected";
  const body = objectName
    ? `Detected: ${objectName}`
    : "An object has been detected.";

  if (Notification.permission === "granted") {
    new Notification(title, { body: body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission()
      .then(function (permission) {
        if (permission === "granted") {
          new Notification(title, { body: body });
        } else {
          console.warn("Notification permission denied.");
        }
      })
      .catch(function (err) {
        console.error("Notification permission request failed:", err);
      });
  } else {
    console.warn("Notification permission denied.");
  }
}
