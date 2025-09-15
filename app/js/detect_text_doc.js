// Detects if the file is a text document or an XLSX file
function browseXLSXFile() {
  // alert("browseXLSXFile");

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
  // alert("readXLSXFile");

  const status = document.getElementById("status");
  // const textInput = document.getElementById("texts-input");
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
  const textInput = document.getElementById("texts-input");
  const text = document.getElementById("texts-input").value;

  if (!file) {
    status.innerText = "No XLSX file selected.";
    return;
  }
  if (!text.trim()) {
    status.innerText = "No text to add.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to array of arrays
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Get headers from the first row
    const headers = rows[0];

    // Process key-value pairs in the text input
    const newText = processKeyValuePairs(text, headers);
    textInput.value += "\n" + newText;

    // Process the new text input based on headers
    const newRow = processTextInput(newText, headers);

    // Add new row
    rows.push(newRow);

    // Convert back to sheet and update workbook
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows);

    // Write and download the updated file
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "OpenLens1.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    status.innerText = "Text added and XLSX file downloaded.";
  };
  reader.readAsArrayBuffer(file);
}

// ======================================= //
function processKeyValuePairs(text, headers) {
  // insert a comma based on header names
  let newText = text;
  headers.forEach((header) => {
    const regex = new RegExp(`\\b${header}\\b`, "g");
    newText = newText.replace(regex, `, ${header}`);
  });

  return newText.replace(/^, /, ""); // Remove leading comma if any
}

// ======================================= //
function processTextInput(newText, headers) {
  // Example input: "Name: John, Age: 30"
  // Split by comma, then by colon
  const pairs = newText.split(",").map((s) => s.trim());
  const row = Array(headers.length).fill(""); // Start with empty row

  pairs.forEach((pair) => {
    const [key, value] = pair.split(":").map((s) => s.trim());
    const colIdx = headers.indexOf(key);
    if (colIdx !== -1) row[colIdx] = value;
  });

  return row;
}
