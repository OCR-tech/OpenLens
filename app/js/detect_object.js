// =========================================//
// OBJECT DETECTION FUNCTIONS
function toggleObjectDetection() {
  const objectSwitch = document.getElementById("object-switch");
  const objectStatus = document.getElementById("object-status");

  if (!objectSwitch) return;

  window.objectDetectionEnabled = objectSwitch.checked;

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

  localStorage.setItem("objectDetectionMode", mode);
}

// =========================================//
async function updateObjectDetection() {
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
    document.getElementById("status").innerText = "No video found";
    return;
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  // Use TensorFlow.js COCO-SSD model for object detection
  if (!window.cocoSsdModel) {
    window.cocoSsdModel = await cocoSsd.load();
  }
  const predictions = await window.cocoSsdModel.detect(canvas);

  drawObjects(predictions);
}

// =========================================//
function drawObjects(predictions) {
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
