// =========================================//
function showVisitor() {
  document.getElementById("status").innerText = "Visitor";

  btnCommand.classList.remove("active");
  btnVoice.classList.remove("active");
  btnSettings.classList.remove("active");

  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "none";
  groupFrameHelp.style.display = "none";
  groupFrameVisitor.style.display = "flex";

  getVisitorInfo();

  // move the cursor to the visitor section
  document
    .getElementById("group-frame-visitor")
    .scrollIntoView({ behavior: "smooth" });
}

// =========================================//
function hideVisitor() {
  document.getElementById("status").innerText = "Ready!";
  groupFrameCommand.style.display = "none";
  groupFrameVoice.style.display = "none";
  groupFrameSettings.style.display = "none";
  groupFrameTutorial.style.display = "none";
  groupFrameHelp.style.display = "none";
  groupFrameVisitor.style.display = "none";
}

// =========================================//
function getVisitorInfo() {
  // Browser info
  const ua = navigator.userAgent;
  let browser = "Unknown";
  if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";
  else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1)
    browser = "IE";

  // OS info
  let os = "Unknown";
  if (ua.indexOf("Win") > -1) os = "Windows";
  else if (ua.indexOf("Mac") > -1) os = "MacOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("like Mac") > -1) os = "iOS";

  // Device type
  let device = /Mobi|Android/i.test(ua) ? "Mobile" : "Desktop";

  // Referrer
  const referrer = document.referrer || "Direct";

  // Visit time/date
  const now = new Date();
  const visitTime = now.toLocaleTimeString();
  const visitDate = now.toLocaleDateString();

  // Fill HTML
  document.getElementById("visitor-count").textContent = 1; // Static count for demo
  document.getElementById("visitor-date").textContent = visitDate;
  document.getElementById("visitor-time").textContent = visitTime;
  document.getElementById("visitor-browser").textContent = browser;
  document.getElementById("visitor-os").textContent = os;
  document.getElementById("visitor-device").textContent = device;
  document.getElementById("visitor-referrer").textContent = referrer;

  // Get IP and location using ipinfo.io (no token needed for basic info)
  fetch("https://ipinfo.io/json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("visitor-ip").textContent = data.ip || "Unknown";
      document.getElementById("visitor-location").textContent =
        (data.city ? data.city + ", " : "") +
        (data.region ? data.region + ", " : "") +
        (data.country || "");
    })
    .catch(() => {
      document.getElementById("visitor-ip").textContent = "Unknown";
      document.getElementById("visitor-location").textContent = "Unknown";
    });
}
