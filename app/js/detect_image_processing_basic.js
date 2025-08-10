// ================================ //
function detectImageProcessing(canvas) {
  // const processedCanvas = deskewImage(canvas);
  deskewImage(canvas);

  processedCanvas = canvas;
  return processedCanvas;
}

// ================================ //
function deskewImage(canvas) {
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  const lines = new cv.Mat();
  cv.HoughLines(edges, lines, 1, Math.PI / 180, 150);

  let angleSum = 0;
  let count = 0;
  for (let i = 0; i < lines.rows; i++) {
    const theta = lines.data32F[i * 2 + 1];
    const angle = (theta * 180) / Math.PI - 90; // Convert to degrees and adjust
    if (Math.abs(angle) < 45) {
      // Filter out angles that are too steep
      angleSum += angle;
      count++;
    }
  }
  const avgAngle = count > 0 ? angleSum / count : 0;

  // alert("Image " + avgAngle.toFixed(2));
  document.getElementById("status").innerText = "Image " + avgAngle.toFixed(2);

  if (Math.abs(avgAngle) > 0.1) {
    const center = new cv.Point(src.cols / 2, src.rows / 2);
    const rotationMatrix = cv.getRotationMatrix2D(center, avgAngle, 1);
    const rotated = new cv.Mat();
    cv.warpAffine(
      src,
      rotated,
      rotationMatrix,
      src.size(),
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar()
    );

    // Update the canvas with the rotated image
    cv.imshow(canvas, rotated);

    // Clean up
    src.delete();
    gray.delete();
    edges.delete();
    lines.delete();
    rotated.delete();
  } else {
    // No significant skew detected
    cv.imshow(canvas, src);
  }
}
