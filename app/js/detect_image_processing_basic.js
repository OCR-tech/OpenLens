// ================================ //
function detectImageProcessing(canvas) {
  // alert("DetectImageProcessing");

  const canvas_deskewed = deskewImage(canvas);

  displayProcessedImage(canvas_deskewed);

  return canvas_deskewed;
}

// ================================ //
function deskewImage(canvas) {
  if (!window.cv || !canvas) return canvas;

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  const lines = new cv.Mat();
  cv.HoughLines(edges, lines, 1, Math.PI / 180, 150);

  let angles = [];
  for (let i = 0; i < lines.rows; ++i) {
    const theta = lines.data32F[i * 2 + 1];
    let angle = (theta * 180) / Math.PI - 90;
    if (angle > 90) angle -= 180;
    if (angle < -90) angle += 180;
    if (Math.abs(angle) <= 15) {
      angles.push(angle);
    }
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

  if (Math.abs(avgAngle) > 0.5) {
    const center = new cv.Point(src.cols / 2, src.rows / 2);
    const rotMat = cv.getRotationMatrix2D(center, avgAngle, 1);
    const dst = new cv.Mat();
    cv.warpAffine(
      src,
      dst,
      rotMat,
      new cv.Size(src.cols, src.rows),
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar()
    );
    cv.imshow(outputCanvas, dst);
    dst.delete();
    rotMat.delete();
  } else {
    cv.imshow(outputCanvas, src);
  }

  src.delete();
  gray.delete();
  edges.delete();
  lines.delete();

  // Wait for cv.imshow to finish rendering before returning
  return outputCanvas;
}

// ================================ //
function displayProcessedImage(canvas) {
  const targetCanvas = document.getElementById("main-canvas");
  if (!targetCanvas) return;

  const ctx = targetCanvas.getContext("2d");
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  // Draw the processed image at the left (0,0)
  ctx.drawImage(canvas, 0, 0);
}
