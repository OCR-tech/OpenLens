let motionIntervalId = null;
let soundIntervalId = null;
let smokeIntervalId = null;
let fireIntervalId = null;
let floodIntervalId = null;
let lightIntervalId = null;
let rainIntervalId = null;
let fallingIntervalId = null;
let breakingIntervalId = null;

// =========================================//
function detectFrame(source) {
  alert("DetectFrame");

  if (!model || !source) return;

  // alert(
  //   model +
  //     " " +
  //     source +
  //     " " +
  //     source.width +
  //     "x" +
  //     source.height +
  //     " " +
  //     (source instanceof HTMLCanvasElement)
  // );

  model.detect(source).then(function (predictions) {
    //=========================================//
    // Object detection
    // alert("Object detection");

    //=========================================//
    // Draw predictions on the canvas
    // alert("Model loaded:" + model);
    // alert("Video playing:" + (!video.paused && !video.ended));
    // alert("Video size:" + video.videoWidth + "x" + video.videoHeight);
    // alert("Predictions:" + predictions);
    drawPredictions(predictions);

    // //=========================================//
    // // Motion detection
    // if (window.motionDetectionEnabled && !motionIntervalId) {
    //   motionIntervalId = setInterval(updateMotionDetection, 200); // every 200ms
    // } else if (!window.motionDetectionEnabled && motionIntervalId) {
    //   clearInterval(motionIntervalId);
    //   motionIntervalId = null;
    //   // document.getElementById("status").innerText = "Not detecting motion.";
    // }

    // //=========================================//
    // // Smoke detection
    // if (window.smokeDetectionEnabled && !smokeIntervalId) {
    //   smokeIntervalId = setInterval(updateSmokeDetection, 200); // every 200ms
    // } else if (!window.smokeDetectionEnabled && smokeIntervalId) {
    //   clearInterval(smokeIntervalId);
    //   smokeIntervalId = null;
    //   // document.getElementById("status").innerText = "Not detecting smoke.";
    // }

    // //=========================================//
    // // Fire detection
    // if (window.fireDetectionEnabled && !fireIntervalId) {
    //   fireIntervalId = setInterval(updateFireDetection, 200); // every 200ms
    // } else if (!window.fireDetectionEnabled && fireIntervalId) {
    //   clearInterval(fireIntervalId);
    //   fireIntervalId = null;
    //   document.getElementById("status").innerText = "Not detecting fire.";
    // }

    // //=========================================//
    // // Flood detection
    // if (window.floodDetectionEnabled && !floodIntervalId) {
    //   floodIntervalId = setInterval(updateFloodDetection, 200); // every 200ms
    // } else if (!window.floodDetectionEnabled && floodIntervalId) {
    //   clearInterval(floodIntervalId);
    //   floodIntervalId = null;
    //   document.getElementById("status").innerText = "Not detecting flood.";
    // }

    // //=========================================//
    // // Light detection
    // if (window.lightDetectionEnabled && !lightIntervalId) {
    //   lightIntervalId = setInterval(updateLightDetection, 200); // every 200ms
    // } else if (!window.lightDetectionEnabled && lightIntervalId) {
    //   clearInterval(lightIntervalId);
    //   lightIntervalId = null;
    //   document.getElementById("status").innerText = "Not detecting light.";
    // }

    // //=========================================//
    // // Rain detection
    // if (window.rainDetectionEnabled && !rainIntervalId) {
    //   rainIntervalId = setInterval(updateRainDetection, 200); // every 200ms
    // } else if (!window.rainDetectionEnabled && rainIntervalId) {
    //   clearInterval(rainIntervalId);
    //   rainIntervalId = null;
    //   document.getElementById("status").innerText = "Not detecting rain.";
    // }

    // //=========================================//
    // // Falling detection
    // if (window.fallingDetectionEnabled && !fallingIntervalId) {
    //   fallingIntervalId = setInterval(updateFallingDetection, 200); // every 200ms
    // } else if (!window.fallingDetectionEnabled && fallingIntervalId) {
    //   clearInterval(fallingIntervalId);
    //   fallingIntervalId = null;
    //   document.getElementById("status").innerText = "Not detecting falling.";
    // }

    // //=========================================//
    // // Breaking detection
    // if (window.breakingDetectionEnabled && !breakingIntervalId) {
    //   breakingIntervalId = setInterval(updateBreakingDetection, 200); // every 200ms
    // } else if (!window.breakingDetectionEnabled && breakingIntervalId) {
    //   clearInterval(breakingIntervalId);
    //   breakingIntervalId = null;
    //   document.getElementById("status").innerText = "Not detecting breaking.";
    // }

    // //=========================================//
    // // Sound detection
    // if (window.soundDetectionEnabled && !soundIntervalId) {
    //   soundIntervalId = setInterval(updateSoundDetection, 200); // every 200ms
    // } else if (!window.soundDetectionEnabled && soundIntervalId) {
    //   clearInterval(soundIntervalId);
    //   soundIntervalId = null;
    //   // document.getElementById("status").innerText = "Not detecting sound.";
    // }

    //=========================================//
    // Check if predictions are detected persons in frame
    // const detectedPersons = predictions.filter((p) => p.class === "person");
    // if (detectedPersons.length > 0) {
    //   // alert("Detected persons: " + detectedPersons.map((p) => p.id).join(", "));
    //   console.log(
    //     "Detected persons: " + detectedPersons.map((p) => p.id).join(", ")
    //   );
    // } else {
    //   // alert("No persons detected");
    // }

    //=========================================//
    // detectText(video);

    //=========================================//
    if (window.runDetectionLoop) {
      // Request the next animation frame
      window.animationId = requestAnimationFrame(() => detectFrame(source));
    }

    //=========================================//
  });
}

// =========================================//
// function detectFastFrame() {
//   // alert("DetectFastFrame");

//   if (!model || !video || video.paused || video.ended) {
//     return;
//   }
//   model.detect(video).then(function (predictions) {
//     // Object detection
//     const objectNames = predictions.map((p) => p.class).join(", ");

//     //==========================================//
//     // Record to JSON at every 1 second
//     // if (!window.lastRecordTime || Date.now() - window.lastRecordTime > 1000) {
//     //   recordToJSON(predictions);
//     //   window.lastRecordTime = Date.now();
//     // }

//     //=========================================//
//     // if (predictions && predictions.length > 0 && window.voiceAlertEnabled) {
//     //   setVoiceAlert("Object detected");
//     // } else {
//     //   if (window.voiceAlertEnabled) {
//     //     stopVoiceAlert();
//     //   }
//     // }

//     //=========================================//
//     // Email alert
//     if (predictions && predictions.length > 0 && window.emailAlertEnabled) {
//       // alert("sendEmailAlert: " + objectNames);
//       console.log("sendEmailAlert: " + objectNames);
//       // okEmailAlert();
//       // sendEmailAlert(objectNames);
//     }

//     //=========================================//
//     // Notification
//     if (predictions && predictions.length > 0 && window.notificationEnabled) {
//       // alert("Object detected: " + objectNames);
//       notifyDetection(objectNames);
//     }

//     //=========================================//
//     // Motion detection
//     if (window.motionDetectionEnabled) {
//       // alert("Motion detection enabled");
//       // setupMotionDetectionInterval();
//       // updateMotionDetection();
//       setInterval(updateMotionDetection, 200); // every 200ms
//     }

//     //=========================================//
//     // Sound detection
//     // if (window.soundDetectionEnabled) {
//     //   // alert("Sound detection enabled");
//     //   // Call the sound detection function
//     //   const soundSensitivity =
//     //     parseInt(localStorage.getItem("soundSensitivity")) || 30;
//     //   prevSamples = prevSamples || new Float32Array(0);
//     //   currSamples = currSamples || new Float32Array(0);
//     //   const soundLevel = detectSoundLevel(
//     //     prevSamples,
//     //     currSamples,
//     //     soundSensitivity
//     //   );

//     //   if (soundLevel) {
//     //     alert("Sound detected");
//     //     playVoiceAlert("Sound detected");
//     //   }
//     // }

//     //=========================================//
//     // Fire detection
//     // if (window.fireDetectionEnabled) {
//     //   // alert("Fire detection enabled");
//     //   // setupFireDetectionInterval();
//     //   // updateFireDetection();
//     //   setInterval(updateFireDetection, 200); // every 200ms
//     // }

//     //=========================================//

//     //=========================================//
//     // Draw predictions on the canvas
//     // alert("Model loaded:", model);
//     // alert("Video playing:", !video.paused && !video.ended);
//     // alert("Video size:", video.videoWidth, video.videoHeight);
//     // alert("Predictions:", predictions);
//     drawPredictions(predictions);

//     if (window.runDetectionLoop) {
//       // Request the next animation frame
//       window.animationId = requestAnimationFrame(detectFrame);
//     }

//     //=========================================//
//   });
// }

// =========================================//
function drawPredictions(predictions) {
  // alert("DrawPredictions");

  if (!ctx || !canvas) return;
  // Resize canvas if needed
  // (canvas size should already match the drawn image)
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
