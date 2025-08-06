// =========================================//
// Detect grade squares in an image using OpenCV.js
function detectGradeBoxes1(canvas) {
  // alert("detectGradeBoxes1");

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
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

  // Edge detection
  const edged = new cv.Mat();
  cv.Canny(blurred, edged, 50, 150);

  // Find contours
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    edged,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  const boxes = [];
  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const approx = new cv.Mat();
    cv.approxPolyDP(cnt, approx, 0.04 * cv.arcLength(cnt, true), true);

    // Look for quadrilaterals (squares/rectangles)
    if (
      approx.rows === 4 &&
      cv.contourArea(approx) > 100 &&
      cv.isContourConvex(approx)
    ) {
      // Get bounding rect
      const rect = cv.boundingRect(approx);
      // Check for near-square aspect ratio
      if (
        Math.abs(rect.width - rect.height) <
        Math.max(rect.width, rect.height) * 0.2
      ) {
        boxes.push({
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    approx.delete();
    cnt.delete();
  }

  // Cleanup
  src.delete();
  gray.delete();
  blurred.delete();
  edged.delete();
  contours.delete();
  hierarchy.delete();

  return boxes; // Array of {left, top, width, height}
}

// =========================================//
// Detect filled (dark) grade squares in an image using OpenCV.js
function detectFilledGradeBoxes1(canvas, threshold = 150) {
  alert("detectFilledGradeBoxes1");

  if (!window.cv || !canvas) {
    console.error("OpenCV.js is not loaded or canvas is not provided.");
    return [];
  }

  // First, detect all squares
  const squares = detectGradeBoxes1(canvas);

  // Read grayscale image from canvas
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // For each square, check if it's filled (average intensity below threshold)
  const filledSquares = [];
  squares.forEach((square) => {
    // Create a mask for the square
    const mask = new cv.Mat.zeros(gray.rows, gray.cols, cv.CV_8UC1);
    cv.rectangle(
      mask,
      new cv.Point(square.left, square.top),
      new cv.Point(square.left + square.width, square.top + square.height),
      new cv.Scalar(255, 255, 255, 255),
      -1
    );

    // Calculate mean intensity inside the square
    const mean = cv.mean(gray, mask)[0];

    // If mean intensity is below threshold, consider it filled
    if (mean < threshold) {
      filledSquares.push(square);
    }

    mask.delete();
  });

  src.delete();
  gray.delete();

  return filledSquares; // Array of filled squares (same format as detectGradeBoxes)
}

// =========================================//
function sortGradeBoxes1(boxes, filledBoxes) {
  alert("sortGradeBoxes1");

  const gradesInput = document.getElementById("grades-input");
  const gradesInput1 = document.getElementById("grades-input1");

  // ----------------------------------- //
  // Sort squares top-to-bottom, then left-to-right
  const sorted = boxes.slice().sort((a, b) => {
    // First by Y (row), then by X (column)
    if (Math.abs(a.top - b.top) > 10) {
      return a.top - b.top;
    }
    return a.left - b.left;
  });

  // ----------------------------------- //
  // Group by rows (tolerance for Y, e.g., 10 pixels)
  const rowTolerance = 10;
  let rows = [];
  sorted.forEach((square) => {
    let row = rows.find((r) => Math.abs(r[0].top - square.top) < rowTolerance);
    if (row) {
      row.push(square);
    } else {
      rows.push([square]);
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
    row.sort((a, b) => a.left - b.left);
    row.forEach((square, colIndex) => {
      output += `Question ${rowIndex + 1}, Choice ${
        colIndex + 1
      }: (${square.left.toFixed(1)}, ${square.top.toFixed(1)}) + \n`;
    });
  });
  gradesInput.innerText = output;
}

// =========================================//
function mapGradeBoxesToGrades1(boxes) {
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
function assignGradesToBoxes1(boxes) {
  // Sort the boxes first
  const sortedBoxes = sortGradeBoxes1(boxes);

  // Map sorted boxes to grades
  const gradedBoxes = mapGradeBoxesToGrades1(sortedBoxes);

  // Return the graded boxes
  return gradedBoxes;
}
// =========================================//
