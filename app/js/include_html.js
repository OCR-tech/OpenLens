// =========================================//
// Dynamically include all HTML fragments and restore UI state from localStorage

document.addEventListener("DOMContentLoaded", async function () {
  const includes = Array.from(document.querySelectorAll("[include-html]"));

  // Load all files in parallel
  await Promise.all(
    includes.map(async (el) => {
      const file = el.getAttribute("include-html");
      try {
        alert("Loading include file: " + file);

        const response = await fetch(file);
        const data = await response.text();
        el.innerHTML = data;

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
      } catch (err) {
        el.innerHTML = "<p>Failed to load content.</p>";
        console.error("Failed to load", file, err);
      }
    })
  );

  // Restore all modes and values after all includes are loaded
  function restoreMode(key, setter, fallback = "off") {
    const value = localStorage.getItem(key) || fallback;
    if (typeof setter === "function") setter(value);
  }
  function restoreValue(key, setter, fallback = 50) {
    const value = localStorage.getItem(key) || fallback;
    if (typeof setter === "function") setter(value);
  }

  restoreMode("sourceMode", window.setSourceMode);
  restoreMode("mode", window.setMode);
  restoreMode("theme", window.setTheme, "light");
  restoreMode("voiceCommandMode", window.setVoiceCommandMode);
  restoreValue("volumeSliderCommandValue", window.setVolumeSliderCommandValue);
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
  restoreValue("breakingSensitivityValue", window.setBreakingSensitivityValue);
  restoreMode("soundDetectionMode", window.setSoundDetectionMode);
  restoreValue(
    "volumeSliderSoundDetectionValue",
    window.setVolumeSliderSoundDetectionValue
  );

  // Dispatch a custom event for further initialization if needed
  includes.forEach((el) => {
    el.dispatchEvent(
      new CustomEvent("html-included", {
        detail: { file: el.getAttribute("include-html") },
      })
    );
  });
});
