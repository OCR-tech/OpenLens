// =========================================//
// Update video unit selection and display multiple video screens
// function updateVideoUnit() {
//   alert("updateVideoUnit");

//   const videoUnit = document.getElementById("video-unit");
//   const videoFeed = document.getElementById("video-feed");

//   if (!videoUnit || !videoFeed) return;

//   // Get the selected number of video screens (e.g., 1, 2, 4)
//   const unitCount = parseInt(videoUnit.value, 10) || 1;

//   // Clear previous video screens
//   videoFeed.innerHTML = "";

//   // Create and append video elements
//   for (let i = 0; i < unitCount; i++) {
//     const videoContainer = document.createElement("div");
//     videoContainer.className = "video-unit-container";
//     videoContainer.style.display = "inline-block";
//     videoContainer.style.width = `${100 / unitCount}%`;
//     videoContainer.style.height = "100%";
//     videoContainer.style.boxSizing = "border-box";
//     videoContainer.style.padding = "2px";

//     const video = document.createElement("video");
//     video.id = `video-unit-${i + 1}`;
//     video.autoplay = true;
//     video.playsInline = true;
//     video.style.width = "100%";
//     video.style.height = "100%";
//     video.style.objectFit = "contain";
//     videoContainer.appendChild(video);

//     videoFeed.appendChild(videoContainer);
//   }
// }

// =========================================//
function updateVideoUnit() {
  alert("updateVideoUnit");
  const videoUnit = document.getElementById("video-unit");
  const videoFeed = document.getElementById("video-feed");
  if (!videoUnit || !videoFeed) return;

  const unitCount = parseInt(videoUnit.value, 10) || 1;
  videoFeed.innerHTML = "";
  videoFeed.style.display = "flex"; // Ensure flex layout

  for (let i = 0; i < unitCount; i++) {
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-unit-container";

    const video = document.createElement("video");
    video.id = `video-unit-${i + 1}`;
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "contain";
    videoContainer.appendChild(video);

    videoFeed.appendChild(videoContainer);
  }
}
