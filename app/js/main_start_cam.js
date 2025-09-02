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
          // video.playsInline = true;
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
              detectLoop();
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
          // video.playsInline = true;
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
              detectLoop();
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
function startIPCamera(ipCameraUrl) {
  // alert("Starting IP Camera... " + ipCameraUrl);

  document.getElementById("status").innerText = "Starting IP Camera...";

  if (video) {
    video.remove();
    video = null;
  }
  if (canvas) {
    canvas.remove();
    canvas = null;
  }

  // MJPEG stream as <img>
  video = document.createElement("img");
  video.id = "camera-stream";
  // video.src = "http://" + ipCameraUrl + "/video"; // e.g. "http://
  video.src = "https://" + ipCameraUrl + "/video"; // e.g. "https://
  video.style.width = "100%";
  video.style.objectFit = "contain";
  video.title = "IP Camera Stream";

  // Overlay canvas
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

  video.onload = function () {
    canvas.width = video.naturalWidth;
    canvas.height = video.naturalHeight;
    ctx = canvas.getContext("2d");
    document.getElementById("status").innerText = "Detecting...";
    document.getElementById("btn-start").style.display = "none";
    document.getElementById("btn-stop").style.display = "inline-block";
    detectLoop();
  };

  video.onerror = function () {
    // document.getElementById("status").innerText = "Failed to load image.";
    document.getElementById("btn-start").style.display = "inline-block";
    document.getElementById("btn-stop").style.display = "none";
  };
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
  // video.playsInline = true;
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
    detectLoop();
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
    // video.pause();
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
  // video.playsInline = true;
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
    detectLoop();
  };

  video.onended = function () {
    document.getElementById("status").innerText = "Video ended.";
    document.getElementById("btn-start").style.display = "inline-block";
    document.getElementById("btn-stop").style.display = "none";
    // ReInitUI();
    stopButton();
  };
}

// =========================================//
function getImageInfo(video) {
  // alert("getImageInfo");
  let info = {};

  // Get current image information, e.g., pixel data, scale, mode, dpi
  info.width = video.naturalWidth;
  info.height = video.naturalHeight;
  info.mode = "RGBA"; // Assuming RGBA for images
  info.dpi = 96;

  alert(
    video +
      " Width: " +
      info.width +
      " Height: " +
      info.height +
      " Mode: " +
      info.mode +
      " DPI: " +
      info.dpi
  );
}

// =========================================//
function startImage(filePath) {
  // alert("StartImage: " + filePath);

  document.getElementById("status").innerText = "Loading Image...";

  // Clean up previous video/canvas if any
  if (video) {
    video.remove();
    video = null;
  }
  if (canvas) {
    canvas.remove();
    canvas = null;
  }

  // Create image and canvas elements
  video = document.createElement("img");
  video.id = "image-file-viewer";
  video.src = filePath;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";
  video.title = "Image Viewer";

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

  // Get image info
  // getImageInfo(video);

  video.onload = function () {
    canvas.width = video.naturalWidth;
    canvas.height = video.naturalHeight;
    ctx = canvas.getContext("2d");
    document.getElementById("status").innerText = "Detecting...";
    document.getElementById("btn-start").style.display = "none";
    document.getElementById("btn-stop").style.display = "inline-block";
    detectLoop();
  };

  video.onerror = function () {
    document.getElementById("status").innerText = "Failed to load image.";
    document.getElementById("btn-start").style.display = "inline-block";
    document.getElementById("btn-stop").style.display = "none";
  };
}

// =========================================//
// Global state for image folder navigation
let imageFolderFiles = [];
let imageFolderIndex = 0;

// =========================================//
function startImageFolder() {
  const videoFeed = document.getElementById("video-feed");
  const status = document.getElementById("status");

  // Navigation buttons (create if not present)
  let navDiv = document.getElementById("image-folder-nav");
  if (!navDiv) {
    navDiv = document.createElement("div");
    navDiv.id = "image-folder-nav";
    navDiv.style.margin = "10px 0";
    videoFeed.parentNode.insertBefore(navDiv, videoFeed.nextSibling);
  }
  navDiv.innerHTML = "";

  // Use the selected files to create blob URLs for images
  if (window.selectedImageFolderPath && window.selectedImageFolderPath.length) {
    imageFolderFiles = Array.from(window.selectedImageFolderPath)
      .filter((f) => /\.(jpg|jpeg|png|bmp|gif)$/i.test(f.name))
      .map((f) => URL.createObjectURL(f));
  } else {
    imageFolderFiles = [];
  }

  imageFolderIndex = 0;

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";
  nextBtn.onclick = () => {
    getNextImageInFolder();
  };

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Previous";
  prevBtn.onclick = () => {
    getPreviousImageInFolder();
  };

  navDiv.appendChild(prevBtn);
  navDiv.appendChild(nextBtn);

  // Show the first image
  showImageInFolder();
  if (status) status.innerText = `Image 1 of ${imageFolderFiles.length}`;
}

// =========================================//
function showImageInFolder() {
  // alert("Showing image");

  const status = document.getElementById("status");

  // Clean up previous video/canvas if any
  if (video) {
    video.remove();
    video = null;
  }
  if (canvas) {
    canvas.remove();
    canvas = null;
  }

  // Create image element
  video = document.createElement("img");
  video.id = "image-file-viewer";
  video.src = imageFolderFiles[imageFolderIndex];
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";
  video.title = "Image Viewer";

  // Create overlay canvas
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

  // Hide placeholder if present
  const placeholder = document.getElementById("video-placeholder");
  if (placeholder) placeholder.style.display = "none";

  video.onload = function () {
    canvas.width = video.naturalWidth;
    canvas.height = video.naturalHeight;
    ctx = canvas.getContext("2d");
    if (status)
      status.innerText = `Image ${imageFolderIndex + 1} of ${
        imageFolderFiles.length
      }`;
    document.getElementById("btn-start").style.display = "none";
    document.getElementById("btn-stop").style.display = "inline-block";
    detectLoop();
  };
  video.onerror = function () {
    if (status) status.innerText = "Failed to load image.";
    document.getElementById("btn-start").style.display = "inline-block";
    document.getElementById("btn-stop").style.display = "none";
  };
}

// =========================================//
function getNextImageInFolder() {
  // alert("Next image");

  if (imageFolderIndex < imageFolderFiles.length - 1) {
    imageFolderIndex++;
    showImageInFolder();
  }
}

// =========================================//
function getPreviousImageInFolder() {
  if (imageFolderIndex > 0) {
    imageFolderIndex--;
    showImageInFolder();
  }
}
