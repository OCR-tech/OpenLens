// ================================ //
function detectImageProcessing(canvas) {
  // processedCanvas = canvas;

  processedCanvas = binarizeImage(canvas);
  processedCanvas = deskewImage(processedCanvas);
  processedCanvas = removeNoiseImage(processedCanvas);
  processedCanvas = removeLineHImage(processedCanvas); // Larger kernel for better line removal
  processedCanvas = removeLineVImage(processedCanvas); // Larger kernel for better line removal
  // processedCanvas = removeBlobImage(processedCanvas);

  // processedCanvas = removeWatermarkImage(processedCanvas);
  // processedCanvas = removeBoxImage(processedCanvas);

  // ---------------------------  //
  // processedCanvas = removeLineImage(processedCanvas);
  // processedCanvas = cropROIImage(processedCanvas);

  // processedCanvas = removeTableImage(processedCanvas);

  return processedCanvas;
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
// function cropROIImage(canvas) {
//   // Automatically crop the largest contour (ROI) from the image
//   const src = cv.imread(canvas);
//   const gray = new cv.Mat();
//   cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//   // Binarize for contour detection
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

//   // Find contours
//   const contours = new cv.MatVector();
//   const hierarchy = new cv.Mat();
//   cv.findContours(
//     bin,
//     contours,
//     hierarchy,
//     cv.RETR_EXTERNAL,
//     cv.CHAIN_APPROX_SIMPLE
//   );

//   // Find the largest contour
//   let maxArea = 0;
//   let maxContour = null;
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
//     // Get bounding rect and crop
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

// ================================ //
function removeWatermarkImage(canvas) {
  // Remove watermark using iterative morphological operations (Python port)
  let src = cv.imread(canvas);
  let bg = src.clone();

  // Iteratively apply closing and opening with increasing elliptical kernels
  for (let i = 0; i < 5; i++) {
    let ksize = 2 * i + 1;
    let kernel = cv.getStructuringElement(
      cv.MORPH_ELLIPSE,
      new cv.Size(ksize, ksize)
    );
    cv.morphologyEx(bg, bg, cv.MORPH_CLOSE, kernel);
    cv.morphologyEx(bg, bg, cv.MORPH_OPEN, kernel);
    kernel.delete();
  }

  // Compute difference
  let dif = new cv.Mat();
  cv.subtract(bg, src, dif);

  // Threshold difference (binary inverse + OTSU)
  let bw = new cv.Mat();
  cv.threshold(dif, bw, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

  // Threshold background (binary inverse + OTSU)
  let dark = new cv.Mat();
  cv.threshold(bg, dark, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

  // Try to restore dark pixels (not a direct port, but similar effect)
  let result = new cv.Mat();
  try {
    // Where dark > 0, set bw to 0 (remove watermark in dark regions)
    let mask = new cv.Mat();
    cv.compare(
      dark,
      new cv.Mat(dark.rows, dark.cols, dark.type(), [0, 0, 0, 0]),
      mask,
      cv.CMP_GT
    );
    bw.setTo(new cv.Scalar(0, 0, 0, 0), mask);
    mask.delete();
    result = bw.clone();
  } catch (e) {
    result = bg.clone();
  }

  // Show result
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  cv.imshow(outputCanvas, result);

  // Clean up
  src.delete();
  bg.delete();
  dif.delete();
  bw.delete();
  dark.delete();
  result.delete();

  return outputCanvas;
}
