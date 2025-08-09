let objectIntervalId = null;
let textIntervalId = null;
let gradeIntervalId = null;
let motionIntervalId = null;
let soundIntervalId = null;
let smokeIntervalId = null;
let fireIntervalId = null;
let floodIntervalId = null;
let lightIntervalId = null;
let rainIntervalId = null;
let fallingIntervalId = null;
let breakingIntervalId = null;
let timeInterval = 50; // 50ms

// =========================================//
function detectLoop() {
  // alert("detectLoop");

  const status = document.getElementById("status");
  const objDetectInput = document.getElementById("obj-detect-input");
  const objAlertInput = document.getElementById("obj-alert-input");
  const objectDropdown = document.getElementById("object-dropdown");

  if (!model || !video) return;

  // status.innerText = "detectLoop" + window.runDetectionLoop;

  // Check if loop is running
  if (!window.runDetectionLoop) {
    // alert("Stopping detection loop");
    if (window.animationId) {
      cancelAnimationFrame(window.animationId);
      window.animationId = null;
    }
    return;
  } else {
    // Detection loop is running
    // status.innerText = "Running Detecting...";
    drawOverlays();

    //=========================================//
    // Object detection
    if (window.objectDetectionEnabled) {
      model.detect(video).then(function (predictions) {
        // const objectNames = predictions.map((p) => p.class).join(", ");
        // alert("Model loaded:" + model + " " + video + " " + predictions + objectNames);

        objDetectInput.innerText =
          predictions.length > 0
            ? predictions
                .map((p) => `${p.class} (${Math.round(p.score * 100)}%)`)
                .join(" , ")
            : "Not Detected";

        //=========================================//
        // Lists of all detected objects
        const detectedObjects = predictions.map((p) => p.class);

        // if (detectedObjects.includes("person")) {
        //   objAlertInput.innerText = "Persons";
        // } else if (detectedObjects.includes("car")) {
        //   objAlertInput.innerText = "Cars";
        // } else if (detectedObjects.includes("chair")) {
        //   objAlertInput.innerText = "Chairs";
        // } else if (detectedObjects.includes("table")) {
        //   objAlertInput.innerText = "Tables";
        // } else if (detectedObjects.includes("couch")) {
        //   objAlertInput.innerText = "Couches";
        // } else if (detectedObjects.includes("tv")) {
        //   objAlertInput.innerText = "TVs";
        // } else if (detectedObjects.includes("vase")) {
        //   objAlertInput.innerText = "Vases";
        // } else if (detectedObjects.includes("bicycle")) {
        //   objAlertInput.innerText = "Bicycles";
        // } else {
        //   objAlertInput.innerText = "Not Alert";
        // }

        status.innerText = "123 " + predictions.map((p) => p.class).join(", ");

        //=========================================//
        // Filter predictions based on selected objects
        // const selectedObjects = getSelectedObjects();
        // alert("Selected Objects: " + selectedObjects);

        // convert selectedObjects value to objects value
        // const selectedObjects = Array.from(
        //   document.querySelectorAll(
        //     "#object-dropdown input[type='checkbox']:checked"
        //   )
        // ).map((object) => object.value);

        // objAlertInput.innerText =
        //   "Selected Objects: " + selectedObjects.join(", ");

        // const filteredPredictions = predictions.filter((p) =>
        //   selectedObjects.includes(p.class)
        // );

        // Display filtered detected objects
        // objAlertInput.innerText = selectedObjects;
        // objAlertInput.innerText =
        //   "Filtered Predictions: " + JSON.stringify(filteredPredictions);
        //=========================================//
        // Draw predictions on the canvas
        drawPredictions(predictions);
        // drawPredictions(filteredPredictions);
      });
    }
    //=========================================//
    // Text detection
    // if (window.redBoxesDetectionEnabled) {
    //   drawRedBoxes();
    //   // } else {
    //   //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // }

    if (window.textDetectionEnabled && !textIntervalId) {
      textIntervalId = setInterval(updateTextDetection, timeInterval);
    } else if (!window.textDetectionEnabled && textIntervalId) {
      clearInterval(textIntervalId);
      textIntervalId = null;
    }

    //=========================================//
    // Grade detection
    // if (window.gradeDetectionEnabled) {
    //   drawGradeBoxes();
    //   // } else {
    //   //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // }

    // if (window.gradeDetectionEnabled && !gradeIntervalId) {
    //   gradeIntervalId = setInterval(updateGradeDetection, timeInterval);
    // } else if (!window.gradeDetectionEnabled && gradeIntervalId) {
    //   clearInterval(gradeIntervalId);
    //   gradeIntervalId = null;
    // }

    //=========================================//
    // Motion detection
    if (window.motionDetectionEnabled && !motionIntervalId) {
      // alert("Motion detection enabled");
      motionIntervalId = setInterval(updateMotionDetection, timeInterval);
    } else if (!window.motionDetectionEnabled && motionIntervalId) {
      clearInterval(motionIntervalId);
      motionIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting motion.";
    }

    //=========================================//
    // Smoke detection
    if (window.smokeDetectionEnabled && !smokeIntervalId) {
      smokeIntervalId = setInterval(updateSmokeDetection, timeInterval);
    } else if (!window.smokeDetectionEnabled && smokeIntervalId) {
      clearInterval(smokeIntervalId);
      smokeIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting smoke.";
    }

    //=========================================//
    // Fire detection
    if (window.fireDetectionEnabled && !fireIntervalId) {
      fireIntervalId = setInterval(updateFireDetection, timeInterval);
    } else if (!window.fireDetectionEnabled && fireIntervalId) {
      clearInterval(fireIntervalId);
      fireIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting fire.";
    }

    //=========================================//
    // Flood detection
    if (window.floodDetectionEnabled && !floodIntervalId) {
      floodIntervalId = setInterval(updateFloodDetection, timeInterval);
    } else if (!window.floodDetectionEnabled && floodIntervalId) {
      clearInterval(floodIntervalId);
      floodIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting flood.";
    }

    //=========================================//
    // Light detection
    if (window.lightDetectionEnabled && !lightIntervalId) {
      lightIntervalId = setInterval(updateLightDetection, timeInterval);
    } else if (!window.lightDetectionEnabled && lightIntervalId) {
      clearInterval(lightIntervalId);
      lightIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting light.";
    }

    //=========================================//
    // Rain detection
    if (window.rainDetectionEnabled && !rainIntervalId) {
      rainIntervalId = setInterval(updateRainDetection, timeInterval);
    } else if (!window.rainDetectionEnabled && rainIntervalId) {
      clearInterval(rainIntervalId);
      rainIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting rain.";
    }

    //=========================================//
    // Falling detection
    if (window.fallingDetectionEnabled && !fallingIntervalId) {
      fallingIntervalId = setInterval(updateFallingDetection, timeInterval);
    } else if (!window.fallingDetectionEnabled && fallingIntervalId) {
      clearInterval(fallingIntervalId);
      fallingIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting falling.";
    }

    //=========================================//
    // Breaking detection
    if (window.breakingDetectionEnabled && !breakingIntervalId) {
      breakingIntervalId = setInterval(updateBreakingDetection, timeInterval);
    } else if (!window.breakingDetectionEnabled && breakingIntervalId) {
      clearInterval(breakingIntervalId);
      breakingIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting breaking.";
    }

    //=========================================//
    // Sound detection
    if (window.soundDetectionEnabled && !soundIntervalId) {
      soundIntervalId = setInterval(updateSoundDetection, timeInterval);
    } else if (!window.soundDetectionEnabled && soundIntervalId) {
      clearInterval(soundIntervalId);
      soundIntervalId = null;
      // document.getElementById("status").innerText = "Not detecting sound.";
    }

    // alert(window.motionDetectionEnabled + " " + window.soundDetectionEnabled);
    // if (
    //   !window.objectDetectionEnabled &&
    //   !window.textDetectionEnabled &&
    //   !window.motionDetectionEnabled &&
    //   !window.soundDetectionEnabled &&
    //   !window.smokeDetectionEnabled &&
    //   !window.fireDetectionEnabled &&
    //   !window.floodDetectionEnabled &&
    //   !window.lightDetectionEnabled &&
    //   !window.rainDetectionEnabled &&
    //   !window.fallingDetectionEnabled &&
    //   !window.breakingDetectionEnabled
    // ) {
    //   alert("Stopping detection loop");
    //   window.runDetectionLoop = false;
    //   if (window.animationId) {
    //     cancelAnimationFrame(window.animationId);
    //     window.animationId = null;
    //   }
    // }

    // drawOverlays();

    window.animationId = requestAnimationFrame(detectLoop);
  }
}

// =========================================//
function drawOverlays() {
  // alert("drawOverlays");

  if (!ctx || !canvas) return;

  // check if video is playing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw date and time overlay
  if (window.showDateTimeOverlay) {
    displayDateTime();
  }

  // Draw GPS location overlay if enabled
  if (
    window.showGPSLocationOverlay &&
    cachedGPS.latitude !== null &&
    cachedGPS.longitude !== null
  ) {
    displayGPSlocation(cachedGPS.latitude, cachedGPS.longitude);
  }

  // Draw video size overlay
  if (window.showVideoSizeOverlay) {
    displayVideoSize();
  }

  // Draw framerate overlay
  if (window.showFramerateOverlay) {
    displayFramerate();
  }
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
//       setInterval(updateMotionDetection, timeInterval);
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
//     //   setInterval(updateFireDetection, timeInterval);
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

//=========================================//
function drawPredictions(predictions) {
  // alert("DrawPredictions");

  // const status = document.getElementById("status");
  // const objAlertInput = document.getElementById("obj-alert-input");

  if (!ctx || !canvas) return;

  // alert("Predictions: " + JSON.stringify(predictions));

  // status.innerText =
  //   predictions.length > 0
  //     ? predictions
  //         .map((p) => `Detected: ${p.class} (${Math.round(p.score * 100)}%)`)
  //         .join(", ")
  //     : "Detecting...";

  // ===========================================//
  if (window.showBoundingBox) {
    predictions.forEach(function (prediction) {
      // alert("Prediction: " + JSON.stringify(prediction));

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
}
