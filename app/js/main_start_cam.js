// =========================================//
function startIntegratedCamera() {
  // alert("StartingIntegratedCamera");

  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );
      let integratedCamera = videoInputs.find(
        (device) =>
          device.label.toLowerCase().includes("integrated") ||
          device.label.toLowerCase().includes("built-in")
      );
      // Fallback: use the first camera if no label matches
      if (!integratedCamera && videoInputs.length > 0) {
        integratedCamera = videoInputs[0];
      }
      if (!integratedCamera) {
        document.getElementById("status").innerText =
          "No integrated camera found.";
        return;
      }
      // Start the camera using the deviceId
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: { exact: integratedCamera.deviceId } },
          audio: false,
        })
        .then(function (mediaStream) {
          if (video) {
            video.pause();
            video.srcObject = null;
            video.remove();
            video = null;
          }
          if (canvas) {
            canvas.remove();
            canvas = null;
          }
          video = document.createElement("video");
          video.id = "camera-stream";
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "contain";
          canvas = document.createElement("canvas");
          canvas.id = "overlay";
          canvas.style.position = "absolute";
          canvas.style.top = "0";
          canvas.style.left = "0";
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.pointerEvents = "none";
          const videoFeed = document.getElementById("video-feed");
          videoFeed.innerHTML = "";
          videoFeed.appendChild(video);
          videoFeed.appendChild(canvas);
          const placeholder = document.getElementById("video-placeholder");
          if (placeholder) placeholder.style.display = "none";
          stream = mediaStream;
          video.srcObject = mediaStream;
          video.onloadedmetadata = function () {
            video.play();
            video.addEventListener("playing", function onPlay() {
              video.removeEventListener("playing", onPlay);
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx = canvas.getContext("2d");
              document.getElementById("status").innerText = "Detecting...";
              document.getElementById("btn-start").style.display = "none";
              document.getElementById("btn-stop").style.display =
                "inline-block";
              detectFrame(canvas);
            });
          };
        })
        .catch(function (err) {
          document.getElementById("status").innerText =
            "Unable to access integrated camera: " + err.message;
        });
    })
    .catch(function (err) {
      document.getElementById("status").innerText =
        "Error enumerating devices: " + err.message;
    });
}

// =========================================//
function startUSBCamera() {
  // alert("StartingUSBCamera");

  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );
      let integratedCamera = videoInputs.find(
        (device) =>
          device.label.toLowerCase().includes("integrated") ||
          device.label.toLowerCase().includes("built-in")
      );
      // Try to find a USB or external camera by label
      let usbCamera = videoInputs.find(
        (device) =>
          device.label.toLowerCase().includes("usb") ||
          device.label.toLowerCase().includes("external")
      );
      // Fallback: use the second camera if available (often USB)
      if (!usbCamera && videoInputs.length > 1) {
        usbCamera = videoInputs[1];
      }
      // If still not found, use the first camera
      if (!usbCamera && videoInputs.length > 0) {
        usbCamera = videoInputs[0];
      }
      // Start the camera using the deviceId
      if (!usbCamera) {
        document.getElementById("status").innerText = "No USB camera found.";
        return;
      }
      // Start the camera using the deviceId
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: { exact: usbCamera.deviceId } },
          audio: false,
        })
        .then(function (mediaStream) {
          if (video) {
            video.pause();
            video.srcObject = null;
            video.remove();
            video = null;
          }
          if (canvas) {
            canvas.remove();
            canvas = null;
          }
          video = document.createElement("video");
          video.id = "usb-camera-stream";
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          video.style.width = "100%";
          video.style.height = "100%";
          video.style.objectFit = "contain";
          canvas = document.createElement("canvas");
          canvas.id = "overlay";
          canvas.style.position = "absolute";
          canvas.style.top = "0";
          canvas.style.left = "0";
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          canvas.style.pointerEvents = "none";
          const videoFeed = document.getElementById("video-feed");
          videoFeed.innerHTML = "";
          videoFeed.appendChild(video);
          videoFeed.appendChild(canvas);
          const placeholder = document.getElementById("video-placeholder");
          if (placeholder) placeholder.style.display = "none";
          stream = mediaStream;
          video.srcObject = mediaStream;
          video.onloadedmetadata = function () {
            video.play();
            document.getElementById("status").innerText = "Detecting...";
            video.addEventListener("playing", function onPlay() {
              video.removeEventListener("playing", onPlay);
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx = canvas.getContext("2d");
              document.getElementById("status").innerText = "Detecting...";
              document.getElementById("btn-start").style.display = "none";
              document.getElementById("btn-stop").style.display =
                "inline-block";
              detectFrame(canvas);
            });
          };
        })
        .catch(function (err) {
          document.getElementById("status").innerText =
            "Unable to access USB camera: " + err.message;
        });
    })
    .catch(function (err) {
      document.getElementById("status").innerText =
        "Error enumerating devices: " + err.message;
    });
}

// =========================================//
// Using /shot.jpg Fallback
// function startIPCamera0() {
//   document.getElementById("status").innerText = "Starting IP Camera...";
//   let baseUrl = "http://192.168.245.139:5500";
//   const shotUrl = baseUrl + "/shot.jpg";

//   if (video) {
//     video.pause();
//     if (video.srcObject) {
//       video.srcObject.getTracks().forEach((track) => track.stop());
//     }
//     video.remove();
//     video = null;
//   }
//   if (canvas) {
//     canvas.remove();
//     canvas = null;
//   }

//   canvas = document.createElement("canvas");
//   canvas.id = "overlay";
//   canvas.style.position = "absolute";
//   canvas.style.top = "0";
//   canvas.style.left = "0";
//   canvas.style.width = "100%";
//   canvas.style.height = "100%";
//   canvas.style.pointerEvents = "none";
//   const videoFeed = document.getElementById("video-feed");
//   videoFeed.innerHTML = "";
//   videoFeed.appendChild(canvas);
//   ctx = canvas.getContext("2d");

//   const placeholder = document.getElementById("video-placeholder");
//   if (placeholder) placeholder.style.display = "none";

//   function fetchAndDetect() {
//     const img = new window.Image();
//     img.crossOrigin = "Anonymous";
//     img.onload = function () {
//       if (canvas.width !== img.width || canvas.height !== img.height) {
//         canvas.width = img.width;
//         canvas.height = img.height;
//       }
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       if (model) {
//         model.detect(canvas).then(function (predictions) {
//           drawPredictions(predictions);
//           document.getElementById("status").innerText = "Detecting...";
//           animationId = requestAnimationFrame(fetchAndDetect);
//         });
//       } else {
//         animationId = requestAnimationFrame(fetchAndDetect);
//       }
//     };
//     img.onerror = function () {
//       document.getElementById("status").innerText =
//         "Error loading IP camera frame. Check the URL and network.";
//       setTimeout(fetchAndDetect, 1000);
//     };
//     img.src = shotUrl + "?t=" + Date.now();
//   }

//   fetchAndDetect();
//   document.getElementById("btn-start").style.display = "none";
//   document.getElementById("btn-stop").style.display = "inline-block";
// }

// =========================================//
// function startIPCamera1(ipCameraUrl) {
//   // alert("StartingIPCamera");

//   // function startIPCamera(ipCameraUrl) {
//   document.getElementById("status").innerText = "Starting IP Camera...";

//   // Get the base URL from the input field
//   // const ipCameraUrl = document.getElementById("ip-camera-url").value;

//   // let baseUrl = "192.168.233.61:8080";
//   // let baseUrl = "http://192.168.233.61:8080";
//   // const shotUrl = baseUrl;
//   // const shotUrl = baseUrl + "/video";
//   const shotUrl = "http://" + ipCameraUrl + "/shot.jpg";

//   canvas = document.createElement("canvas");
//   canvas.id = "overlay";
//   canvas.style.position = "absolute";
//   canvas.style.top = "0";
//   canvas.style.left = "0";
//   canvas.style.width = "100%";
//   canvas.style.height = "100%";
//   canvas.style.pointerEvents = "none";
//   const videoFeed = document.getElementById("video-feed");
//   videoFeed.innerHTML = "";
//   videoFeed.appendChild(canvas);
//   ctx = canvas.getContext("2d");

//   const placeholder = document.getElementById("video-placeholder");
//   if (placeholder) placeholder.style.display = "none";

//   function fetchAndDetect() {
//     const img = new window.Image();
//     img.crossOrigin = "Anonymous";
//     img.onload = function () {
//       if (canvas.width !== img.width || canvas.height !== img.height) {
//         canvas.width = img.width;
//         canvas.height = img.height;
//       }
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       if (model) {
//         model.detect(canvas).then(function (predictions) {
//           drawPredictions(predictions);
//           document.getElementById("status").innerText = "Detecting...";
//           animationId = requestAnimationFrame(fetchAndDetect);
//         });
//       } else {
//         animationId = requestAnimationFrame(fetchAndDetect);
//       }
//     };
//     img.onerror = function () {
//       document.getElementById("status").innerText =
//         "Error loading IP camera frame. Check the URL and network.";
//       setTimeout(fetchAndDetect, 1000);
//     };
//     img.src = shotUrl + "?t=" + Date.now();
//   }

//   fetchAndDetect();
//   document.getElementById("btn-start").style.display = "none";
//   document.getElementById("btn-stop").style.display = "inline-block";
// }

// =========================================//
// function startIPCamera2(ipCameraUrl) {
//   const videoFeed = document.getElementById("video-feed");
//   const placeholder = document.getElementById("video-placeholder");

//   // document.getElementById("status").innerText = "Starting IP Camera...";
//   document.getElementById("status").innerText =
//     "Starting IP Camera... " + ipCameraUrl;

//   // Remove previous video/canvas if any
//   if (video) {
//     video.remove();
//     video = null;
//   }
//   if (canvas) {
//     canvas.remove();
//     canvas = null;
//   }

//   // Get the video feed container
//   // const videoFeed = document.getElementById("video-feed");
//   videoFeed.innerHTML = "";

//   // Create img for MJPEG stream
//   video = document.createElement("img");
//   video.id = "camera-stream";
//   video.src = "http://" + ipCameraUrl + "/video"; // e.g. "http://192.168.245.139:8080/video"
//   video.style.width = "100%";
//   video.style.objectFit = "contain";

//   videoFeed.appendChild(video);

//   // const placeholder = document.getElementById("video-placeholder");
//   if (placeholder) placeholder.style.display = "none";

//   document.getElementById("status").innerText = "Detecting...";
//   document.getElementById("btn-start").style.display = "none";
//   document.getElementById("btn-stop").style.display = "inline-block";
// }

// =========================================//
// function startIPCamera(ipCameraUrl) {
//   const videoFeed = document.getElementById("video-feed");
//   const placeholder = document.getElementById("video-placeholder");

//   // document.getElementById("status").innerText = "Starting IP Camera...";
//   document.getElementById("status").innerText =
//     "Starting IP Camera... " + ipCameraUrl;

//   // Remove previous video/canvas if any
//   if (video) {
//     video.remove();
//     video = null;
//   }
//   if (canvas) {
//     canvas.remove();
//     canvas = null;
//   }

//   // Get the video feed container
//   // const videoFeed = document.getElementById("video-feed");
//   videoFeed.innerHTML = "";

//   // Create img for MJPEG stream
//   video = document.createElement("img");
//   video.id = "camera-stream";
//   video.src = "http://" + ipCameraUrl + "/video"; // e.g. "http://192.168.245.139:5500/video"
//   video.style.width = "100%";
//   video.style.objectFit = "contain";

//   videoFeed.appendChild(video);

//   // const placeholder = document.getElementById("video-placeholder");
//   if (placeholder) placeholder.style.display = "none";

//   document.getElementById("status").innerText = "Detecting...";
//   document.getElementById("btn-start").style.display = "none";
//   document.getElementById("btn-stop").style.display = "inline-block";
// }

// =========================================//
function startIPCamera(ipCameraUrl) {
  alert("Starting IP Camera... " + ipCameraUrl);

  document.getElementById("status").innerText = "Starting IP Camera...";

  if (video) {
    video.remove();
    video = null;
  }
  if (canvas) {
    canvas.remove();
    canvas = null;
  }

  const videoFeed = document.getElementById("video-feed");
  videoFeed.innerHTML = "";

  // MJPEG stream as <img>
  video = document.createElement("img");
  video.id = "camera-stream";
  // video.src = "http://" + ipCameraUrl + "/video";
  video.src = "https://" + ipCameraUrl + "/video";
  video.style.width = "100%";
  video.style.objectFit = "contain";
  video.title = "IP Camera Stream";
  videoFeed.appendChild(video);

  // Overlay canvas
  canvas = document.createElement("canvas");
  canvas.id = "overlay";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  videoFeed.appendChild(canvas);

  const placeholder = document.getElementById("video-placeholder");
  if (placeholder) placeholder.style.display = "none";

  ctx = canvas.getContext("2d");

  document.getElementById("status").innerText = "Detecting...";
  document.getElementById("btn-start").style.display = "none";
  document.getElementById("btn-stop").style.display = "inline-block";

  // // --- Detection Loop ---
  // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // function detectionLoop() {
  //   detectFrame(canvas);
  //   requestAnimationFrame(detectionLoop);
  // }
  // detectionLoop();

  // // --- Detection Loop ---
  const DETECTION_WIDTH = 640;
  const DETECTION_HEIGHT = 480;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  function detectionLoop() {
    if (video.naturalWidth && video.naturalHeight) {
      canvas.width = DETECTION_WIDTH;
      canvas.height = DETECTION_HEIGHT;
      // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // alert(
      //   canvas +
      //     " " +
      //     video +
      //     " " +
      //     video.naturalWidth +
      //     " " +
      //     video.naturalHeight
      // );
      detectFrame(canvas);
    }
    // if (window.runDetectionLoop) {
    window.detectionLoopId = requestAnimationFrame(detectionLoop);
    // }
  }

  // if (window.runDetectionLoop) {
  detectionLoop();
  // }
}

// =========================================//
function startStream(ipCameraUrl) {
  document.getElementById("status").innerText = "Starting Streaming Video...";

  // Clean up previous video/canvas if any
  if (video) {
    video.pause();
    video.srcObject = null;
    video.remove();
    video = null;
  }
  if (canvas) {
    canvas.remove();
    canvas = null;
  }

  // Create video and canvas elements
  video = document.createElement("video");
  video.id = "stream-player";
  // video.id = "video-file-player";
  video.src = "http://" + ipCameraUrl + "/video";
  video.autoplay = true;
  video.controls = true;
  video.playsInline = true;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";

  canvas = document.createElement("canvas");
  canvas.id = "overlay";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";

  const videoFeed = document.getElementById("video-feed");
  videoFeed.innerHTML = "";
  videoFeed.appendChild(video);
  videoFeed.appendChild(canvas);

  video.onloadedmetadata = function () {
    video.play();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx = canvas.getContext("2d");
    document.getElementById("status").innerText = "Detecting...";
    // Start detection loop if needed
    detectFrame(canvas);
  };

  video.onended = function () {
    document.getElementById("status").innerText = "Stream ended.";
  };
}

// =========================================//
function startVideo(filePath) {
  // alert("StartVideo");
  // alert("StartVideo: " + filePath);
  document.getElementById("status").innerText = "Starting Video file...";

  // Clean up previous video/canvas if any
  if (video) {
    video.pause();
    video.srcObject = null;
    video.remove();
    video = null;
  }
  if (canvas) {
    canvas.remove();
    canvas = null;
  }

  // Create video and canvas elements
  video = document.createElement("video");
  video.id = "video-file-player";
  video.src = filePath;
  video.autoplay = true;
  video.controls = true;
  video.playsInline = true;
  video.muted = true;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";

  canvas = document.createElement("canvas");
  canvas.id = "overlay";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";

  const videoFeed = document.getElementById("video-feed");
  videoFeed.innerHTML = "";
  videoFeed.appendChild(video);
  videoFeed.appendChild(canvas);

  const placeholder = document.getElementById("video-placeholder");
  if (placeholder) placeholder.style.display = "none";

  video.onloadedmetadata = function () {
    video.play();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx = canvas.getContext("2d");
    document.getElementById("status").innerText = "Detecting...";
    document.getElementById("btn-start").style.display = "none";
    document.getElementById("btn-stop").style.display = "inline-block";
    detectFrame(canvas);
  };

  video.onended = function () {
    document.getElementById("status").innerText = "Video ended.";
    document.getElementById("btn-start").style.display = "inline-block";
    document.getElementById("btn-stop").style.display = "none";
    // ReInitUI();
    stopButton();
  };
}
