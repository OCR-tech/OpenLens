// =========================================//
// Dynamically include HTML fragments and restore UI state from localStorage

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[include-html]").forEach(function (el) {
    const file = el.getAttribute("include-html");
    fetch(file)
      .then((response) => response.text())
      .then((data) => {
        el.innerHTML = data;

        // alert("HTML content loaded from " + file);

        // Attach handler after include
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

        // Helper to restore mode from localStorage
        function restoreMode(key, setter, fallback = "off") {
          const value = localStorage.getItem(key) || fallback;
          if (typeof setter === "function") setter(value);
        }
        function restoreValue(key, setter, fallback = 50) {
          const value = localStorage.getItem(key) || fallback;
          if (typeof setter === "function") setter(value);
        }

        // Restore all modes and values
        restoreMode("sourceMode", window.setSourceMode);
        restoreMode("mode", window.setMode);
        restoreMode("theme", window.setTheme, "light");
        restoreMode("voiceCommandMode", window.setVoiceCommandMode);
        restoreValue(
          "volumeSliderCommandValue",
          window.setVolumeSliderCommandValue
        );
        restoreMode("voiceAlertMode", window.setVoiceAlertMode);
        restoreValue(
          "volumeSliderAlertValue",
          window.setVolumeSliderAlertValue
        );
        restoreMode("voiceStatusMode", window.setVoiceStatusMode);
        restoreValue(
          "volumeSliderStatusValue",
          window.setVolumeSliderStatusValue
        );
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
        restoreValue(
          "fallingSensitivityValue",
          window.setFallingSensitivityValue
        );
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

        // Dispatch a custom event for further initialization if needed
        el.dispatchEvent(
          new CustomEvent("html-included", { detail: { file } })
        );
      })
      .catch((err) => {
        el.innerHTML = "<p>Failed to load content.</p>";
        console.error("Failed to load", file, err);
      });
  });
});
