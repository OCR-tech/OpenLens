// ================================ //
function detectImageProcessing(canvas) {
  // alert("DetectImageProcessing");
  // auto correct tilt image
  detectTiltImage(canvas);
}

// ================================ //
function detectTiltImage(canvas) {
  // Auto correct tilt image
  if (!window.cv || !canvas) return;

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Edge detection
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  // Hough line detection
  const lines = new cv.Mat();
  cv.HoughLines(edges, lines, 1, Math.PI / 180, 150);

  // Calculate average angle
  let angleSum = 0,
    count = 0;
  for (let i = 0; i < lines.rows; ++i) {
    const rho = lines.data32F[i * 2];
    const theta = lines.data32F[i * 2 + 1];
    // Only consider near-horizontal lines
    if (theta < Math.PI / 4 || theta > (3 * Math.PI) / 4) {
      const angle = (theta * 180) / Math.PI - 90;
      angleSum += angle;
      count++;
    }
  }
  const avgAngle = count ? angleSum / count : 0;

  // Rotate image to correct tilt
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
    cv.imshow(canvas, dst);
    dst.delete();
    rotMat.delete();
  } else {
    cv.imshow(canvas, src);
  }

  // Cleanup
  src.delete();
  gray.delete();
  edges.delete();
  lines.delete();
}
