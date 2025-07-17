// =========================================//
// Theme logic for all pages
document.addEventListener("DOMContentLoaded", function () {
  // Always apply saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  // After loading content into group-frame-source, apply the theme
  const groupFrameSource = document.getElementById("group-frame-source");
  if (groupFrameSource) {
    if (savedTheme === "dark") {
      groupFrameSource.classList.add("dark-mode");
    } else {
      groupFrameSource.classList.remove("dark-mode");
    }
  }

  // Only add switch logic if the switch exists
  const themeSwitch = document.getElementById("theme-switch");
  const themeModeText = document.getElementById("theme-mode-text");
  if (themeSwitch && themeModeText) {
    themeSwitch.checked = savedTheme === "dark";
    themeModeText.textContent = savedTheme === "dark" ? "Theme" : "Theme";
    themeSwitch.addEventListener("change", function () {
      if (this.checked) {
        setTheme("dark");
        // themeModeText.textContent = "Dark";
        localStorage.setItem("theme", "dark");
      } else {
        setTheme("light");
        // themeModeText.textContent = "Light";
        localStorage.setItem("theme", "light");
      }
    });
  }
});

// =========================================//
// Set initial theme based on system preference
function setTheme(mode) {
  const body = document.body;
  const container = document.getElementById("container");
  const groupFrameTheme = document.getElementById("group-frame-theme");
  const videoFeed = document.getElementById("video-feed");
  const controlsButtons = document.querySelectorAll(".controls-section button");
  const selects = document.querySelectorAll(".video_source_section select");
  // const themeModeText = document.getElementById("theme-mode-text");
  const groupFrameSource = document.getElementById("group-frame-source");

  if (mode === "dark") {
    body.classList.add("dark-mode");
    if (container) container.classList.add("dark-mode");
    if (groupFrameTheme) groupFrameTheme.classList.add("dark-mode");
    if (videoFeed) videoFeed.classList.add("dark-mode");
    if (groupFrameSource) groupFrameSource.classList.add("dark-mode");
    selects.forEach((sel) => sel.classList.add("dark-mode"));
    controlsButtons.forEach((btn) => btn.classList.add("dark-mode"));
    // if (themeModeText) themeModeText.textContent = "Dark";
  } else {
    body.classList.remove("dark-mode");
    if (container) container.classList.remove("dark-mode");
    if (groupFrameTheme) groupFrameTheme.classList.remove("dark-mode");
    if (videoFeed) videoFeed.classList.remove("dark-mode");
    if (groupFrameSource) groupFrameSource.classList.remove("dark-mode");
    selects.forEach((sel) => sel.classList.remove("dark-mode"));
    controlsButtons.forEach((btn) => btn.classList.remove("dark-mode"));
    // if (themeModeText) themeModeText.textContent = "Light";
  }
}
