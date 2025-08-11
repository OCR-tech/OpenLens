// ================================ //
function detectImageProcessing(canvas) {
  processedCanvas = deskewImage(canvas);
  processedCanvas = binarizeImage(processedCanvas);
  processedCanvas = removeLineHorizontalImage(processedCanvas);
  // processedCanvas = removeNoiseImage(processedCanvas);

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

// ================================ //
function binarizeImage(canvas) {
  // Convert the image on canvas to black text on white background using OpenCV
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Use adaptive thresholding for robust binarization
  const bin = new cv.Mat();
  cv.adaptiveThreshold(
    gray,
    bin,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY,
    21,
    15
  );

  // Create a new canvas for the binarized image
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, bin);

  // Clean up
  src.delete();
  gray.delete();
  bin.delete();

  return outputCanvas;
}

// ================================ //
function removeNoiseImage(canvas) {
  // Advanced adaptive noise removal using OpenCV
  const src = cv.imread(canvas);
  const dst = new cv.Mat();

  // Apply median blur to remove salt-and-pepper noise
  cv.medianBlur(src, dst, 3);

  // // Apply morphological opening to remove small objects/noise
  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
  const morph = new cv.Mat();
  cv.morphologyEx(dst, morph, cv.MORPH_OPEN, kernel);

  // Create a new canvas for the denoised image
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, dst);

  // Clean up
  src.delete();
  dst.delete();
  kernel.delete();
  morph.delete();

  return outputCanvas;
}

// ================================ //
function removeLineHorizontalImage(canvas) {
  // Remove horizontal lines using OpenCV
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Binarize for line detection
  const bin = new cv.Mat();
  cv.adaptiveThreshold(
    gray,
    bin,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY,
    21,
    15
  );

  // Morphological operations to detect horizontal lines
  const kernelSize = Math.max(10, Math.floor(bin.cols / 30));
  const horizontalKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(kernelSize, 1)
  );
  const detectedLines = new cv.Mat();
  cv.morphologyEx(bin, detectedLines, cv.MORPH_OPEN, horizontalKernel);

  // Invert detected lines and remove from binarized image
  const maskInv = new cv.Mat();
  cv.bitwise_not(detectedLines, maskInv);
  const cleaned = new cv.Mat();
  cv.bitwise_and(bin, maskInv, cleaned);

  // Create a new canvas for the line-removed image
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, detectedLines);

  // Clean up
  src.delete();
  gray.delete();
  bin.delete();
  horizontalKernel.delete();
  detectedLines.delete();
  maskInv.delete();
  cleaned.delete();

  return outputCanvas;
}
