// ================================ //
function detectImageProcessing(canvas) {
  const processedCanvas = deskewImage(canvas);
  // deskewImage(canvas);

  // processedCanvas = canvas;
  return processedCanvas;
}

// ================================ //
function deskewImage(canvas) {
  // Read and preprocess
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Adaptive threshold for better edge detection
  const thresh = new cv.Mat();
  cv.adaptiveThreshold(
    gray,
    thresh,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY_INV,
    21,
    15
  );

  // Canny edge detection
  const edges = new cv.Mat();
  cv.Canny(thresh, edges, 30, 100);

  // Probabilistic Hough transform
  const lines = new cv.Mat();
  cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 60, canvas.width / 10, 10);

  let angles = [];
  for (let i = 0; i < lines.rows; i++) {
    const x1 = lines.data32S[i * 4];
    const y1 = lines.data32S[i * 4 + 1];
    const x2 = lines.data32S[i * 4 + 2];
    const y2 = lines.data32S[i * 4 + 3];
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    if (Math.abs(angle) < 45) angles.push(angle);
  }

  // Use median for robust angle estimation
  let avgAngle = 0;
  if (angles.length > 0) {
    angles.sort((a, b) => a - b);
    const mid = Math.floor(angles.length / 2);
    avgAngle =
      angles.length % 2 !== 0
        ? angles[mid]
        : (angles[mid - 1] + angles[mid]) / 2;
  }

  // Deskew
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  const ctx = outputCanvas.getContext("2d");

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((-avgAngle * Math.PI) / 180);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  ctx.restore();

  // Clean up
  src.delete();
  gray.delete();
  thresh.delete();
  edges.delete();
  lines.delete();

  return outputCanvas;
}
