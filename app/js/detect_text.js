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

  const textSwitch = document.getElementById("text-switch");
  const canvas = document.getElementById("overlay");
  const source =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("video") ||
    document.getElementById("image") ||
    document.getElementById("image-file-viewer");

  if (!canvas || !textSwitch || !textSwitch.checked || !source) return;

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

  updateTesseract(canvas);
  // Use Tesseract.js to recognize text from the canvas image
  // Tesseract.recognize(canvas.toDataURL("image/png"), "eng")
  //   .then(({ data: { text } }) => {
  //     // alert("Detected text: " + text);
  //     // drawText(text);
  //     if (status) status.innerText = "Detected text";
  //     if (textsInput) textsInput.value = text;
  //     window.textDetectionEnabled = false;
  //   })
  //   .catch((error) => {
  //     console.error("Error during OCR:", error);
  //   });
}

// =========================================//
function updateTesseract(canvas) {
  // alert("updateTesseract");

  const textsInput = document.getElementById("texts-input");
  const status = document.getElementById("status");

  if (!canvas || !textsInput || !status) return;

  Tesseract.recognize(canvas.toDataURL("image/png"), "eng")
    .then(({ data: { text } }) => {
      // If text is not detected, set textsInput to empty
      if (!text || text.trim() === "") {
        status.innerText = "No text detected";
        textsInput.value = "";
      } else if (text.length > 1000) {
        status.innerText = "Detected text";
        textsInput.value = text.substring(0, 1000);
      } else if (text.length > 500) {
        status.innerText = "Detected text";
        textsInput.value = text;
      } else {
        status.innerText = "Detected text";
        textsInput.value = text;
        // window.textDetectionEnabled = false;
      }
    })
    .catch((error) => {
      console.error("Error during OCR:", error);
    });
}
