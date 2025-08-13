// ================================ //
function detectImageProcessing(canvas) {
  const status = document.getElementById("status");
  status.innerText = "Processing Image...";

  // processedCanvas = canvas;
  processedCanvas_res = resizeImage(canvas, 500);
  processedCanvas_bin = binarizeImage(processedCanvas_res);
  // processedCanvas = thresholdImage(processedCanvas_res, processedCanvas_bin);
  // processedCanvas = deskewImage(processedCanvas);
  // processedCanvas = removeLineHImage(processedCanvas); // Larger kernel for better line removal
  // processedCanvas = removeLineVImage(processedCanvas); // Larger kernel for better line removal

  // ---------------------------  //
  // processedCanvas = cropROIImage(processedCanvas);
  // processedCanvas = removeBlobImage(processedCanvas, 100); // Remove small blobs
  // processedCanvas = removeBoxImage(processedCanvas, 30); // Remove boxes
  // processedCanvas = removeNoiseImage(processedCanvas);
  // processedCanvas = despeckleImage(processedCanvas);
  // processedCanvas = removeTableImage(processedCanvas);

  processedCanvas = processedCanvas_bin;

  return processedCanvas;
}

// ================================ //
function resizeImage(canvas, maxWidth) {
  // Resize the image to a maximum width while maintaining aspect ratio
  const src = cv.imread(canvas);
  const aspectRatio = src.rows / src.cols;
  const newWidth = maxWidth;
  const newHeight = Math.round(newWidth * aspectRatio);

  const resized = new cv.Mat();
  cv.resize(
    src,
    resized,
    new cv.Size(newWidth, newHeight),
    0,
    0,
    cv.INTER_AREA
  );

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = newWidth;
  outputCanvas.height = newHeight;
  cv.imshow(outputCanvas, resized);

  src.delete();
  resized.delete();

  return outputCanvas;
}

// ================================ //
function binarizeImage(canvas) {
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const bin = new cv.Mat();
  cv.adaptiveThreshold(
    gray,
    bin,
    255,
    cv.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv.THRESH_BINARY,
    35, // 25
    35 // 15
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
function thresholdImage(canvas, canvas_proc) {
  const src = cv.imread(canvas);
  const src_proc = cv.imread(canvas_proc);

  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const gray_proc = new cv.Mat();
  cv.cvtColor(src_proc, gray_proc, cv.COLOR_RGBA2GRAY);

  const bw = new cv.Mat();
  cv.threshold(gray, bw, 50, 255, cv.THRESH_BINARY);

  const maskInv = new cv.Mat();
  cv.bitwise_not(bw, maskInv);

  const cleaned = new cv.Mat();
  cv.bitwise_or(gray_proc, maskInv, cleaned);

  // Show result
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, cleaned);

  // Clean up
  src.delete();
  src_proc.delete();
  gray.delete();
  gray;
  bw.delete();
  maskInv.delete();
  cleaned.delete();

  return outputCanvas;
}

// ================================ //
// function cropROIImage(canvas) {
//   // Crop the main content area, removing document layout spaces (margins/borders)
//   const src = cv.imread(canvas);
//   const gray = new cv.Mat();
//   cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//   // Binarize and invert: text/content becomes white, background black
//   const bin = new cv.Mat();
//   cv.adaptiveThreshold(
//     gray,
//     bin,
//     255,
//     cv.ADAPTIVE_THRESH_GAUSSIAN_C,
//     cv.THRESH_BINARY_INV,
//     25,
//     15
//   );

//   // Morphological closing to fill small gaps in content
//   const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(15, 15));
//   const closed = new cv.Mat();
//   cv.morphologyEx(bin, closed, cv.MORPH_CLOSE, kernel);

//   // Find contours
//   const contours = new cv.MatVector();
//   const hierarchy = new cv.Mat();
//   cv.findContours(
//     closed,
//     contours,
//     hierarchy,
//     cv.RETR_EXTERNAL,
//     cv.CHAIN_APPROX_SIMPLE
//   );

//   // Find the largest contour (assumed to be the main content)
//   let maxArea = 0,
//     maxContour = null;
//   for (let i = 0; i < contours.size(); i++) {
//     const cnt = contours.get(i);
//     const area = cv.contourArea(cnt);
//     if (area > maxArea) {
//       maxArea = area;
//       maxContour = cnt;
//     }
//   }

//   let outputCanvas = canvas;
//   if (maxContour && maxArea > 0) {
//     const rect = cv.boundingRect(maxContour);
//     const cropped = src.roi(rect);
//     outputCanvas = document.createElement("canvas");
//     outputCanvas.width = rect.width;
//     outputCanvas.height = rect.height;
//     cv.imshow(outputCanvas, cropped);
//     cropped.delete();
//   }

//   // Clean up
//   src.delete();
//   gray.delete();
//   bin.delete();
//   kernel.delete();
//   closed.delete();
//   contours.delete();
//   hierarchy.delete();

//   return outputCanvas;
// }

// ================================ //
function deskewImage(canvas) {
  // Improved deskew: use adaptive threshold and more robust angle filtering
  const src = cv.imread(canvas);

  const edges = new cv.Mat();
  cv.Canny(src, edges, 50, 150);

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
  edges.delete();
  lines.delete();

  return outputCanvas;
}

// ================================ //
function removeNoiseImage(canvas) {
  const src = cv.imread(canvas);

  // Convert to grayscale
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

  // Apply erosion to reduce noise
  const erodeKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(2, 2)
  );
  const enhanced_erode = new cv.Mat();
  cv.erode(morph, enhanced_erode, erodeKernel);

  // Apply dilation to enhance text
  const dilateKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(2, 2)
  );
  const enhanced_dilate = new cv.Mat();
  cv.dilate(morph, enhanced_dilate, dilateKernel);

  // Show result
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, enhanced_dilate);

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
function removeBlobImage(canvas, minArea = 100) {
  // Remove small blobs/noise from the image using contour filtering
  const src = cv.imread(canvas);

  // Find contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    src,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  // Create mask for large contours only
  const mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const area = cv.contourArea(cnt);
    if (area > minArea) {
      cv.drawContours(
        mask,
        contours,
        i,
        new cv.Scalar(255, 255, 255),
        -1,
        cv.LINE_8,
        hierarchy,
        0
      );
    }
    cnt.delete();
  }

  // Apply mask to original image
  const result = new cv.Mat();
  cv.bitwise_and(src, mask, result);

  // Show result
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, result);

  // Clean up
  src.delete();
  contours.delete();
  hierarchy.delete();
  mask.delete();
  result.delete();

  return outputCanvas;
}

// ================================ //
// function removeBoxImage(canvas, ksize = 30) {
//   const src = cv.imread(canvas);

//   // Use morphological operations to isolate boxes
//   const kernel = cv.getStructuringElement(
//     cv.MORPH_RECT,
//     new cv.Size(ksize, ksize)
//   );
//   const closed = new cv.Mat();
//   cv.morphologyEx(src, closed, cv.MORPH_CLOSE, kernel);
//   const opened = new cv.Mat();
//   cv.morphologyEx(closed, opened, cv.MORPH_OPEN, kernel);
//   // Find contours
//   const contours = new cv.Mat();
//   const hierarchy = new cv.Mat();
//   cv.findContours(
//     opened,
//     contours,
//     hierarchy,
//     cv.RETR_EXTERNAL,
//     cv.CHAIN_APPROX_SIMPLE
//   );
//   // Create mask for boxes
//   const mask = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC1);
//   cv.drawContours(mask, contours, -1, new cv.Scalar(255), cv.FILLED);

//   const outputCanvas = document.createElement("canvas");
//   outputCanvas.width = canvas.width;
//   outputCanvas.height = canvas.height;
//   cv.imshow(outputCanvas, mask);

//   // Clean up
//   src.delete();
//   kernel.delete();
//   closed.delete();
//   opened.delete();
//   contours.delete();
//   hierarchy.delete();
//   mask.delete();

//   return outputCanvas;
// }

// ================================ //
function removeLineHImage(canvas, ksize = 150) {
  // Robust horizontal line removal: binarize, then mask lines out
  const src = cv.imread(canvas);

  // Use closing to connect broken lines, then opening to isolate them
  const closeKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(ksize, 1)
  );
  const closed = new cv.Mat();
  cv.morphologyEx(src, closed, cv.MORPH_CLOSE, closeKernel);

  const openKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(ksize, 1)
  );
  const lines = new cv.Mat();
  cv.morphologyEx(closed, lines, cv.MORPH_OPEN, openKernel);

  const maskInv = new cv.Mat();
  cv.bitwise_not(lines, maskInv);

  const cleaned = new cv.Mat();
  cv.bitwise_or(src, maskInv, cleaned);

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, cleaned);

  src.delete();
  closeKernel.delete();
  closed.delete();
  openKernel.delete();
  lines.delete();
  maskInv.delete();
  cleaned.delete();

  return outputCanvas;
}

// ================================ //
function removeLineVImage(canvas, ksize = 150) {
  // Robust vertical line removal: binarize, then mask lines out
  const src = cv.imread(canvas);

  // Use closing to connect broken lines, then opening to isolate them
  const closeKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(1, ksize)
  );
  const closed = new cv.Mat();
  cv.morphologyEx(src, closed, cv.MORPH_CLOSE, closeKernel);

  const openKernel = cv.getStructuringElement(
    cv.MORPH_RECT,
    new cv.Size(1, ksize)
  );
  const lines = new cv.Mat();
  cv.morphologyEx(closed, lines, cv.MORPH_OPEN, openKernel);

  const maskInv = new cv.Mat();
  cv.bitwise_not(lines, maskInv);

  const cleaned = new cv.Mat();
  cv.bitwise_or(src, maskInv, cleaned);

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, cleaned);

  src.delete();
  closeKernel.delete();
  closed.delete();
  openKernel.delete();
  lines.delete();
  maskInv.delete();
  cleaned.delete();

  return outputCanvas;
}
