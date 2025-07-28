// =========================================//
// TEXT DETECTION FUNCTIONS
function toggleTextDetection() {
  // alert("toggleTextDetection");
  const groupFrameText = document.getElementById("group-frame-text");
  const textSwitch = document.getElementById("text-switch");
  const textStatus = document.getElementById("text-status");

  if (!textSwitch) return;

  // window.textDetectionEnabled = textSwitch.checked;
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
}

// =========================================//
function updateTesseract(canvas) {
  // alert("updateTesseract");

  const textsInput = document.getElementById("texts-input");
  const status = document.getElementById("status");
  const languageSelect = document.getElementById("language-select");
  const detectTextButton = document.getElementById("btn-detect-text");
  if (!canvas || !textsInput || !status || !languageSelect) return;

  // Get selected language from dropdown, default to "eng"
  const lang = languageSelect.value || "eng" || "tha";

  Tesseract.recognize(canvas.toDataURL("image/png"), lang)
    .then(({ data: { text } }) => {
      if (!text || text.trim() === "") {
        // status.innerText = "No text detected";
        textsInput.value = "";
        // } else if (text.length > 1000) {
        //   status.innerText = "Detected text";
        //   textsInput.value = text;
        // textsInput.value = text.substring(0, 1000);
      } else {
        text = processTexts(text);
        status.innerText = "Detecting text: Done";
        textsInput.value = text;
      }
      window.textDetectionEnabled = false;
      detectTextButton.disabled = false;
    })
    .catch((error) => {
      console.error("Error during OCR:", error);
    });
}

// =========================================//
// Function to process the text input
function processTexts(text) {
  let processedText = text.replace(/\s+/g, " ").trim();
  processedText = processedText.replace(/([.,!?])\s+/g, "$1 "); // Ensure space after punctuation
  processedText = processedText.replace(/\s([.,!?])/g, "$1"); // Remove space before punctuation
  processedText = processedText.replace(
    /[^a-zA-Z0-9\s.,:!@#$%&*()_+={}/]/g,
    ""
  ); // Remove non-alphanumeric characters except for punctuation
  processedText = processedText.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space
  processedText = processedText.replace(/^\s+|\s+$/g, ""); // Trim leading and trailing spaces
  processedText = processedText.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

  // Check words with dictionary
  processedText = lookupWordsDict(processedText);

  return processedText;
}

// =========================================//
// Synchronous dictionary lookup using a local word list (english_dictionary.js must be loaded)
// This function checks each word in processedText and updates the status with unknown words.
function lookupWordsDict(processedText) {
  // alert("lookupWordsDict");

  // Return the original text (or you can return a highlighted version)
  return processedText;
}

// =========================================//
function detectTexts() {
  const status = document.getElementById("status");
  const detectTextButton = document.getElementById("btn-detect-text");
  if (!status) return;
  status.innerText = "Detecting text...";
  window.textDetectionEnabled = true;
  detectTextButton.disabled = true;
  // clearTexts();
}

// =========================================//
function pauseTexts() {
  const status = document.getElementById("status");
  if (!status) return;
  status.innerText = "Paused.";
  window.textDetectionEnabled = false;
}

// =========================================//
function copyTexts() {
  const textarea = document.getElementById("texts-input");
  if (textarea) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textarea.value)
        .then(() => {
          const status = document.getElementById("status");
          if (status) status.innerText = "Copied to clipboard!";
        })
        .catch(() => {
          const status = document.getElementById("status");
          if (status) status.innerText = "Failed to copy text!";
        });
    }
  }
}

// =========================================//
// function cutTexts() {
//   const textarea = document.getElementById("texts-input");
//   if (textarea) {
//     if (navigator.clipboard) {
//       navigator.clipboard
//         .writeText(textarea.value)
//         .then(() => {
//           textarea.value = "";
//           const status = document.getElementById("status");
//           if (status) status.innerText = "Cut to clipboard!";
//         })
//         .catch(() => {
//           const status = document.getElementById("status");
//           if (status) status.innerText = "Failed to cut text!";
//         });
//     }
//   }
// }

// =========================================//
// function selectallTexts() {
//   const textarea = document.getElementById("texts-input");
//   if (textarea) {
//     textarea.select();
//     textarea.setSelectionRange(0, textarea.value.length); // For mobile devices
//     const status = document.getElementById("status");
//     if (status) status.innerText = "Text selected!";
//   }
// }

// =========================================//
function clearTexts() {
  const textarea = document.getElementById("texts-input");
  if (textarea) {
    textarea.value = "";
    const status = document.getElementById("status");
    if (status) status.innerText = "Text cleared!";
  }
}
