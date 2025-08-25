function updatePoseDetection() {
  // alert("Updating pose detection");

  const status = document.getElementById("status");
  const videoElement = document.getElementById("video-file-player");
  const canvas = document.getElementById("overlay");
  const ctx = canvas.getContext("2d");

  const detectorPoseConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  };

  poseDetection
    .createDetector(poseDetection.SupportedModels.MoveNet, detectorPoseConfig)
    .then(function (detector) {
      function detectFrame() {
        detector.estimatePoses(videoElement).then(function (poses) {
          poses.forEach(function (pose) {
            if (pose.keypoints && pose.keypoints.length > 0) {
              pose.keypoints.forEach(function (kpt) {
                if (kpt.score > 0.5) {
                  ctx.beginPath();
                  ctx.arc(kpt.x, kpt.y, 5, 0, 2 * Math.PI);
                  ctx.fillStyle = "red";
                  ctx.fill();
                }
              });
            }
          });
          status.innerText = "Pose detected";
          requestAnimationFrame(detectFrame);
        });
      }
      detectFrame();
    });
}
