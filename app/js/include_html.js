// =========================================//
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[include-html]").forEach(function (el) {
    const file = el.getAttribute("include-html");
    fetch(file)
      .then((response) => response.text())
      .then((data) => {
        el.innerHTML = data;

        //==========================================//
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

        //==========================================//
        // source mode
        const sourceMode = localStorage.getItem("sourceMode") || "off";
        if (typeof setSourceMode === "function") setSourceMode(sourceMode);

        //==========================================//
        // mode
        const modeMode = localStorage.getItem("mode") || "off";
        if (typeof setMode === "function") setMode(modeMode);

        //==========================================//
        // theme mode
        const savedTheme = localStorage.getItem("theme") || "light";
        if (typeof setTheme === "function") setTheme(savedTheme);

        //==========================================//
        // voice command
        const voiceCommandMode =
          localStorage.getItem("voiceCommandMode") || "off";
        if (typeof setVoiceCommandMode === "function")
          setVoiceCommandMode(voiceCommandMode);

        const volumeSliderCommandValue =
          localStorage.getItem("volumeSliderCommandValue") || 50;
        if (typeof setVolumeSliderCommandValue === "function")
          setVolumeSliderCommandValue(volumeSliderCommandValue);

        //==========================================//
        // voice alert
        const voiceAlertMode = localStorage.getItem("voiceAlertMode") || "off";
        if (typeof setVoiceAlertMode === "function")
          setVoiceAlertMode(voiceAlertMode);

        const volumeSliderAlertValue =
          localStorage.getItem("volumeSliderAlertValue") || 50;
        if (typeof setVolumeSliderAlertValue === "function")
          setVolumeSliderAlertValue(volumeSliderAlertValue);

        //==========================================//
        // voice status
        const voiceStatusMode =
          localStorage.getItem("voiceStatusMode") || "off";
        if (typeof setVoiceStatusMode === "function")
          setVoiceStatusMode(voiceStatusMode);

        const volumeSliderStatusValue =
          localStorage.getItem("volumeSliderStatusValue") || 50;
        if (typeof setVolumeSliderStatusValue === "function")
          setVolumeSliderStatusValue(volumeSliderStatusValue);

        //==========================================//
        // Datetime mode
        const datetimeMode = localStorage.getItem("datetimeMode") || "off";
        if (typeof setDatetimeMode === "function")
          setDatetimeMode(datetimeMode);

        //==========================================//
        // GPS Location mode
        const gpsLocationMode =
          localStorage.getItem("gpsLocationMode") || "off";
        if (typeof setGPSLocationMode === "function")
          setGPSLocationMode(gpsLocationMode);

        //==========================================//
        // Video Size mode
        const videoSizeMode =
          localStorage.getItem("videoSizeMode") || "default";
        if (typeof setVideoSizeMode === "function")
          setVideoSizeMode(videoSizeMode);

        //==========================================//
        // Framerate mode
        const framerateMode =
          localStorage.getItem("framerateMode") || "default";
        if (typeof setFramerateMode === "function")
          setFramerateMode(framerateMode);

        //==========================================//
        // Notification mode
        const notificationMode =
          localStorage.getItem("notificationMode") || "off";
        if (typeof setNotificationMode === "function")
          setNotificationMode(notificationMode);

        //==========================================//
        // Motion Detection mode
        const motionDetectionMode =
          localStorage.getItem("motionDetectionMode") || "off";
        if (typeof setMotionDetectionMode === "function")
          setMotionDetectionMode(motionDetectionMode);

        const volumeSliderMotionDetectionValue =
          localStorage.getItem("volumeSliderMotionDetectionValue") || 50;
        if (typeof setVolumeSliderMotionDetectionValue === "function")
          setVolumeSliderMotionDetectionValue(volumeSliderMotionDetectionValue);

        //==========================================//
        // Sound Detection mode
        const soundDetectionMode =
          localStorage.getItem("soundDetectionMode") || "off";
        if (typeof setSoundDetectionMode === "function")
          setSoundDetectionMode(soundDetectionMode);

        const volumeSliderSoundDetectionValue =
          localStorage.getItem("volumeSliderSoundDetectionValue") || 50;
        if (typeof setVolumeSliderSoundDetectionValue === "function")
          setVolumeSliderSoundDetectionValue(volumeSliderSoundDetectionValue);

        //==========================================//
        // Smoke Detection mode
        const smokeDetectionMode =
          localStorage.getItem("smokeDetectionMode") || "off";
        if (typeof setSmokeDetectionMode === "function")
          setSmokeDetectionMode(smokeDetectionMode);

        const smokeSensitivityValue =
          localStorage.getItem("smokeSensitivityValue") || 50;
        if (typeof setSmokeSensitivityValue === "function")
          setSmokeSensitivityValue(smokeSensitivityValue);

        //==========================================//
        // Fire Detection mode
        const fireDetectionMode =
          localStorage.getItem("fireDetectionMode") || "off";
        if (typeof setFireDetectionMode === "function")
          setFireDetectionMode(fireDetectionMode);

        const fireSensitivityValue =
          localStorage.getItem("fireSensitivityValue") || 50;
        if (typeof setFireSensitivityValue === "function")
          setFireSensitivityValue(fireSensitivityValue);

        //==========================================//
        // Flood Detection mode
        const floodDetectionMode =
          localStorage.getItem("floodDetectionMode") || "off";
        if (typeof setFloodDetectionMode === "function")
          setFloodDetectionMode(floodDetectionMode);

        const floodSensitivityValue =
          localStorage.getItem("floodSensitivityValue") || 50;
        if (typeof setFloodSensitivityValue === "function")
          setFloodSensitivityValue(floodSensitivityValue);

        //==========================================//
        // Light Detection mode
        const lightDetectionMode =
          localStorage.getItem("lightDetectionMode") || "off";
        if (typeof setLightDetectionMode === "function")
          setLightDetectionMode(lightDetectionMode);

        const lightSensitivityValue =
          localStorage.getItem("lightSensitivityValue") || 50;
        if (typeof setLightSensitivityValue === "function")
          setLightSensitivityValue(lightSensitivityValue);

        //==========================================//

        //==========================================//

        //==========================================//

        //==========================================//

        //==========================================//
      })
      .catch(() => {
        el.innerHTML = "<p>Failed to load content.</p>";
      });
  });
});
