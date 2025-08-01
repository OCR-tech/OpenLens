// =========================================//
// Dynamically include all HTML fragments and restore UI state from localStorage
// Synchronous version: loads files one by one in order

document.addEventListener("DOMContentLoaded", function () {
  const includes = Array.from(document.querySelectorAll("[include-html]"));

  // Synchronously load all includes in order
  function loadIncludesSync(index = 0) {
    if (index >= includes.length) {
      restoreAllModesAndValues();
      // Dispatch a custom event for further initialization if needed
      includes.forEach((el) => {
        el.dispatchEvent(
          new CustomEvent("html-included", {
            detail: { file: el.getAttribute("include-html") },
          })
        );
      });
      return;
    }

    const el = includes[index];
    const file = el.getAttribute("include-html");
    fetch(file)
      .then((response) => response.text())
      .then((data) => {
        el.innerHTML = data;

        // ==========================================//
        // Only run this block for text.html includes
        if (file.endsWith("text.html")) {
          const dropdown = document.getElementById("languageDropdown");
          if (!dropdown) return;

          // Get the container for the checkboxes
          const optionsBox = document.querySelector(
            "#languageDropdown .multi-options-box"
          );

          // Clear existing options (optional)
          optionsBox.innerHTML = "";

          // Loop through the array and add checkboxes
          languages.forEach((lang) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" value="${lang.value}" /> ${lang.label}`;
            optionsBox.appendChild(label);
          });

          // Only add the document click handler once
          if (!window.languageDropdownClickHandlerAdded) {
            document.addEventListener("click", function (e) {
              const dropdown = document.getElementById("languageDropdown");
              if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
              }
            });
            window.languageDropdownClickHandlerAdded = true;
          }
        }

        // ==========================================//
        // Restore video source selection
        if (el.id === "group-frame-source") {
          const selectVideo = el.querySelector("#video-source");
          const selectUnit = el.querySelector("#video-unit");

          if (selectVideo && typeof updateVideoSource === "function") {
            selectVideo.onchange = updateVideoSource;
          }
          if (selectUnit && typeof updateVideoUnit === "function") {
            selectUnit.onchange = updateVideoUnit;
          }
        }

        // Load next include
        loadIncludesSync(index + 1);
      })
      .catch((err) => {
        el.innerHTML = "<p>Failed to load content.</p>";
        console.error("Failed to load", file, err);
        // Continue loading next include even if this one fails
        loadIncludesSync(index + 1);
      });
  }

  function restoreMode(key, setter, fallback = "off") {
    const value = localStorage.getItem(key) || fallback;
    if (typeof setter === "function") setter(value);
  }
  function restoreValue(key, setter, fallback = 50) {
    const value = localStorage.getItem(key) || fallback;
    if (typeof setter === "function") setter(value);
  }

  function restoreAllModesAndValues() {
    restoreMode("sourceMode", window.setSourceMode);
    restoreMode("mode", window.setMode);
    restoreMode("theme", window.setTheme, "light");
    restoreMode("voiceCommandMode", window.setVoiceCommandMode);
    restoreValue(
      "volumeSliderCommandValue",
      window.setVolumeSliderCommandValue
    );
    restoreMode("voiceAlertMode", window.setVoiceAlertMode);
    restoreValue("volumeSliderAlertValue", window.setVolumeSliderAlertValue);
    restoreMode("voiceStatusMode", window.setVoiceStatusMode);
    restoreValue("volumeSliderStatusValue", window.setVolumeSliderStatusValue);
    restoreMode("datetimeMode", window.setDatetimeMode);
    restoreMode("gpsLocationMode", window.setGPSLocationMode);
    restoreMode("videoSizeMode", window.setVideoSizeMode, "default");
    restoreMode("framerateMode", window.setFramerateMode, "default");
    restoreMode("notificationMode", window.setNotificationMode);
    restoreMode("objectDetectionMode", window.setObjectDetectionMode);
    restoreMode("textDetectionMode", window.setTextDetectionMode);
    restoreMode("motionDetectionMode", window.setMotionDetectionMode);
    restoreValue(
      "volumeSliderMotionDetectionValue",
      window.setVolumeSliderMotionDetectionValue
    );
    restoreMode("smokeDetectionMode", window.setSmokeDetectionMode);
    restoreValue("smokeSensitivityValue", window.setSmokeSensitivityValue);
    restoreMode("fireDetectionMode", window.setFireDetectionMode);
    restoreValue("fireSensitivityValue", window.setFireSensitivityValue);
    restoreMode("floodDetectionMode", window.setFloodDetectionMode);
    restoreValue("floodSensitivityValue", window.setFloodSensitivityValue);
    restoreMode("lightDetectionMode", window.setLightDetectionMode);
    restoreValue("lightSensitivityValue", window.setLightSensitivityValue);
    restoreMode("rainDetectionMode", window.setRainDetectionMode);
    restoreValue("rainSensitivityValue", window.setRainSensitivityValue);
    restoreMode("fallingDetectionMode", window.setFallingDetectionMode);
    restoreValue("fallingSensitivityValue", window.setFallingSensitivityValue);
    restoreMode("breakingDetectionMode", window.setBreakingDetectionMode);
    restoreValue(
      "breakingSensitivityValue",
      window.setBreakingSensitivityValue
    );
    restoreMode("soundDetectionMode", window.setSoundDetectionMode);
    restoreValue(
      "volumeSliderSoundDetectionValue",
      window.setVolumeSliderSoundDetectionValue
    );
  }

  // Start loading includes synchronously
  loadIncludesSync();
});
