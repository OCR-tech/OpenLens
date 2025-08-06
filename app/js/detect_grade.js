// =========================================//
// GRADE DETECTION FUNCTIONS
function toggleGradeDetection() {
  // alert("toggleGradeDetection");

  const groupFrameGrade = document.getElementById("group-frame-grade");
  const gradeSwitch = document.getElementById("grade-switch");
  // const gradeStatus = document.getElementById("grade-status");

  if (!gradeSwitch) return;

  groupFrameGrade.style.display = gradeSwitch.checked ? "flex" : "none";

  if (window.voiceStatusEnabled) {
    playVoiceStatus("Grade Detection " + (gradeSwitch.checked ? "On" : "Off"));
  }

  // gradeStatus.innerHTML = gradeSwitch.checked
  //   ? 'Grade: <b style="color:green">o</b>'
  //   : 'Grade: <b style="color:blue">-</b>';

  localStorage.setItem(
    "gradeDetectionMode",
    gradeSwitch.checked ? "on" : "off"
  );
}

// =========================================//
function setGradeDetectionMode(mode) {
  // alert("setGradeDetectionMode: " + mode);

  const groupFrameGrade = document.getElementById("group-frame-grade");
  const gradeSwitch = document.getElementById("grade-switch");
  // const gradeStatus = document.getElementById("grade-status");

  if (gradeSwitch) {
    gradeSwitch.checked = mode === "on";
    gradeSwitch.dispatchEvent(new Event("change"));
  }

  // window.redBoxesDetectionEnabled = gradeSwitch.checked;

  // if (gradeStatus) {
  //   gradeStatus.innerHTML =
  //     mode === "on"
  //       ? 'Grade: <b style="color:green">o</b>'
  //       : 'Grade: <b style="color:blue">-</b>';
  // }

  if (groupFrameGrade) {
    groupFrameGrade.style.display =
      gradeSwitch && gradeSwitch.checked ? "flex" : "none";
  }

  localStorage.setItem("gradeDetectionMode", mode);
}

// =========================================//
function updateGradeDetection() {
  // alert("updateGradeDetection");

  const status = document.getElementById("status");
  const gradeSwitch = document.getElementById("grade-switch");
  const canvas = document.getElementById("overlay");
  const source =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("video") ||
    document.getElementById("image") ||
    document.getElementById("image-file-viewer");

  if (!canvas || !gradeSwitch || !gradeSwitch.checked || !source) return;

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

  // ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 5;
  ctx.strokeRect(405, 20, 300, 50);
  ctx.fillStyle = "blue";
  ctx.fillRect(50, 50, 100, 100);

  // ----------------------------- //
  // updateGradeDetectionBox(canvas);
  const gradeBoxes = detectGradeBoxes(canvas);

  status.innerText =
    "Grade boxes detected: " +
    gradeBoxes.length +
    // " " +
    // JSON.stringify(gradeBoxes) +
    " " +
    source.width +
    "x" +
    source.height +
    " " +
    canvas.width +
    "x" +
    canvas.height;

  // ----------------------------- //
  gradeBoxes.forEach((box) => {
    ctx.strokeRect(box.left, box.top, box.width, box.height);
  });
}

// =========================================//
// function updateGradeDetectionBox(canvas) {
//   // alert("updateGradeDetectionBox");

//   const status = document.getElementById("status");
//   if (!status) return;

//   status.innerText = "Detecting...";

//   // Get the canvas context
//   const ctx = canvas.getContext("2d", { willReadFrequently: true });
//   if (!ctx) {
//     status.innerText = "Canvas context not found!";
//     return;
//   }

//   // Process the image data to detect grades
//   // const processedText = processGrades(data);

//   // Display the processed text in the textarea
//   const textarea = document.getElementById("grades-input");
//   if (textarea) {
//     textarea.value = processedText;
//     status.innerText = "Grade detected!";
//   } else {
//     status.innerText = "Textarea not found!";
//   }
// }

// =========================================//
// Function to process the grade input
// function processGrades(text) {
//   let processedText = text.replace(/\s+/g, " ").trim();
//   processedText = processedText.replace(/([.,!?])\s+/g, "$1 "); // Ensure space after punctuation
//   processedText = processedText.replace(/\s([.,!?])/g, "$1"); // Remove space before punctuation
//   processedText = processedText.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space
//   processedText = processedText.replace(/^\s+|\s+$/g, ""); // Trim leading and trailing spaces
//   processedText = processedText.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

//   // Check words with dictionary
//   const processedDictText = lookupGradesDict(processedText);

//   return processedDictText;
// }

// =========================================//
function detectGrades() {
  const status = document.getElementById("status");
  const detectGradeButton = document.getElementById("btn-detect-grade");
  if (!status) return;
  clearGrades();
  status.innerText = "Detecting grade...";
  window.gradeDetectionEnabled = true;
  detectGradeButton.disabled = true;
}

// =========================================//
function pauseGrades() {
  const status = document.getElementById("status");
  const detectGradeButton = document.getElementById("btn-detect-grade");
  if (!status) return;
  status.innerText = "Paused";
  window.gradeDetectionEnabled = false;
  detectGradeButton.disabled = false;
}

// =========================================//
function clearGrades() {
  const textarea = document.getElementById("grades-input");
  if (textarea) {
    textarea.value = "";
    const status = document.getElementById("status");
    if (status) status.innerText = "Cleared!";
  }
}

// =========================================//
function csvGrades() {
  const textarea = document.getElementById("grades-input");
  const status = document.getElementById("status");
  if (!textarea || !textarea.value.trim()) {
    if (status) status.innerText = "No grade to export!";
    return;
  }

  // Split grades into rows (by newline or period, adjust as needed)
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
  a.download = "OpenLens_Grades.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (status) status.innerText = "File created!";
}

// =========================================//
function spreadsheetGrades() {
  // alert("spreadsheetGrades");

  const textarea = document.getElementById("grades-input");
  const status = document.getElementById("status");
  if (!textarea || !textarea.value.trim()) {
    if (status) status.innerText = "No grade to export!";
    return;
  }

  // Split grades into columns (by ":")
  const rows = textarea.value
    .split(/\r?\n/)
    .map((line) => line.split(":").map((cell) => cell.trim()))
    .filter((row) => row.length > 0 && row[0]);

  // XLSX generation using SheetJS (xlsx library)
  // Make sure xlsx.full.min.js is loaded in your HTML
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Grade");

  // Create XLSX file and trigger download
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "OpenLens_Grades.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (status) status.innerText = "File created!";
}
