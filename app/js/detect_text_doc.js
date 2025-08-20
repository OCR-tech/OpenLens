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
function addTextToExistingXLSX(file, newText) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Get the first sheet (or use workbook.SheetNames[0])
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to array of arrays
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Add new text as a new row (split by ":" for columns, or just [newText])
    rows.push(newText.split(":").map((cell) => cell.trim()));

    // Convert back to sheet and update workbook
    workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows);

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
  };
  reader.readAsArrayBuffer(file);
}
