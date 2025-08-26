// =========================================//
// Video source selection
function updateVideoSource() {
  // alert("updateVideoSource");
  stopCamera();
  // stopButton();

  const videoSource = document.getElementById("video-source");
  const btnStart = document.getElementById("btn-start");
  const btnCommand = document.getElementById("btn-command");
  const btnVoice = document.getElementById("btn-voice");
  const btnBrowse = document.getElementById("btn-browse");
  const btnOk = document.getElementById("btn-ok");
  const ipCameraUrlInput = document.getElementById("ip-camera-url");

  listAllCameras(); // Call the function to list all available cameras

  //------------------------------//
  if (videoSource.value === "camera") {
    CheckIntegratedCamera(); // Call the function to start the camera
    document.getElementById("status").innerText = "Integrated Camera (default)";
    btnStart.disabled = false; // Disable the start button
    btnCommand.disabled = false; // Disable the command button
    btnVoice.disabled = false; // Disable the voice button

    btnBrowse.style.display = "none"; // Hide the browse button
    btnBrowse.disabled = true; // Disable the browse button
    btnOk.disabled = true; // Disable the OK button
    btnOk.style.display = "none"; // Show the button initially
    ipCameraUrlInput.disabled = true; // Disable the IP camera URL input
    ipCameraUrlInput.style.display = "none"; // Hide the input initially

    //------------------------------//
  } else if (videoSource.value === "camera_usb") {
    // alert("CheckUSBCamera");
    CheckUSBCamera(); // Call the function to start the webcam
    document.getElementById("status").innerText = "USB Camera (external)";
    btnStart.disabled = false; // Disable the start button
    btnCommand.disabled = false; // Disable the command button
    btnVoice.disabled = false; // Disable the voice button

    btnBrowse.style.display = "none"; // Hide the browse button
    btnBrowse.disabled = true; // Disable the browse button
    btnOk.disabled = true; // Disable the OK button
    btnOk.style.display = "none"; // Hide the button initially
    ipCameraUrlInput.disabled = true; // Disable the IP camera URL input
    ipCameraUrlInput.style.display = "none"; // Hide the input initially

    //------------------------------//
  } else if (videoSource.value === "camera_ip") {
    // CheckIPCamera(); // Call the function to start the IP camera
    document.getElementById("status").innerText = "IP Camera (wifi)";
    btnStart.disabled = false; // Disable the start button
    btnCommand.disabled = false; // Disable the command button
    btnVoice.disabled = false; // Disable the voice button

    btnBrowse.style.display = "none"; // Hide the browse button
    btnBrowse.disabled = true; // Disable the browse button
    btnOk.disabled = false; // Disable the OK button
    btnOk.style.display = "inline-block"; // Show the button initially
    ipCameraUrlInput.disabled = false; // Disable the IP camera URL input
    ipCameraUrlInput.style.display = "inline-block"; // Hide the input initially
    // ipCameraUrlInput.value = ""; // Clear previous value
    // ipCameraUrlInput.value = "192.168.233.61:8080";
    // ipCameraUrlInput.value = "192.168.245.139:5500";

    // Check if last used value is available
    if (getLastUsedIP()) {
      prefillLastUsedIP(); // Pre-fill the input with last used IP if available
      ipCameraUrlInput.focus(); // Focus on the input field
    } else {
      // Get the local subnet and set the placeholder for the IP camera URL input
      getLocalIPSubnet(function (subnet) {
        if (subnet) {
          // ipCameraUrlInput.placeholder = subnet + "XXX:8080";
          // ipCameraUrlInput.value = subnet + "XXX:5500";
          // ipCameraUrlInput.value = subnet + "139:5500";
          ipCameraUrlInput.value = subnet + "139:5500";
          // ipCameraUrlInput.value = subnet + "61:5500";
          ipCameraUrlInput.focus();
        }
      });
    }

    //------------------------------//
  } else if (videoSource.value === "stream") {
    // CheckStream(); // Call the function to start the stream
    document.getElementById("status").innerText = "Stream (internet)";
    btnStart.disabled = true; // Disable the start button
    btnCommand.disabled = false; // Disable the command button
    btnVoice.disabled = false; // Disable the voice button

    btnBrowse.style.display = "none"; // Hide the browse button
    btnBrowse.disabled = true; // Disable the browse button
    // btnOk.disabled = true; // Disable the OK button
    btnOk.disabled = false; // Disable the OK button
    btnOk.style.display = "inline-block"; // Show the button initially
    ipCameraUrlInput.disabled = false; // Disable the IP camera URL input
    ipCameraUrlInput.style.display = "inline-block"; // Show the input initially
    ipCameraUrlInput.value = "192.168.245.139:5500";
    // ipCameraUrlInput.value = "192.168.245.61:5500";
    ipCameraUrlInput.focus();

    //------------------------------//
  } else if (videoSource.value === "video") {
    // CheckVideo(); // Call the function to start the video file selection
    document.getElementById("status").innerText = "Video (file)";
    btnStart.disabled = true; // Disable the start button
    btnCommand.disabled = false; // Disable the command button
    btnVoice.disabled = false; // Disable the voice button
    btnBrowse.style.display = "inline-block"; // Enable the browse button
    btnBrowse.disabled = false; // Enable the browse button
    btnOk.disabled = true; // Disable the OK button
    btnOk.style.display = "none"; // Show the button initially
    ipCameraUrlInput.disabled = true; // Disable the IP camera URL input
    ipCameraUrlInput.style.display = "none"; // Hide the input initially
    browseButton(); // Call the function to browse video files

    //------------------------------//
  } else if (videoSource.value === "image_file") {
    // CheckImage(); // Call the function to start the image file selection
    document.getElementById("status").innerText = "Image (file)";
    btnStart.disabled = true; // Disable the start button
    btnCommand.disabled = false; // Disable the command button
    btnVoice.disabled = false; // Disable the voice button
    btnBrowse.style.display = "inline-block"; // Enable the browse button
    btnBrowse.disabled = false; // Enable the browse button
    btnOk.disabled = true; // Disable the OK button
    btnOk.style.display = "none"; // Show the button initially
    ipCameraUrlInput.disabled = true; // Disable the IP camera URL input
    ipCameraUrlInput.style.display = "none"; // Hide the input initially
    browseButton(); // Call the function to browse image files

    //------------------------------//
  } else if (videoSource.value === "image_folder") {
    document.getElementById("status").innerText = "Image (folder)";
    btnStart.disabled = true; // Disable the start button
    btnCommand.disabled = false; // Enable the command button
    btnVoice.disabled = false; // Enable the voice button
    btnBrowse.style.display = "inline-block"; // Show the browse button
    btnBrowse.disabled = false; // Enable the browse button
    btnOk.disabled = true; // Disable the OK button
    btnOk.style.display = "none"; // Hide the OK button
    ipCameraUrlInput.disabled = true; // Disable the IP camera URL input
    ipCameraUrlInput.style.display = "none"; // Hide the input
    browseButton(); // Call the function to browse image folders
  }
}

// =========================================//
// Check if any integrated (built-in) camera is found
async function isIntegratedCameraAvailable() {
  // Common built-in camera labels contain "integrated" or "built-in"
  return (
    (await checkCameraAvailability("videoinput", "integrated")) ||
    (await checkCameraAvailability("videoinput", "built-in"))
  );
}

// Check if any USB (external) camera is found
async function isUSBCameraAvailable() {
  // Common USB camera labels contain "usb"
  return await checkCameraAvailability("videoinput", "usb");
}

// General camera availability checker
async function checkCameraAvailability(kind = "videoinput", labelMatch = "") {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
    return false;
  const devices = await navigator.mediaDevices.enumerateDevices();
  if (labelMatch) {
    return devices.some(
      (device) =>
        device.kind === kind &&
        device.label.toLowerCase().includes(labelMatch.toLowerCase())
    );
  }
  return devices.some((device) => device.kind === kind);
}

// ==========================================//
// Select default camera source
function CheckIntegratedCamera() {
  // alert("CheckIntegratedCamera");
  const available = checkCameraAvailability("integrated");
  // alert(available);

  // Check if video feed is from a built-in camera
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  const btnCommand = document.getElementById("btn-command");
  const btnVoice = document.getElementById("btn-voice");

  // if the built-in camera is available, use the built-in camera in the video feed
  if (available) {
    // alert("Built-in camera is available");
    btnStart.disabled = true; // disable the start button
    btnStop.disabled = false; // enable the stop button
    btnCommand.disabled = false; // enable the command button
    btnVoice.disabled = false; // enable the voice button
    // startIntegratedCamera();
    // startButton();
  } else {
    // console.error("Built-in camera not available.");
    document.getElementById("status").innerText =
      "Built-in camera not available.";
    return;
  }
}

// ==========================================//
// Select USB camera video source
function CheckUSBCamera() {
  // alert("CheckUSBCamera");
  const available = checkCameraAvailability("usb");
  // alert(available);

  // Check if video feed is from an external webcam
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  const btnCommand = document.getElementById("btn-command");
  const btnVoice = document.getElementById("btn-voice");

  // if the built-in camera is available, use the built-in camera in the video feed
  if (available) {
    // alert("USB camera is available");
    btnStart.disabled = true; // disable the start button
    btnStop.disabled = false; // enable the stop button
    btnCommand.disabled = false; // enable the command button
    btnVoice.disabled = false; // enable the voice button
    // startUSBCamera();
    // startButton();
  } else {
    console.error("USB camera not available.");
    return;
  }
}

// ==========================================//
function CheckIPCamera() {
  // alert("CheckIPCamera");

  const ipCameraUrl = document.getElementById("ip-camera-url");
  const ipCameraUrlValue = ipCameraUrl.value.trim();
  const btnOk = document.getElementById("btn-ok");

  // btnOk.disabled = true; // Disable the OK button initially
  btnOk.style.display = "inline-block";

  // video_source = "http://192.168.30.139:4747"
  // video_source = "http://192.168.30.139:8080"
  // video_source = "http://192.168.210.139:8080"

  // Check if the URL matches exactly the expected format "xxx.xxx.xx.xxx:xxxx" with total 15 digits
  // if (ipCameraUrlValue.match(/^(http:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/i)) {
  if (ipCameraUrlValue.match(/^(http:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/i)) {
    // alert("URL format OK");
    document.getElementById("status").innerText = "Valid IP camera URL.";
    btnOk.disabled = false; // enable the OK button if the URL is valid
  } else {
    // alert("URL format NOT OK");
    document.getElementById("status").innerText = "Invalid IP camera URL.";
    btnOk.disabled = true; // disable the OK button if the URL is invalid
  }
}

// ==========================================//
// function CheckIPCamera() {
//   alert("CheckIPCamera");

//   const ipCameraUrlInput = document.getElementById("ip-camera-url");
//   const ipCameraUrlValue = ipCameraUrlInput.value.trim();
//   const btnOk = document.getElementById("btn-ok");

//   // Validate format
//   if (ipCameraUrlValue.match(/^(http:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/i)) {
//     document.getElementById("status").innerText =
//       "Valid IP camera URL. Checking connection...";
//     btnOk.disabled = true;

//     // Try to fetch a test image (e.g., /shot.jpg)
//     let testUrl = ipCameraUrlValue;
//     if (!/^http:\/\//i.test(testUrl)) testUrl = "http://" + testUrl;
//     testUrl += "/shot.jpg?t=" + Date.now();

//     fetch(testUrl, { method: "GET" })
//       .then((response) => {
//         if (response.ok) {
//           document.getElementById("status").innerText = "Camera reachable!";
//           btnOk.disabled = false;
//         } else {
//           document.getElementById("status").innerText =
//             "Camera URL valid, but not reachable.";
//           btnOk.disabled = true;
//         }
//       })
//       .catch(() => {
//         document.getElementById("status").innerText =
//           "Camera URL valid, but not reachable.";
//         btnOk.disabled = true;
//       });
//   } else {
//     document.getElementById("status").innerText = "Invalid IP camera URL.";
//     btnOk.disabled = true;
//   }
// }

// ==========================================//
// Get user's local IP subnet (works only if WebRTC is allowed)
function getLocalIPSubnet(callback) {
  const RTCPeerConnection =
    window.RTCPeerConnection || window.webkitRTCPeerConnection;
  if (!RTCPeerConnection) return callback(null);

  const pc = new RTCPeerConnection({ iceServers: [] });
  pc.createDataChannel("");
  pc.createOffer().then((offer) => pc.setLocalDescription(offer));
  pc.onicecandidate = function (event) {
    if (!event || !event.candidate) return;
    const ipMatch = event.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
    if (ipMatch) {
      const ip = ipMatch[1];
      const subnet = ip.split(".").slice(0, 3).join(".") + ".";
      callback(subnet);
      pc.close();
    }
  };
}

// Remember and restore the last used IP camera/stream URL using localStorage
function saveLastUsedIP(url) {
  if (url && typeof url === "string") {
    localStorage.setItem("lastUsedIPCamURL", url);
  }
}

function getLastUsedIP() {
  return localStorage.getItem("lastUsedIPCamURL") || "";
}

// When showing the input, pre-fill with last used value if available:
function prefillLastUsedIP() {
  const lastIP = getLastUsedIP();
  const ipCameraUrlInput = document.getElementById("ip-camera-url");
  if (ipCameraUrlInput && lastIP) {
    ipCameraUrlInput.value = lastIP;
  }
}

function isValidIPCameraUrl(url) {
  return /^https?:\/\/(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(\/.*)?$/i.test(url);
}

function okSourceCamera() {
  // alert("okSourceCamera");

  // Get the IP camera URL from the input field
  const videoSource = document.getElementById("video-source");
  const ipCameraUrl = document.getElementById("ip-camera-url").value;
  const btnOk = document.getElementById("btn-ok");
  const btnStart = document.getElementById("btn-start");
  const btnCommand = document.getElementById("btn-command");
  const btnVoice = document.getElementById("btn-voice");

  if (videoSource.value === "camera_ip") {
    CheckIPCamera(); // Validate the IP camera URL format
  } else if (videoSource.value === "stream") {
    CheckStream(); // Validate the stream URL format
  }

  // if (videoSource.value === "camera_ip" && isValidIPCameraUrl(ipCameraUrl)) {
  //   saveLastUsedIP(ipCameraUrl);
  //   startIPCamera(ipCameraUrl.replace(/^https?:\/\//, "")); // Remove protocol if needed
  // } else if (videoSource.value === "stream" && isValidIPCameraUrl(ipCameraUrl)) {
  //   startStream(ipCameraUrl);
  // } else {
  //   document.getElementById("status").innerText = "Please enter a valid IP camera or stream URL.";
  // }

  if (
    ipCameraUrl === "192.168.30.139:4747" ||
    ipCameraUrl === "192.168.30.139:8080" ||
    ipCameraUrl === "192.168.210.139:8080" ||
    ipCameraUrl === "192.168.233.61:8080" ||
    ipCameraUrl === "192.168.245.61:5500" ||
    ipCameraUrl === "192.168.245.160:5500" ||
    ipCameraUrl === "192.168.245.139:5500"
  ) {
    document.getElementById("status").innerText =
      "IP Camera URL: " + ipCameraUrl;

    document.getElementById("video-source").disabled = true;
    btnOk.disabled = true; // Disable the OK button after setting the URL
    btnStart.disabled = false; // Enable the start button
    btnCommand.disabled = false; // Enable the command button
    btnVoice.disabled = false; // Enable the voice button

    if (videoSource.value === "camera_ip") {
      // window.runDetectionLoop = true;
      saveLastUsedIP(ipCameraUrl);
      startButton();
    } else if (videoSource.value === "stream") {
      startStream(ipCameraUrl); // Start the stream with the provided URL
      // startStream(ipCameraUrl); // Start the stream with the provided URL
    }
  } else {
    document.getElementById("status").innerText =
      "Please enter a valid IP camera URL.";
    btnOk.disabled = false; // Disable the OK button after setting the URL
  }
}

// ==========================================//
function CheckStream() {
  alert("CheckStream");

  const videoFeed = document.getElementById("video-feed");
  const video = document.createElement("video");

  document.getElementById("status").innerText = "Starting stream...";

  videoFeed.innerHTML = ""; // Clear previous content
  video.id = "stream-video";
  video.autoplay = true;
  video.playsInline = true;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";
  videoFeed.appendChild(video);

  // Set the source of the video element to a sample stream URL
  const streamUrl = "https://www.example.com/sample-stream"; // Example URL
  video.src = streamUrl;
  video.onloadedmetadata = function () {
    video.play();
    document.getElementById("status").innerText = "Stream started.";
  };
}

// =========================================//
function CheckVideo(file) {
  // alert("CheckVideo");

  // Check if the selected video file format (.mp4, .mov, .avi, .mkv) is valid
  const videoFile = file;
  const validFormats = [".mp4", ".mov", ".avi", ".mkv"];
  const fileExtension = videoFile.name.split(".").pop().toLowerCase();
  const isValidFormat = validFormats.includes("." + fileExtension);
  if (isValidFormat) {
    // document.getElementById("status").innerText = "Valid video file format: " + videoFile.name;
    // alert("Valid: " + videoFile.name);
  } else {
    document.getElementById("status").innerText =
      "Invalid video file format. Please select a valid video file.";
    // alert("Invalid");
  }
}

window.selectedVideoFilePath = null;
window.selectedImageFilePath = null;
window.selectedImageFolderPath = null;
window.selectedImageFiles = null;
// =========================================//
// Browse video cam function
function browseButton() {
  // alert("browseButton");

  const videoSource = document.getElementById("video-source");

  // =========================================//
  if (videoSource.value === "video") {
    // Open file dialog to select a video file
    const fileInput = document.createElement("input");
    const btnStart = document.getElementById("btn-start");
    const btnCommand = document.getElementById("btn-command");
    const btnVoice = document.getElementById("btn-voice");
    const btnOk = document.getElementById("btn-ok");

    fileInput.type = "file";
    fileInput.accept = "video/*"; // Accept video files only
    fileInput.onchange = function (event) {
      const file = event.target.files[0];
      if (file) {
        window.selectedVideoFilePath = URL.createObjectURL(file);
        document.getElementById("status").innerText =
          "Selected video file: " + file.name;
        btnStart.disabled = false; // Enable the start button
        btnCommand.disabled = false; // Enable the command button
        btnVoice.disabled = false; // Enable the voice button
        btnOk.disabled = true; // Disable the OK button
        CheckVideo(file); // Call the function to check the video file format
        startButton();

        // startVideo(window.selectedVideoFilePath); // Play the selected video file
      } else {
        document.getElementById("status").innerText = "No file selected.";
        window.selectedVideoFilePath = null;
      }
    };
    // Open the file dialog
    fileInput.click();

    // =========================================//
  } else if (videoSource.value === "image_file") {
    // Open file dialog to select an image file
    const fileInput = document.createElement("input");
    const btnStart = document.getElementById("btn-start");
    const btnCommand = document.getElementById("btn-command");
    const btnVoice = document.getElementById("btn-voice");
    const btnOk = document.getElementById("btn-ok");

    fileInput.type = "file";
    fileInput.accept = "image/*"; // Accept image files only
    fileInput.onchange = function (event) {
      const file = event.target.files[0];
      if (file) {
        window.selectedImageFilePath = URL.createObjectURL(file);
        document.getElementById("status").innerText =
          "Selected image file: " + file.name;
        btnStart.disabled = false; // Enable the start button
        btnCommand.disabled = false; // Enable the command button
        btnVoice.disabled = false; // Enable the voice button
        btnOk.disabled = true; // Disable the OK button
        startButton();
      } else {
        document.getElementById("status").innerText = "No file selected.";
        window.selectedImageFilePath = null;
      }
    };
    // Open the file dialog
    fileInput.click();

    // =========================================//
  } else if (videoSource.value === "image_folder") {
    // Open file dialog to select an image file
    const folderInput = document.createElement("input");
    const btnStart = document.getElementById("btn-start");
    const btnCommand = document.getElementById("btn-command");
    const btnVoice = document.getElementById("btn-voice");
    const btnOk = document.getElementById("btn-ok");

    folderInput.type = "file";
    folderInput.webkitdirectory = true; // Allow folder selection
    folderInput.multiple = true; // Allow multiple files (all in the folder)
    folderInput.onchange = function (event) {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        // Get the folder name from the first file's relative path
        const folderName = files[0].webkitRelativePath.split("/")[0];
        window.selectedImageFolderPath = folderName;
        document.getElementById("status").innerText =
          "Selected image folder: " + folderName + ` (${files.length} images)`;
        btnStart.disabled = false; // Enable the start button
        btnCommand.disabled = false; // Enable the command button
        btnVoice.disabled = false; // Enable the voice button
        btnOk.disabled = true; // Disable the OK button
        // Optionally, store the file list for later use
        window.selectedImageFiles = files;
        // alert("Total " + files.length + files);
        startButton();
      } else {
        document.getElementById("status").innerText = "No folder selected.";
        window.selectedImageFolderPath = null;
        window.selectedImageFiles = null;
      }
    };
    // Open the folder dialog
    folderInput.click();
  }
}
