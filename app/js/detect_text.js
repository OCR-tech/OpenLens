// =========================================//
// TEXT DETECTION FUNCTIONS
function toggleTextDetection() {
  // alert("toggleTextDetection");
  const groupFrameText = document.getElementById("group-frame-text");
  const textSwitch = document.getElementById("text-switch");
  const textStatus = document.getElementById("text-status");

  if (!textSwitch) return;

  // window.textDetectionEnabled = textSwitch.checked;
  window.redBoxesDetectionEnabled = textSwitch.checked; // Use red boxes for text detection
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

  window.redBoxesDetectionEnabled = textSwitch.checked;

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
function browseFolder() {
  // alert("browseFolder");
  const videoSource = document.getElementById("video-source");
  const btnStart = document.getElementById("btn-start");
  const btnCommand = document.getElementById("btn-command");
  const btnVoice = document.getElementById("btn-voice");
  const btnOk = document.getElementById("btn-ok");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.webkitdirectory = true; // Enable folder selection
  fileInput.multiple = true;

  if (videoSource.value === "video") {
    fileInput.accept = "video/*";
  } else if (videoSource.value === "image") {
    fileInput.accept = "image/*";
  }

  fileInput.onchange = function (event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const fileNames = files.map((f) => f.name).join(", ");
      document.getElementById("status").innerText =
        "Selected files: " + fileNames;
      btnStart.disabled = false;
      btnCommand.disabled = false;
      btnVoice.disabled = false;
      btnOk.disabled = true;

      if (videoSource.value === "video") {
        window.selectedVideoFiles = files;
        // Optionally: CheckVideo(files[0]);
        // Optionally: startVideo(URL.createObjectURL(files[0]));
      } else if (videoSource.value === "image") {
        window.selectedImageFiles = files;
      }
      startButton();
    } else {
      document.getElementById("status").innerText = "No files selected.";
      window.selectedVideoFiles = null;
      window.selectedImageFiles = null;
    }
  };

  fileInput.click();
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

  // ----------------------------- //
  updateTesseract(canvas);
}

// =========================================//
function drawRedBoxes() {
  // alert("drawRedBoxes");

  const status = document.getElementById("status");
  const source =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("video") ||
    document.getElementById("image") ||
    document.getElementById("image-file-viewer");

  if (!canvas || !source) return;

  // -------------------------------- //
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  // ctx.strokeRect(405, 20, 300, 50);
  // ctx.fillStyle = "red";
  // ctx.fillRect(50, 50, 100, 100);

  // ----------------------------- //
  const redBoxes = detectRedBoxes(canvas);
  // alert(
  //   "Red boxes: " + " + " + redBoxes.length + " + " + JSON.stringify(redBoxes)
  // );

  // status.innerText = "Red boxes detected: " + redBoxes.length
  // " + " +
  // JSON.stringify(redBoxes) +
  // " + " +
  // source.width +
  // "x" +
  // source.height +
  // " + " +
  // canvas.width +
  // "x" +
  // canvas.height;

  // ----------------------------- //
  redBoxes.forEach((box) => {
    ctx.strokeRect(box.left, box.top, box.width, box.height);
  });
}

// =========================================//
function updateTesseract(canvas) {
  // alert("updateTesseract");

  const textsInput = document.getElementById("texts-input");
  const status = document.getElementById("status");
  // const languageSelect = document.getElementById("language-select");
  const detectTextButton = document.getElementById("btn-detect-text");
  if (!canvas || !textsInput || !status) return;

  // ---------------------------------------//
  // alert(Object.keys(Tesseract.languages));
  const langArray = getSelectedLanguages();
  const lang = Array.isArray(langArray)
    ? langArray.length > 1
      ? langArray.join("+")
      : langArray[0] || "eng"
    : langArray || "eng";

  // const lang = "eng";
  // const lang = "tha";
  // const lang = "jpn";
  // const lang = "chi_sim";
  // status.innerText = " +++ " + lang;

  Tesseract.recognize(canvas.toDataURL("image/png"), lang)
    .then(({ data: { text } }) => {
      if (!text || text.trim() === "") {
        // status.innerText = "No text detected";
        textsInput.value = "";
        // } else if (text.length > 1000) {
        // status.innerText = "Detected text";
        // textsInput.value = text;
        // textsInput.value = text.substring(0, 1000);
      } else {
        text = processTexts(text);
        status.innerText = "Detecting text: Done" + " *** " + lang;
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
  processedText = text.replace(/\s+/g, " ").trim();
  processedText = processedText.replace(/([.,!?])\s+/g, "$1 "); // Ensure space after punctuation
  processedText = processedText.replace(/\s([.,!?])/g, "$1"); // Remove space before punctuation
  processedText = processedText.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space
  processedText = processedText.replace(/^\s+|\s+$/g, ""); // Trim leading and trailing spaces
  processedText = processedText.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

  // Check words with dictionary
  processedDictText = lookupWordsDict(processedText);

  return processedDictText;
}

// =========================================//
let offlineDictionarySet = null;
// Load dictionary from local JSON file (e.g., 'pages/dict_eng1.json')
async function loadOfflineDictionary() {
  try {
    // alert("loadOfflineDictionary");
    const response = await fetch("app/json/dict_eng.json");
    const words = await response.json(); // Should be an array of words
    offlineDictionarySet = new Set(words.map((w) => w.toLowerCase()));
    // alert(words + offlineDictionarySet);
  } catch (err) {
    alert("Failed to load dictionary:", err);
    offlineDictionarySet = new Set();
  }
}

// Call this once at startup
loadOfflineDictionary();

// =========================================//
function lookupWordsDict(processedText) {
  // alert("lookupWordsDict");

  // Split text into words
  const words = processedText.split(/\s+/);

  // Check each word against the dictionary
  const checkedWords = words.map((word) => {
    const cleanWord = word.replace(/[.,!?;:()"]/g, "").toLowerCase();

    // check cleanWord on json file directly
    if (offlineDictionarySet && offlineDictionarySet.has(cleanWord)) {
      return word; // Known word
    } else {
      // return; // Unknown word
      // return ""; // Unknown word
      // return "*"; // Unknown word
      return cleanWord; // Unknown word
      // return `<span style="color: yellow;">${word}</span>`;
    }
  });

  // Rejoin words into a string
  return checkedWords.join(" ");
}

// =========================================//
function detectTexts() {
  const status = document.getElementById("status");
  const detectTextButton = document.getElementById("btn-detect-text");
  if (!status) return;
  clearTexts();
  status.innerText = "Detecting text...";
  window.textDetectionEnabled = true;
  detectTextButton.disabled = true;
}

// =========================================//
function pauseTexts() {
  const status = document.getElementById("status");
  const detectTextButton = document.getElementById("btn-detect-text");
  if (!status) return;
  status.innerText = "Paused";
  window.textDetectionEnabled = false;
  detectTextButton.disabled = false;
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
function clearTexts() {
  const textarea = document.getElementById("texts-input");
  if (textarea) {
    textarea.value = "";
    const status = document.getElementById("status");
    if (status) status.innerText = "Cleared!";
  }
}

// =========================================//
function csvTexts() {
  const textarea = document.getElementById("texts-input");
  const status = document.getElementById("status");
  if (!textarea || !textarea.value.trim()) {
    if (status) status.innerText = "No text to export!";
    return;
  }

  // Split text into rows (by newline or period, adjust as needed)
  const rows = textarea.value
    .split(/\r?\n|(?<=\.)\s+/)
    .map((line) => [line.trim()])
    .filter((row) => row[0]);

  // Convert rows to CSV format
  const csvContent = rows
    .map((row) => row.map((cell) => `${cell.replace(/"/g, '""')}`).join(","))
    .join("\r\n");

  // Create a Blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "OpenLens.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (status) status.innerText = "File created!";
}

// =========================================//
// Function to export detected text to an XLSX spreadsheet
function spreadsheetTexts() {
  // alert("spreadsheetTexts");

  const textarea = document.getElementById("texts-input");
  const status = document.getElementById("status");
  if (!textarea || !textarea.value.trim()) {
    if (status) status.innerText = "No text to export!";
    return;
  }

  // ----------------------------------//
  // Split text into rows (by newline)
  // const rows = textarea.value
  //   .split(/\r?\n/)
  //   .map((line) => [line.trim()])
  //   .filter((row) => row[0]);

  // ----------------------------------//
  // Split text into columns (by ":")
  const rows = textarea.value
    .split(/\r?\n/)
    .map((line) => line.split(":").map((cell) => cell.trim()))
    .filter((row) => row.length > 0 && row[0]);

  // XLSX generation using SheetJS (xlsx library)
  // Make sure xlsx.full.min.js is loaded in your HTML
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Text");

  // Create XLSX file and trigger download
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "OpenLens.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (status) status.innerText = "File created!";
}
