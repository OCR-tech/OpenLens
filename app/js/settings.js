// =========================================//
// Video resolution selection
function selectVideoResolution() {
  const videoResolution = document.getElementById("video-resolution").value;
  document.getElementById("status").innerText =
    "Video resolution set to: " + videoResolution;
  // Here you would typically send the selected resolution to the backend
}

// =========================================//
// Video frame rate selection
function selectVideoFrameRate() {
  const videoFrameRate = document.getElementById("video-frame-rate").value;
  document.getElementById("status").innerText =
    "Video frame rate set to: " + videoFrameRate;
  // Here you would typically send the selected frame rate to the backend
}

// =========================================//
function saveFilePathLocation() {
  const filePathInput = document.getElementById("file-path-location");
  const filePath = filePathInput ? filePathInput.value.trim() : "";

  if (filePath) {
    // Basic validation for file path format
    const pathPattern = /^([a-zA-Z]:\\|\/)?[a-zA-Z0-9_\-\/\\\.]+$/;
    if (!pathPattern.test(filePath)) {
      document.getElementById("status").innerText =
        "Please enter a valid file path (e.g., /path/to/file).";
      return false;
    }
    document.getElementById("status").innerText = "File path is valid.";
    // save file to this valid path
    saveJSONToPath(
      window.detectedObjects,
      document.getElementById("file-path-location").value
    );
    return true;
  } else {
    document.getElementById("status").innerText = "File path cannot be empty.";
    return false;
  }
}

/**
 * Attempt to save a JSON file to the specified path.
 * Note: In browsers, you cannot write directly to arbitrary file paths for security reasons.
 * This function will trigger a download with the filename from the path.
 * @param {Object|Array} data - The data to save as JSON.
 * @param {string} filePath - The user-specified file path or filename.
 */
function saveJSONToPath(data, filePath) {
  // Extract filename from the path (for browser download)
  const parts = filePath.split(/[\/\\]/);
  const filename = parts[parts.length - 1] || "data.json";

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  document.getElementById("status").innerText = "File saved as: " + filename;
}

// Usage example:
// saveJSONToPath(window.detectedObjects, document.getElementById("file-path-location").value);
