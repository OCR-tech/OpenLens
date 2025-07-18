// =========================================//
function detectFrame() {
  // alert("DetectFrame");

  if (!model || !video || video.paused || video.ended) {
    return;
  }
  model.detect(video).then(function (predictions) {
    // Object detection

    //=========================================//
    // Motion detection
    if (window.motionDetectionEnabled) {
      // alert("Motion detection enabled");
      // setupMotionDetectionInterval();
      // updateMotionDetection();
      setInterval(updateMotionDetection, 200); // every 200ms
    }

    //=========================================//
    // Fire detection
    if (window.fireDetectionEnabled) {
      // alert("Fire detection enabled");
      // setupFireDetectionInterval();
      // updateFireDetection();
      setInterval(updateFireDetection, 200); // every 200ms
    }

    //=========================================//
    // Draw predictions on the canvas
    // alert("Model loaded:" + model);
    // alert("Video playing:" + (!video.paused && !video.ended));
    // alert("Video size:" + video.videoWidth + "x" + video.videoHeight);
    // alert("Predictions:" + predictions);
    drawPredictions(predictions);

    //=========================================//
    // detectText(video);

    //=========================================//
    if (window.runDetectionLoop) {
      // Request the next animation frame
      window.animationId = requestAnimationFrame(detectFrame);
    }

    //=========================================//
  });
}

// =========================================//
function detectFastFrame() {
  // alert("DetectFastFrame");

  if (!model || !video || video.paused || video.ended) {
    return;
  }
  model.detect(video).then(function (predictions) {
    // Object detection
    const objectNames = predictions.map((p) => p.class).join(", ");

    //==========================================//
    // Record to JSON at every 1 second
    // if (!window.lastRecordTime || Date.now() - window.lastRecordTime > 1000) {
    //   recordToJSON(predictions);
    //   window.lastRecordTime = Date.now();
    // }

    //=========================================//
    // if (predictions && predictions.length > 0 && window.voiceAlertEnabled) {
    //   setVoiceAlert("Object detected");
    // } else {
    //   if (window.voiceAlertEnabled) {
    //     stopVoiceAlert();
    //   }
    // }

    //=========================================//
    // Email alert
    if (predictions && predictions.length > 0 && window.emailAlertEnabled) {
      // alert("sendEmailAlert: " + objectNames);
      console.log("sendEmailAlert: " + objectNames);
      // okEmailAlert();
      // sendEmailAlert(objectNames);
    }

    //=========================================//
    // Notification
    if (predictions && predictions.length > 0 && window.notificationEnabled) {
      // alert("Object detected: " + objectNames);
      notifyDetection(objectNames);
    }

    //=========================================//
    // Motion detection
    if (window.motionDetectionEnabled) {
      // alert("Motion detection enabled");
      // setupMotionDetectionInterval();
      // updateMotionDetection();
      setInterval(updateMotionDetection, 200); // every 200ms
    }

    //=========================================//
    // Sound detection
    // if (window.soundDetectionEnabled) {
    //   // alert("Sound detection enabled");
    //   // Call the sound detection function
    //   const soundSensitivity =
    //     parseInt(localStorage.getItem("soundSensitivity")) || 30;
    //   prevSamples = prevSamples || new Float32Array(0);
    //   currSamples = currSamples || new Float32Array(0);
    //   const soundLevel = detectSoundLevel(
    //     prevSamples,
    //     currSamples,
    //     soundSensitivity
    //   );

    //   if (soundLevel) {
    //     alert("Sound detected");
    //     playVoiceAlert("Sound detected");
    //   }
    // }

    //=========================================//
    // Fire detection
    // if (window.fireDetectionEnabled) {
    //   // alert("Fire detection enabled");
    //   // setupFireDetectionInterval();
    //   // updateFireDetection();
    //   setInterval(updateFireDetection, 200); // every 200ms
    // }

    //=========================================//

    //=========================================//
    // Draw predictions on the canvas
    // alert("Model loaded:", model);
    // alert("Video playing:", !video.paused && !video.ended);
    // alert("Video size:", video.videoWidth, video.videoHeight);
    // alert("Predictions:", predictions);
    drawPredictions(predictions);

    if (window.runDetectionLoop) {
      // Request the next animation frame
      window.animationId = requestAnimationFrame(detectFrame);
    }

    //=========================================//
  });
}

// =========================================//
function drawPredictions(predictions) {
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

  if (window.showBoundingBox) {
    predictions.forEach(function (prediction) {
      // ===========================================//
      // Draw bounding box
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(...prediction.bbox);
      // Draw label background
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = 16;
      ctx.fillRect(
        prediction.bbox[0],
        prediction.bbox[1] - textHeight,
        textWidth + 10,
        textHeight
      );
      // Draw text
      ctx.fillStyle = "#222";
      ctx.font = "16px Arial";
      ctx.fillText(
        prediction.class,
        prediction.bbox[0] + 5,
        prediction.bbox[1] - 4
      );
    });
  }

  // ===========================================//
  // Draw date and time overlay
  if (window.showDateTimeOverlay) {
    displayDateTime();
  }

  // ===========================================//
  // Draw GPS location overlay if enabled
  if (
    window.showGPSLocationOverlay &&
    cachedGPS.latitude !== null &&
    cachedGPS.longitude !== null
  ) {
    displayGPSlocation(cachedGPS.latitude, cachedGPS.longitude);
  }

  // ===========================================//
  // Draw video size overlay
  if (window.showVideoSizeOverlay) {
    displayVideoSize();
  }

  // ===========================================//
  // Draw framerate overlay
  if (window.showFramerateOverlay) {
    displayFramerate();
  }
}
