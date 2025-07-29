// =========================================//
// OBJECT DETECTION FUNCTIONS
function toggleObjectDetection() {
  // alert("toggleObjectDetection");

  const groupFrameObject = document.getElementById("group-frame-object");
  const objectSwitch = document.getElementById("object-switch");
  const objectStatus = document.getElementById("object-status");

  if (!objectSwitch) return;

  window.objectDetectionEnabled = objectSwitch.checked;
  groupFrameObject.style.display = objectSwitch.checked ? "flex" : "none";

  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Object Detection " + (objectSwitch.checked ? "On" : "Off")
    );
  }

  objectStatus.innerHTML = objectSwitch.checked
    ? 'Object: <b style="color:green">o</b>'
    : 'Object: <b style="color:blue">-</b>';

  localStorage.setItem(
    "objectDetectionMode",
    objectSwitch.checked ? "on" : "off"
  );
}

// =========================================//
function setObjectDetectionMode(mode) {
  // alert("setObjectDetectionMode: " + mode);

  const groupFrameObject = document.getElementById("group-frame-object");
  const objectSwitch = document.getElementById("object-switch");
  const objectStatus = document.getElementById("object-status");

  if (objectSwitch) {
    objectSwitch.checked = mode === "on";
    objectSwitch.dispatchEvent(new Event("change"));
  }

  if (objectStatus) {
    objectStatus.innerHTML =
      mode === "on"
        ? 'Object: <b style="color:green">o</b>'
        : 'Object: <b style="color:blue">-</b>';
  }

  if (groupFrameObject) {
    groupFrameObject.style.display =
      objectSwitch && objectSwitch.checked ? "flex" : "none";
  }

  localStorage.setItem("objectDetectionMode", mode);
}

// =========================================//
function updateObjectDetection() {
  // alert("updateObjectDetection");

  const objectSwitch = document.getElementById("object-switch");
  const canvas = document.getElementById("overlay");
  const source =
    document.getElementById("camera-stream") ||
    document.getElementById("usb-camera-stream") ||
    document.getElementById("stream-player") ||
    document.getElementById("video-file-player") ||
    document.getElementById("video") ||
    document.getElementById("image") ||
    document.getElementById("image-file-viewer");

  if (!canvas || !objectSwitch || !objectSwitch.checked || !source) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (source instanceof HTMLVideoElement) {
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
  } else if (source instanceof HTMLImageElement) {
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
    source.crossOrigin = "anonymous";
  } else {
    document.getElementById("status").innerText = "No video/image found";
    return;
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  updateObjects(canvas);
  drawObjects(predictions);
}

// =========================================//
function updateObjects(canvas) {
  // alert("updateObject");

  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  // Use TensorFlow.js COCO-SSD model for object detection
  if (!window.cocoSsdModel) {
    cocoSsd.load().then((model) => {
      window.cocoSsdModel = model;
      console.log("COCO-SSD model loaded");
      updateObjects(canvas);
    });
    return;
  }

  const predictions = window.cocoSsdModel.detect(canvas);
  if (!predictions || predictions.length === 0) {
    console.log("No objects detected.");
    return;
  }

  window.cocoSsdModel.detect(canvas).then((predictions) => {
    drawObjects(predictions);
  });
}

// =========================================//
function drawObject(predictions) {
  if (!canvas || !video) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  predictions.forEach((pred) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(...pred.bbox);
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(
      pred.class,
      pred.bbox[0],
      pred.bbox[1] > 20 ? pred.bbox[1] - 5 : 10
    );
  });

  if (predictions.length === 0) {
    console.log("No objects detected.");
  } else {
    console.log(
      "Objects detected:",
      predictions.map((p) => p.class).join(", ")
    );
  }
}
