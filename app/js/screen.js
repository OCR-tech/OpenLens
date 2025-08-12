document.addEventListener("DOMContentLoaded", function () {
  const screenSwitch = document.getElementById("screen-switch");
  const screenModeText = document.getElementById("screen-mode-text");

  if (!screenSwitch) console.error("Missing #screen-switch");
  if (!screenModeText) console.error("Missing #screen-mode-text");

  if (screenSwitch && screenModeText) {
    // screenSwitch.checked = localStorage.getItem("screenMode") === "normal";
    screenModeText.textContent = screenSwitch.checked ? "Screen" : "Screen";
    screenSwitch.addEventListener("change", function () {
      if (this.checked) {
        fullScreen();
      } else {
        normalScreen();
      }
    });
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    normalScreen();

    // Remove the exit text if it exists
    const exitTextPrev = document.getElementById("exit-fullscreen-text");
    if (exitTextPrev) {
      exitTextPrev.remove();
    }

    const screenSwitch = document.getElementById("screen-switch");
    // set screenSwitch to unchecked
    if (screenSwitch) {
      screenSwitch.checked = false;
    }
  }
});

// ==========================================//
function normalScreen() {
  const videoFeed = document.getElementById("video-feed");
  const video = videoFeed ? videoFeed.querySelector("video") : null;
  const canvas = document.getElementById("overlay");

  // Restore video feed to normal layout
  if (videoFeed) {
    videoFeed.style.position = "";
    videoFeed.style.top = "";
    videoFeed.style.left = "";
    videoFeed.style.width = "";
    videoFeed.style.height = "";
    videoFeed.style.zIndex = "";
    videoFeed.style.background = "";
  }

  // Restore video element size
  if (video) {
    video.style.width = "100%";
    video.style.height = "auto";
    video.style.objectFit = "";
  }

  // Restore canvas overlay size and position
  if (canvas) {
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "10";
    // Optionally, set canvas size to match video if needed
    if (video) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }
  }
}

// ==========================================//
function fullScreen() {
  const videoFeed = document.getElementById("video-feed");
  const video = videoFeed ? videoFeed.querySelector("video") : null;
  const canvas = document.getElementById("overlay");

  // Make video feed take full window size
  if (videoFeed) {
    videoFeed.style.position = "fixed";
    videoFeed.style.top = "0";
    videoFeed.style.left = "0";
    videoFeed.style.width = "100vw";
    videoFeed.style.height = "100vh";
    videoFeed.style.zIndex = "9999";
    videoFeed.style.background = "#000";
  }

  // Make video element full size
  if (video) {
    video.style.width = "100vw";
    video.style.height = "100vh";
    video.style.objectFit = "contain";
  }

  // Make canvas overlay full size
  if (canvas) {
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "10000";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Remove the exit text if it exists
  const exitTextElem = document.getElementById("exit-fullscreen-text");
  if (exitTextElem) {
    exitTextElem.remove();
  }

  const exitText = document.createElement("div");
  exitText.id = "exit-fullscreen-text";
  // exitText.textContent = "Press Esc to exit full screen";
  exitText.textContent = "Exit Fullscreen";
  exitText.style.position = "fixed";
  exitText.style.top = "10px";
  exitText.style.left = "50%";
  exitText.style.transform = "translateX(-50%)";
  exitText.style.color = "#fff";
  exitText.style.background = "rgba(0, 0, 0, 0.7)";
  exitText.style.padding = "10px";
  exitText.style.borderRadius = "5px";
  exitText.style.zIndex = "10001";
  document.body.appendChild(exitText);

  // Add touch/click event for mobile exit
  exitText.addEventListener("touchstart", function () {
    normalScreen();
    exitText.remove();
    const screenSwitch = document.getElementById("screen-switch");
    if (screenSwitch) screenSwitch.checked = false;
  });
  exitText.addEventListener("click", function () {
    normalScreen();
    exitText.remove();
    const screenSwitch = document.getElementById("screen-switch");
    if (screenSwitch) screenSwitch.checked = false;
  });
}
