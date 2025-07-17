// =========================================//
function recordToJSON(predictions) {
  // alert("recordToJSON called, predictions: " + JSON.stringify(predictions));

  // Remove alert for production use
  if (!predictions || predictions.length === 0) return;

  // Use ISO format for timestamp
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  // Get existing records for incremental ID
  // const existingData = JSON.parse(localStorage.getItem("detectionRecords")) || [];

  const data = {
    // no: existingData.length + 1, // Incremental counter based on previous records
    timestamp: timestamp,
    // filename: `img_${timestamp}.jpg`,
    location_lat: cachedGPS?.latitude.toFixed(4) || "Unknown",
    location_lon: cachedGPS?.longitude.toFixed(4) || "Unknown",
    predictions: predictions.map((p, idx) => ({
      id: (idx + 1).toString(),
      // objectNumber: (idx + 1).toString(),
      // objectName: p.class,
      class: p.class,
      // score: p.score,
      score: p.score.toFixed(1),
      bbox: p.bbox.map((v) => Math.round(v)), // [x, y, width, height]
    })),
  };

  // Save and write to json file
  const existingData =
    JSON.parse(localStorage.getItem("detectionRecords")) || [];
  existingData.push(data);
  localStorage.setItem("detectionRecords", JSON.stringify(existingData));
  addtoJSONFile(existingData, "detection_records.json");
}

// =========================================//
/**
 * Create and download a JSON file from any JS object or array.
 * @param {Object|Array} data - The data to save as JSON.
 * @param {string} filename - The filename for the downloaded JSON file.
 */
function addtoJSONFile(data, filename = "data.json") {
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
}

// =========================================//
// Function to save detected objects to a JSON file
function saveDetectionsToJSON(detectedObjects) {
  const jsonStr = JSON.stringify(detectedObjects, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "detected_objects.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =========================================//
// Download detected objects as JSON when the button is clicked
function downloadJSONFile() {
  // Check if there are any detected objects in localStorage
  if (!localStorage.getItem("detectedObjects")) {
    alert("No detected objects found in localStorage.");
    return;
  }

  // Retrieve detected objects from localStorage
  const detectedObjects =
    JSON.parse(localStorage.getItem("detectedObjects")) || [];
  if (detectedObjects.length === 0) {
    alert("No detected objects to download.");
    return;
  }

  saveDetectionsToJSON(detectedObjects);
}
