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
      } else if (videoSource.value === "image_file") {
        window.selectedImageFiles = files;
      } else if (videoSource.value === "image_folder") {
        window.selectedImageFiles = files;
        // Optionally: startImage(URL.createObjectURL(files[0]));
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

  const videoSource = document.getElementById("video-source");
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

  if (videoSource.value === "image_folder") {
    // alert("Processing" + imageFolderFiles + " + " + imageFolderIndex);
    canvas_processed = detectImageProcessing(canvas);
    detectTextsTesseract(canvas_processed);
    // call the function at every 10s interval
    // setTimeout(getNextImageInFolder, 10000);
    // getNextImageInFolder();
    // Loop for all images in the folder
    // ----------------------------- //

    // ----------------------------- //
  } else {
    // ----------------------------- //
    // canvas_processed = canvas;
    canvas_processed = detectImageProcessing(canvas);

    // ----------------------------- //
    displayProcessedImage(canvas_processed);

    // ----------------------------- //
    // detectLayoutDocument(canvas_processed);

    // ----------------------------- //
    detectTextsTesseract(canvas_processed);

    // ----------------------------- //
    // extractTextFromBoxes(redBoxes);
  }
}

// =========================================//
function displayProcessedImage(processedCanvas) {
  // Create a new image element from the processed canvas
  const img = new Image();
  img.src = processedCanvas.toDataURL("image/png");
  img.alt = "Processed Image";
  img.style.border = "2px solid red";
  img.style.margin = "3px";
  img.style.maxWidth = "50%";
  img.style.maxHeight = "50%";

  if (canvas.nextSibling) {
    canvas.parentNode.insertBefore(img, canvas.nextSibling);
  } else {
    canvas.parentNode.appendChild(img);
  }
}

// =========================================//
let redBoxes = [];

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
  redBoxes = detectRedBoxes(canvas);
  // alert(
  //   "Red boxes: " + " + " + redBoxes.length + " + " + JSON.stringify(redBoxes)
  // );

  // status.innerText = "Red boxes detected: " + redBoxes.length;
  // " + " +
  //   JSON.stringify(redBoxes) +
  //   " + " +
  //   source.width +
  //   "x" +
  //   source.height +
  //   " + " +
  //   canvas.width +
  //   "x" +
  //   canvas.height;

  // ----------------------------- //
  redBoxes.forEach((box) => {
    ctx.strokeRect(box.left, box.top, box.width, box.height);
  });
}

// =========================================//
function extractTextFromBoxes(boxes) {
  // alert("extractTextFromBoxes");

  const textsInput1 = document.getElementById("texts-input1");
  if (!canvas || !boxes || boxes.length === 0) {
    if (textsInput1) textsInput1.innerText = "No boxes detected";
    return [];
  }

  // sort boxes from top to bottom, left to right
  boxes.sort((a, b) => {
    if (a.top !== b.top) {
      return a.top - b.top; // Sort by top position
    }
    return a.left - b.left; // If tops are equal, sort by left position
  });

  // Process each box asynchronously
  Promise.all(
    boxes.map(async (box) => {
      // Create a temporary canvas for each box
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = box.width;
      tempCanvas.height = box.height;
      const tempCtx = tempCanvas.getContext("2d");

      // Draw the box region from the main canvas
      tempCtx.drawImage(
        canvas,
        box.left,
        box.top,
        box.width,
        box.height,
        0,
        0,
        box.width,
        box.height
      );

      const langArray = getSelectedLanguages();
      const lang = Array.isArray(langArray)
        ? langArray.length > 1
          ? langArray.join("+")
          : langArray[0] || "eng"
        : langArray || "eng";

      // Run OCR on the cropped region
      const {
        data: { text },
      } = await Tesseract.recognize(tempCanvas.toDataURL("image/png"), lang);
      return {
        box,
        text: text.trim(),
      };
    })
  ).then((results) => {
    if (textsInput1) {
      textsInput1.innerText = results.map((r) => r.text).join("|---|");
      // textsInput1.innerText = results.map((r) => r.text).join("\n");
    }
    // Optionally: do something with results
  });
}

// =========================================//
function detectLayoutDocument(canvas) {
  // alert("detectLayoutDocument");

  const status = document.getElementById("status");
  // const canvas = document.getElementById("overlay");

  const source =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("video") ||
    document.getElementById("image") ||
    document.getElementById("image-file-viewer");

  status.innerText = canvas.width + "x" + canvas.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  ctx.strokeRect(40, 20, 30, 50);

  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 10, 100);

  // Use Tesseract's layout analysis (returns blocks, lines, words, etc.)
  // Tesseract.recognize(canvas.toDataURL("image/png"), "eng", {}).then(
  //   ({ data }) => {
  //     // alert("Layout data: " + JSON.stringify(data));
  //     // status.innerText = JSON.stringify(data);
  //     // alert(
  //     //   "Layout data: " +
  //     //     " + " +
  //     //     data.blocks.length +
  //     //     " + " +
  //     //     data.lines.length +
  //     //     " + " +
  //     //     data.words.length
  //     // );

  //     ctx.save();

  //     // Draw blocks in green
  //     ctx.strokeStyle = "green";
  //     ctx.lineWidth = 2;
  //     if (data.blocks && data.blocks.length > 0) {
  //       data.blocks.forEach((block) => {
  //         ctx.strokeRect(
  //           block.bbox.x0,
  //           block.bbox.y0,
  //           block.bbox.x1 - block.bbox.x0,
  //           block.bbox.y1 - block.bbox.y0
  //         );
  //       });
  //     }

  //     // Draw lines in orange
  //     ctx.strokeStyle = "orange";
  //     ctx.lineWidth = 1.5;
  //     if (data.lines && data.lines.length > 0) {
  //       data.lines.forEach((line) => {
  //         ctx.strokeRect(
  //           line.bbox.x0,
  //           line.bbox.y0,
  //           line.bbox.x1 - line.bbox.x0,
  //           line.bbox.y1 - line.bbox.y0
  //         );
  //       });
  //     }

  //     // Draw words in blue
  //     ctx.strokeStyle = "blue";
  //     ctx.lineWidth = 1;
  //     if (data.words && data.words.length > 0) {
  //       data.words.forEach((word) => {
  //         ctx.strokeRect(
  //           word.bbox.x0,
  //           word.bbox.y0,
  //           word.bbox.x1 - word.bbox.x0,
  //           word.bbox.y1 - word.bbox.y0
  //         );
  //       });
  //     }

  //     ctx.restore();
  //   }
  // );
}

// =========================================//
function detectTextsTesseract(canvas) {
  // alert("detectTextsTesseract");

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
        status.innerText = "Detecting text: No text";
        textsInput.value = "";
        // } else if (text.length > 1000) {
        // status.innerText = "Detected text";
        // textsInput.value = text;
        // textsInput.value = text.substring(0, 1000);
      } else {
        // ----------------------------- //
        processedText = processTexts(text);
        processedDictText = lookupWordsDict(processedText);

        // ----------------------------- //
        // status.innerText = "Detecting text: Done" + " *** " + lang;
        status.innerText = "Detecting text: Done";
        textsInput.value = processedText;
        // textsInput.value = text;
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
  return processedText;
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

// =========================================//
function lookupWordsDict(processedText) {
  // alert("lookupWordsDict");

  // Split text into words
  const words = processedText.split(/\s+/);

  // Check each word against the dictionary
  const checkedWords = words.map((word) => {
    // const cleanWord = word.replace(/[.,!?;:()"]/g, "").toLowerCase();
    const cleanWord = word.replace(/[]/g, "").toLowerCase();

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
  const textarea1 = document.getElementById("texts-input1");
  if (textarea) {
    textarea.value = "";
    textarea1.value = "";
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
function spreadsheetTexts0() {
  // alert("spreadsheetTexts");

  const textarea = document.getElementById("texts-input");
  // const textarea = document.getElementById("texts-input1");

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
    // .map((line) => line.split("|---|").map((cell) => cell.trim()))
    .filter((row) => row.length > 0 && row[0]);

  // XLSX generation using SheetJS (xlsx library)
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

// =========================================//
function spreadsheetTexts() {
  // alert("spreadsheetTexts");

  const textarea = document.getElementById("texts-input");
  // const textarea = document.getElementById("texts-input1");

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
    // .map((line) => line.split("|---|").map((cell) => cell.trim()))
    .filter((row) => row.length > 0 && row[0]);

  // ----------------------------------//
  // Check if the file exists

  // XLSX generation using SheetJS (xlsx library)
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
