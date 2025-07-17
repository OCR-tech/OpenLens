function detectText(videoElement) {
  // alert("detectText");

  // Ensure Tesseract.js is loaded
  if (typeof Tesseract === "undefined") {
    console.error(
      "Tesseract.js is not loaded. Please include the Tesseract.js library."
    );
    return;
  }

  // Check if the video element is valid
  if (!(videoElement instanceof HTMLVideoElement)) {
    console.error("Provided element is not a valid video element.");
    return;
  }

  // Create a canvas to draw the video frame
  const canvas = document.getElementById("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext("2d");

  // Draw the current frame of the video onto the canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Use Tesseract.js to recognize text from the canvas image
  Tesseract.recognize(canvas.toDataURL("image/png"), "eng")
    .then(({ data: { text } }) => {
      // console.log("Detected text:", text);
      // alert("Detected text: " + text);
      drawText(text);
      // Optionally, you can display the text on the page or process it further
    })
    .catch((error) => {
      console.error("Error during OCR:", error);
    });
}

// =========================================//
function drawText(text) {
  // alert("drawText: " + text);

  if (!ctx || !canvas || !video) return;
  // Resize canvas if needed
  if (
    canvas.width !== video.videoWidth ||
    canvas.height !== video.videoHeight
  ) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If text contains bounding box info, draw it. Otherwise, just draw the text.
  if (text && text.trim() !== "") {
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(text, 10, 30); // Draw text at position (10, 30)
    console.log("Text drawn on canvas:", text);
  } else {
    console.log("No text detected to draw.");
  }
}
