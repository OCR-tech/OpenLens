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
          const dropdown = document.getElementById("language-dropdown");
          if (!dropdown) return;

          // Get the container for the checkboxes
          const optionsBox = document.querySelector(
            "#language-dropdown .multi-options-box"
          );

          // Clear existing options (optional)
          optionsBox.innerHTML = "";

          // Loop through the array and add checkboxes
          languages.forEach((lang) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" value="${lang.value}" id="${lang.value}-checkbox" /> ${lang.label}`;
            optionsBox.appendChild(label);
          });

          // Only add the document click handler once
          if (!window.languageDropdownClickHandlerAdded) {
            document.addEventListener("click", function (e) {
              const dropdown = document.getElementById("language-dropdown");
              if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
              }
            });
            window.languageDropdownClickHandlerAdded = true;
          }
        }

        // ==========================================//
        // Only run this block for object.html includes
        if (file.endsWith("object.html")) {
          const dropdown = document.getElementById("object-dropdown");
          if (!dropdown) return;

          // Get the container for the checkboxes
          const optionsBox = document.querySelector(
            "#object-dropdown .multi-options-box"
          );

          // Clear existing options (optional)
          optionsBox.innerHTML = "";

          // Loop through the object and add checkboxes
          Object.entries(objects).forEach(([key, obj]) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" value="${key}" id="${key}-checkbox" /> ${obj.label}`;
            optionsBox.appendChild(label);
          });

          // Set all checkboxes as default checked
          const checkboxes = document.querySelectorAll(
            "#object-dropdown input[type='checkbox']"
          );
          checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
          });

          // Only add the document click handler once
          if (!window.objectDropdownClickHandlerAdded) {
            document.addEventListener("click", function (e) {
              const dropdown = document.getElementById("object-dropdown");
              if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove("open");
              }
            });
            window.objectDropdownClickHandlerAdded = true;
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
    restoreMode("gradeDetectionMode", window.setGradeDetectionMode);
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
