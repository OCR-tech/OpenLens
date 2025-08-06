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
function detectFilledGradeBoxes(canvas, threshold = 150) {
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

// =========================================//
function sortGradeBoxes(boxes, filledBoxes) {
  // alert("sortGradeBoxes");

  const gradesInput = document.getElementById("grades-input");
  const gradesInput1 = document.getElementById("grades-input1");

  // ----------------------------------- //
  // Sort circles top-to-bottom, then left-to-right
  const sorted = boxes.slice().sort((a, b) => {
    // First by Y (row), then by X (column)
    if (Math.abs(a.centerY - b.centerY) > 10) {
      return a.centerY - b.centerY;
    }
    return a.centerX - b.centerX;
  });

  // ----------------------------------- //
  // Group by rows (tolerance for Y, e.g., 10 pixels)
  const rowTolerance = 10;
  let rows = [];
  sorted.forEach((circle) => {
    let row = rows.find(
      (r) => Math.abs(r[0].centerY - circle.centerY) < rowTolerance
    );
    if (row) {
      row.push(circle);
    } else {
      rows.push([circle]);
    }
  });

  // ----------------------------------- //
  // get the box of the first rows and the first columns
  const firstBoxes = rows.map((row) => row[0]);
  const lastBoxes = rows.map((row) => row[row.length - 1]);

  gradesInput1.innerText = `"firstBoxes: ${JSON.stringify(firstBoxes[0])}" +
  "lastBoxes: ${JSON.stringify(lastBoxes[lastBoxes.length - 1])}"`;

  // ----------------------------------- //
  // Append all detected positions to the gradesInput element
  let output = "";
  rows.forEach((row, rowIndex) => {
    row.sort((a, b) => a.centerX - b.centerX);
    row.forEach((circle, colIndex) => {
      output += `Question ${rowIndex + 1}, Choice ${
        colIndex + 1
      }: (${circle.centerX.toFixed(1)}, ${circle.centerY.toFixed(1)}) + \n`;
    });
  });
  gradesInput.innerText = output;
}

// =========================================//
function mapGradeBoxesToGrades(boxes) {
  // Map each box to a grade (A, B, C, D, F)
  const grades = ["A", "B", "C", "D", "F"];
  return boxes.map((box, index) => {
    return {
      ...box,
      grade: grades[index % grades.length], // Cycle through grades
    };
  });
}

// =========================================//
function assignGradesToBoxes(boxes) {
  // Sort the boxes first
  const sortedBoxes = sortGradeBoxes(boxes);

  // Map sorted boxes to grades
  const gradedBoxes = mapGradeBoxesToGrades(sortedBoxes);

  // Return the graded boxes
  return gradedBoxes;
}
// =========================================//
