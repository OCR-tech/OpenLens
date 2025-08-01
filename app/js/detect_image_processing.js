// =========================================//
// Detect red boxes in an image using OpenCV.js
function detectRedBoxesInImage(canvas) {
  // canvas: HTMLCanvasElement containing the image
  if (!window.cv || !canvas) {
    console.error("OpenCV.js is not loaded or canvas is not provided.");
    return [];
  }

  // Read image from canvas
  const src = cv.imread(canvas);

  // Convert to HSV color space for better red detection
  const hsv = new cv.Mat();
  cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

  // Define lower and upper bounds for red in HSV
  const lowRed1 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 70, 50, 0]);
  const highRed1 = new cv.Mat(
    hsv.rows,
    hsv.cols,
    hsv.type(),
    [10, 255, 255, 255]
  );
  const lowRed2 = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [170, 70, 50, 0]);
  const highRed2 = new cv.Mat(
    hsv.rows,
    hsv.cols,
    hsv.type(),
    [180, 255, 255, 255]
  );

  // Threshold for red color (two ranges for HSV red)
  const mask1 = new cv.Mat();
  const mask2 = new cv.Mat();
  cv.inRange(hsv, lowRed1, highRed1, mask1);
  cv.inRange(hsv, lowRed2, highRed2, mask2);

  // Combine masks
  const mask = new cv.Mat();
  cv.add(mask1, mask2, mask);

  // Find contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    mask,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  // Get bounding boxes for each contour
  const boxes = [];
  for (let i = 0; i < contours.size(); ++i) {
    const cnt = contours.get(i);
    const rect = cv.boundingRect(cnt);
    // Optionally filter by size
    if (rect.width > 10 && rect.height > 10) {
      boxes.push({
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      });
    }
    cnt.delete();
  }

  // Cleanup
  src.delete();
  hsv.delete();
  lowRed1.delete();
  highRed1.delete();
  lowRed2.delete();
  highRed2.delete();
  mask1.delete();
  mask2.delete();
  mask.delete();
  contours.delete();
  hierarchy.delete();

  alert("Red boxes detected: " + boxes.length + " + " + JSON.stringify(boxes));
  return boxes; // Array of {left, top, width, height}
}
