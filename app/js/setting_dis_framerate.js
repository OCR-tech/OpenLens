// =========================================//
document.addEventListener("DOMContentLoaded", function () {
  const framerateSwitch = document.getElementById("frame-rate-switch");

  if (!framerateSwitch) return;

  // Set the switch state from localStorage
  framerateSwitch.checked = localStorage.getItem("framerateMode") === "on";

  // Set initial framerate state
  window.showFramerateOverlay = framerateSwitch.checked;

  // Add event listener
  framerateSwitch.addEventListener("change", toggleFramerate);
});

// =========================================//
function toggleFrameRate() {
  // alert("toggleFrameRate");

  const framerateLabel = document.getElementById("frame-rate-label");
  const framerateSwitch = document.getElementById("frame-rate-switch");

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Framerate " + (framerateSwitch.checked ? "On" : "Off"));
  }

  if (framerateSwitch) {
    window.showFramerateOverlay = framerateSwitch.checked;
    localStorage.setItem(
      "framerateMode",
      framerateSwitch.checked ? "on" : "off"
    );

    // display the label with current framerate
    if (window.showFramerateOverlay) {
      if (framerateLabel) {
        framerateLabel.style.display = "inline-block";
        updateFramerateLabel();
      }
    } else {
      if (framerateLabel) {
        framerateLabel.style.display = "none";
      }
    }
  }
}

// =========================================//
function updateFramerateLabel() {
  // alert("UpdateFramerateLabel");

  const framerateSwitch = document.getElementById("frame-rate-switch");
  const framerateLabel = document.getElementById("frame-rate-label");
  const video = document.querySelector("video");

  if (!framerateSwitch || !framerateLabel) return;

  if (!framerateSwitch.checked) {
    framerateLabel.style.display = "none";
    framerateLabel.textContent = "";
    return;
  } else {
    framerateLabel.style.display = "inline-block";

    if (!video) {
      framerateLabel.textContent = "FPS: N/A";
      return;
    } else {
      // fps = calcFPS();
      framerateLabel.textContent = "FPS: " + fps;
      return;
    }
  }
}

// =========================================//
function calcFPS() {
  const now = performance.now();
  if (lastFrameTime) {
    const delta = now - lastFrameTime;
    estimatedFPS = (1000 / delta).toFixed(1);
  }
  lastFrameTime = now;
  return estimatedFPS;
}

// =========================================//
let lastFrameTime = null;
let estimatedFPS = "-";
let fps = "-";
// =========================================//
// Display current framerate on canvas
function displayFramerate() {
  const canvas = document.getElementById("overlay");
  const ctx = canvas.getContext("2d");

  if (!ctx || !canvas) return;
  fps = calcFPS();
  const sizeText = fps;
  if (!sizeText) return;
  ctx.save();

  const canvasWidth = canvas.width;
  const fontSize = Math.round(canvasWidth / 25);
  ctx.font = `${fontSize}px Arial`;
  ctx.textBaseline = "top"; // Align text to the top of the rectangle

  const textWidth = ctx.measureText("FPS: " + sizeText).width;
  const textHeight = Math.round(fontSize * 1.2); // Adjust text height based on font size

  const paddingX = Math.round(canvasWidth / 100); // Horizontal padding
  const paddingY = Math.round(canvasWidth / 100); // Vertical padding

  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = textHeight + paddingY * 1;
  const x = canvasWidth - boxWidth - paddingX;
  const y = paddingY;

  // Draw background rectangle
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x, y, boxWidth, boxHeight);

  // Draw text right-aligned in the rectangle
  ctx.fillStyle = "#FFF";
  ctx.fillText("FPS: " + sizeText, x + paddingX, y + paddingY);
  ctx.restore();
}

// =========================================//
// function fpsLoop() {
//   fps = calcFPS();
//   displayFramerate();
//   requestAnimationFrame(fpsLoop);
// }

// =========================================//
function setFramerateMode(mode) {
  // alert("SetFramerateMode: " + mode);

  const framerateSwitch = document.getElementById("frame-rate-switch");
  const framerateLabel = document.getElementById("frame-rate-label");
  if (framerateSwitch) {
    framerateSwitch.checked = mode === "on";
    framerateSwitch.dispatchEvent(new Event("change"));
    framerateLabel.style.display = framerateSwitch.checked ? "block" : "none";
  }
}
