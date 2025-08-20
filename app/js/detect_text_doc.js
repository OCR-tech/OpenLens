// Detects if the file is a text document or an XLSX file
function browseXLSXFile() {
  // Create a file input element
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".xlsx"; // Accept only XLSX files

  fileInput.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
      document.getElementById("status").innerText =
        "Selected XLSX file: " + file.name;
      // Store the file object for further processing
      window.selectedXLSXFile = file;

      readXLSXFile();
    } else {
      document.getElementById("status").innerText = "No file selected.";
      window.selectedXLSXFile = null;
    }
  };

  // Trigger the file dialog
  fileInput.click();
}

// ======================================= //
// Reads the selected XLSX file and displays its content
function readXLSXFile() {
  // alert("Reading XLSX file...");

  const status = document.getElementById("status");
  const textInput = document.getElementById("texts-input");
  const textInput1 = document.getElementById("texts-input1");

  const file = window.selectedXLSXFile;
  if (!file) {
    document.getElementById("status").innerText = "No file selected.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get the first sheet (or use workbook.SheetNames[0])
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to array of arrays
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    textInput1.innerText = rows.map((row) => row.join(", ")).join("\n");
    status.innerText = "XLSX file read successfully.";
  };
  reader.readAsArrayBuffer(file);
}

// ======================================= //
function addTextToXLSX() {
  const status = document.getElementById("status");
  const file = window.selectedXLSXFile;
  const newText = document.getElementById("texts-input").value;

  if (!file) {
    status.innerText = "No XLSX file selected.";
    return;
  }
  if (!newText.trim()) {
    status.innerText = "No text to add.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get the first sheet (or use workbook.SheetNames[0])
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to array of arrays
    rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Process the new text input
    rows_processed = processTextInput(rows);

    // Add new text as a new row (split by ":" for columns, or just [newText])
    rows_processed.push(newText.split(":").map((cell) => cell.trim()));

    // Convert back to sheet and update workbook
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows_processed);

    // Write and download the updated file
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Updated_OpenLens.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    status.innerText = "Text added and XLSX file downloaded.";
  };
  reader.readAsArrayBuffer(file);
}

// ======================================= //
// Function to process text input and display it in the second input
function processTextInput(rows) {
  // alert("processTextInput");

  // add new data in row based on the columns data
  rows_processed = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.length > 0) {
      // remove column words
      const columnWords = ["Column1", "Column2", "Column3"];
      const filteredRow = row.filter((cell) => !columnWords.includes(cell));
      // Process each row, e.g., split by ":" and trim spaces
      const processedRow = filteredRow.map((cell) => cell.trim());
      rows_processed.push(processedRow);
    }
  }

  return rows_processed;
}
