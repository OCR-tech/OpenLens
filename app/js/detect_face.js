function updateFaceDetection() {
  const status = document.getElementById("status");
  const videoElement = document.getElementById("video-file-player");
  const canvas = document.getElementById("overlay");

  // Set canvas size to match video
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext("2d");

  // Create the detector
  const detectorFaceConfig = {
    runtime: "mediapipe", // or "tfjs"
    modelType: "short", // or "full"
    maxFaces: 1,
  };

  // alert(JSON.stringify(detectorFaceConfig));

  faceDetection
    .createDetector(
      faceDetection.SupportedModels.MediaPipeFaceDetector,
      detectorFaceConfig
    )
    .then(function (detector) {
      status.innerText = "Face Detecting123";
      function detectFrame() {
        status.innerText = "Face Detecting";

        detector.estimateFaces(videoElement).then(function (faces) {
          status.innerText = "Face Detecting...";
          faces.forEach(function (face) {
            // Draw bounding box
            const box = face.box;
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(box.xMin, box.yMin, box.width, box.height);

            // Draw keypoints
            face.keypoints.forEach(function (kpt) {
              ctx.beginPath();
              ctx.arc(kpt.x, kpt.y, 3, 0, 2 * Math.PI);
              ctx.fillStyle = "red";
              ctx.fill();
            });
          });

          status.innerText = "Face detected";

          requestAnimationFrame(detectFrame);
        });
      }
      detectFrame();
    });
}
