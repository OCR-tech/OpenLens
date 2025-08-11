// ================================ //
function detectImageProcessing(canvas) {
  let processedCanvas = deskewImage(canvas);
  processedCanvas = binarizeImage(processedCanvas);
  processedCanvas = removeNoiseImage(processedCanvas);

  // processedCanvas = closeBoxImage(processedCanvas);
  // processedCanvas = removeLineHImage(processedCanvas); // Larger kernel for better line removal
  // processedCanvas = removeLineVImage(processedCanvas); // Larger kernel for better line removal
  // processedCanvas = removeBoxImage(processedCanvas);
  // processedCanvas = removeTableImage(processedCanvas);
  // processedCanvas = removeWatermarkImage(processedCanvas);

  return processedCanvas;
}

// ================================ //
function deskewImage(canvas) {
  // Improved deskew: use adaptive threshold and more robust angle filtering
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  const lines = new cv.Mat();
  cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 80, canvas.width / 12, 15);

  let angles = [];
  for (let i = 0; i < lines.rows; i++) {
    const x1 = lines.data32S[i * 4];
    const y1 = lines.data32S[i * 4 + 1];
    const x2 = lines.data32S[i * 4 + 2];
    const y2 = lines.data32S[i * 4 + 3];
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    if (Math.abs(angle) < 30) angles.push(angle);
  }

  let avgAngle = 0;
  if (angles.length > 0) {
    angles.sort((a, b) => a - b);
    const mid = Math.floor(angles.length / 2);
    avgAngle =
      angles.length % 2 !== 0
        ? angles[mid]
        : (angles[mid - 1] + angles[mid]) / 2;
  }

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  const ctx = outputCanvas.getContext("2d");

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((-avgAngle * Math.PI) / 180);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  ctx.restore();

  src.delete();
  gray.delete();
  edges.delete();
  lines.delete();

  return outputCanvas;
}

// ================================ //
function binarizeImage(canvas) {
  // Improved binarization: use Gaussian adaptive threshold
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const bin = new cv.Mat();
  // Use adaptive thresholding for better results on varying lighting conditions
  cv.adaptiveThreshold(
    gray,
    bin,
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    25,
    15
  );

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, bin);

  src.delete();
  gray.delete();
  bin.delete();

  return outputCanvas;
}

// ================================ //
function removeNoiseImage(canvas) {
  // Adaptive noise removal: bilateral filter + median blur + non-local means + morphological opening
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Bilateral filter
  const bilateral = new cv.Mat();
  cv.bilateralFilter(gray, bilateral, 9, 75, 75, cv.BORDER_DEFAULT);

  // Median blur
  const blurred = new cv.Mat();
  cv.medianBlur(bilateral, blurred, 3);

  // Non-local means denoising
  // const denoised = new cv.Mat();
  // cv.fastNlMeansDenoising(blurred, denoised, 30, 7, 21);

  // Morphological opening to remove small blobs
  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
  const morph = new cv.Mat();
  cv.morphologyEx(blurred, morph, cv.MORPH_OPEN, kernel);

  // Apply dilation to enhance text
  const dilateKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(2, 2)
  );
  const enhanced = new cv.Mat();
  cv.dilate(morph, enhanced, dilateKernel);

  // Show result
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, enhanced);

  // Clean up
  src.delete();
  gray.delete();
  bilateral.delete();
  blurred.delete();
  // denoised.delete();
  kernel.delete();
  morph.delete();

  return outputCanvas;
}

// ================================ //
// function closeBoxImage(canvas, ksize = 40) {
//   // Remove only boxes, preserve text
//   const src = cv.imread(canvas);
//   const gray = new cv.Mat();
//   cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//   // Binarize the image
//   const bin = new cv.Mat();
//   cv.adaptiveThreshold(
//     gray,
//     bin,
//     255,
//     cv.ADAPTIVE_THRESH_GAUSSIAN_C,
//     cv.THRESH_BINARY,
//     25,
//     15
//   );

//   // Morphological closing to connect box edges
//   const closeKernel = cv.getStructuringElement(
//     cv.MORPH_RECT,
//     new cv.Size(ksize, ksize / 4) // Use a rectangular kernel to avoid removing text
//   );
//   const closed = new cv.Mat();
//   cv.morphologyEx(bin, closed, cv.MORPH_CLOSE, closeKernel);

//   // Morphological opening to isolate boxes
//   const openKernel = cv.getStructuringElement(
//     cv.MORPH_RECT,
//     new cv.Size(ksize, ksize / 4)
//   );
//   const boxes = new cv.Mat();
//   cv.morphologyEx(closed, boxes, cv.MORPH_OPEN, openKernel);

//   // Invert boxes mask and remove boxes from binarized image
//   const maskInv = new cv.Mat();
//   cv.bitwise_not(boxes, maskInv);
//   const cleaned = new cv.Mat();
//   cv.bitwise_and(bin, maskInv, cleaned);

//   // Show result on a new canvas
//   const outputCanvas = document.createElement("canvas");
//   outputCanvas.width = canvas.width;
//   outputCanvas.height = canvas.height;
//   cv.imshow(outputCanvas, cleaned);

//   // Clean up
//   src.delete();
//   gray.delete();
//   bin.delete();
//   closeKernel.delete();
//   closed.delete();
//   openKernel.delete();
//   boxes.delete();
//   maskInv.delete();
//   cleaned.delete();

//   return outputCanvas;
// }

// ================================ //
// function removeBoxImage(canvas, ksize = 40) {
//   const src = cv.imread(canvas);
//   const gray = new cv.Mat();
//   cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//   // Binarize
//   const bin = new cv.Mat();
//   cv.adaptiveThreshold(
//     gray,
//     bin,
//     255,
//     cv.ADAPTIVE_THRESH_GAUSSIAN_C,
//     cv.THRESH_BINARY,
//     25,
//     15
//   );

//   // Closing to connect box edges
//   const closeKernel = cv.getStructuringElement(
//     cv.MORPH_RECT,
//     new cv.Size(ksize, ksize)
//   );
//   const closed = new cv.Mat();
//   cv.morphologyEx(bin, closed, cv.MORPH_CLOSE, closeKernel);

//   // Opening to isolate boxes
//   const openKernel = cv.getStructuringElement(
//     cv.MORPH_RECT,
//     new cv.Size(ksize, ksize)
//   );
//   const boxes = new cv.Mat();
//   cv.morphologyEx(closed, boxes, cv.MORPH_OPEN, openKernel);

//   // Invert and mask out boxes
//   const maskInv = new cv.Mat();
//   cv.bitwise_not(boxes, maskInv);
//   const cleaned = new cv.Mat();
//   cv.bitwise_and(bin, maskInv, cleaned);

//   // Show result
//   const outputCanvas = document.createElement("canvas");
//   outputCanvas.width = canvas.width;
//   outputCanvas.height = canvas.height;
//   cv.imshow(outputCanvas, cleaned);

//   // Clean up
//   src.delete();
//   gray.delete();
//   bin.delete();
//   closeKernel.delete();
//   closed.delete();
//   openKernel.delete();
//   boxes.delete();
//   maskInv.delete();
//   cleaned.delete();

//   return outputCanvas;
// }

// ================================ //
// function removeLineHImage(canvas, ksize = 15) {
//   // Improved horizontal line removal: operate on binarized image
//   const src = cv.imread(canvas);
//   const gray = new cv.Mat();
//   cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//   const bin = new cv.Mat();
//   cv.adaptiveThreshold(
//     gray,
//     bin,
//     255,
//     cv.ADAPTIVE_THRESH_GAUSSIAN_C,
//     cv.THRESH_BINARY,
//     25,
//     15
//   );

//   const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(ksize, 1));
//   const lines = new cv.Mat();
//   cv.morphologyEx(bin, lines, cv.MORPH_OPEN, kernel);

//   // Invert the lines mask
//   const maskInv = new cv.Mat();
//   cv.bitwise_not(lines, maskInv);

//   // Remove lines from binarized image
//   const cleaned = new cv.Mat();
//   cv.bitwise_and(bin, maskInv, cleaned);

//   const outputCanvas = document.createElement("canvas");
//   outputCanvas.width = canvas.width;
//   outputCanvas.height = canvas.height;
//   cv.imshow(outputCanvas, cleaned);

//   src.delete();
//   gray.delete();
//   bin.delete();
//   kernel.delete();
//   lines.delete();
//   maskInv.delete();
//   cleaned.delete();

//   return outputCanvas;
// }

// ================================ //
// function removeLineVImage(canvas, ksize = 40) {
//   // Improved vertical line removal: operate on binarized image
//   const src = cv.imread(canvas);
//   const gray = new cv.Mat();
//   cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//   const bin = new cv.Mat();
//   cv.adaptiveThreshold(
//     gray,
//     bin,
//     255,
//     cv.ADAPTIVE_THRESH_GAUSSIAN_C,
//     cv.THRESH_BINARY,
//     25,
//     15
//   );

//   const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(1, ksize));
//   const line = new cv.Mat();
//   cv.morphologyEx(bin, line, cv.MORPH_CLOSE, kernel);

//   const clean = new cv.Mat();
//   cv.subtract(line, bin, clean);

//   const imageRemoveLine = new cv.Mat();
//   cv.bitwise_not(clean, imageRemoveLine);

//   const outputCanvas = document.createElement("canvas");
//   outputCanvas.width = canvas.width;
//   outputCanvas.height = canvas.height;
//   cv.imshow(outputCanvas, imageRemoveLine);

//   src.delete();
//   gray.delete();
//   bin.delete();
//   kernel.delete();
//   line.delete();
//   clean.delete();
//   imageRemoveLine.delete();

//   return outputCanvas;
// }
