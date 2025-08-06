// =========================================//
// Detect grade circles in an image using OpenCV.js
function detectGradeBoxes(canvas) {
  // alert("detectGradeBoxes");

  if (!window.cv || !canvas) {
    console.error("OpenCV.js is not loaded or canvas is not provided.");
    return [];
  }

  // Read the image from the canvas
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Blur to reduce noise
  const blurred = new cv.Mat();
  cv.medianBlur(gray, blurred, 5);

  // Detect circles using HoughCircles
  const circles = new cv.Mat();
  cv.HoughCircles(
    blurred,
    circles,
    cv.HOUGH_GRADIENT,
    1, // dp (inverse ratio of accumulator resolution)
    20, // minDist (minimum distance between circle centers)
    100, // param1 (higher threshold for Canny edge detector)
    30, // param2 (threshold for center detection)
    15, // minRadius
    50 // maxRadius
  );

  // Collect detected circles
  const boxes = [];
  for (let i = 0; i < circles.cols; ++i) {
    const x = circles.data32F[i * 3];
    const y = circles.data32F[i * 3 + 1];
    const r = circles.data32F[i * 3 + 2];
    boxes.push({
      centerX: x,
      centerY: y,
      radius: r,
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
    });
  }

  // Cleanup
  src.delete();
  gray.delete();
  blurred.delete();
  circles.delete();

  return boxes; // Array of {centerX, centerY, radius, left, top, width, height}
}

// =========================================//
// Detect filled (dark) grade circles in an image using OpenCV.js
function detectFilledGradeBoxes(canvas, threshold = 80) {
  if (!window.cv || !canvas) {
    console.error("OpenCV.js is not loaded or canvas is not provided.");
    return [];
  }

  // First, detect all circles
  const circles = detectGradeBoxes(canvas);

  // Read grayscale image from canvas
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // For each circle, check if it's filled (average intensity below threshold)
  const filledCircles = [];
  circles.forEach((circle) => {
    // Create a mask for the circle
    const mask = new cv.Mat.zeros(gray.rows, gray.cols, cv.CV_8UC1);
    cv.circle(
      mask,
      new cv.Point(circle.centerX, circle.centerY),
      Math.round(circle.radius * 0.8), // slightly inside the edge
      new cv.Scalar(255, 255, 255, 255),
      -1
    );

    // Calculate mean intensity inside the circle
    const mean = cv.mean(gray, mask)[0];

    // If mean intensity is below threshold, consider it filled
    if (mean < threshold) {
      filledCircles.push(circle);
    }

    mask.delete();
  });

  src.delete();
  gray.delete();

  return filledCircles; // Array of filled circles (same format as detectGradeBoxes)
}
