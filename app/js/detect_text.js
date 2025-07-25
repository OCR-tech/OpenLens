// =========================================//
// TEXT DETECTION FUNCTIONS
function toggleTextDetection() {
  // alert("toggleTextDetection");
  const groupFrameText = document.getElementById("group-frame-text");
  const textSwitch = document.getElementById("text-switch");
  const textStatus = document.getElementById("text-status");

  if (!textSwitch) return;

  window.textDetectionEnabled = textSwitch.checked;
  groupFrameText.style.display = textSwitch.checked ? "flex" : "none";

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Text Detection " + (textSwitch.checked ? "On" : "Off"));
  }

  textStatus.innerHTML = textSwitch.checked
    ? 'Text: <b style="color:green">o</b>'
    : 'Text: <b style="color:blue">-</b>';

  localStorage.setItem("textDetectionMode", textSwitch.checked ? "on" : "off");
}

// =========================================//
function setTextDetectionMode(mode) {
  // alert("setTextDetectionMode: " + mode);

  const groupFrameText = document.getElementById("group-frame-text");
  const textSwitch = document.getElementById("text-switch");
  const textStatus = document.getElementById("text-status");

  if (textSwitch) {
    textSwitch.checked = mode === "on";
    textSwitch.dispatchEvent(new Event("change"));
  }

  if (textStatus) {
    textStatus.innerHTML =
      mode === "on"
        ? 'Text: <b style="color:green">o</b>'
        : 'Text: <b style="color:blue">-</b>';
  }

  if (groupFrameText) {
    groupFrameText.style.display =
      textSwitch && textSwitch.checked ? "flex" : "none";
  }

  localStorage.setItem("textDetectionMode", mode);
}

// =========================================//
function updateTextDetection() {
  // alert("updateTextDetection");

  const source =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("video") ||
    document.getElementById("image") ||
    document.getElementById("image-file-viewer");
  const canvas = document.getElementById("overlay");

  if (!canvas || !motionSwitch || !motionSwitch.checked || !source) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (source instanceof HTMLVideoElement) {
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
  } else if (source instanceof HTMLImageElement) {
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
    source.crossOrigin = "anonymous"; // Set Cross-Origin Attribute
  } else {
    document.getElementById("status").innerText = "No video/image found";
    return;
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  // Use Tesseract.js to recognize text from the canvas image
  Tesseract.recognize(canvas.toDataURL("image/png"), "eng")
    .then(({ data: { text } }) => {
      // alert("Detected text: " + text);
      drawText(text);
      const textsInput = document.getElementById("texts-input");
      if (textsInput) textsInput.value = text;
    })
    .catch((error) => {
      console.error("Error during OCR:", error);
    });
}

// =========================================//
function drawText(text) {
  // alert("drawText: " + text);

  if (!ctx || !canvas || !video) return;
  // Resize canvas if needed
  if (
    canvas.width !== video.videoWidth ||
    canvas.height !== video.videoHeight
  ) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If text contains bounding box info, draw it. Otherwise, just draw the text.
  if (text && text.trim() !== "") {
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(text, 10, 30); // Draw text at position (10, 30)
    console.log("Text drawn on canvas:", text);
  } else {
    console.log("No text detected to draw.");
  }
}
