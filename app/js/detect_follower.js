// =========================================//
// FOLLOWER DETECTION FUNCTIONS

// Global variables for follower detection
window.followerDetectionEnabled = false;
window.followerSensitivity = 5;
window.trackedPersons = new Map(); // Store tracked persons with their movement history
window.followingPatterns = new Map(); // Store detected following patterns
window.followerAlertCooldown = new Map(); // Prevent spam alerts

// Configuration constants
const FOLLOWER_CONFIG = {
  MIN_TRACKING_FRAMES: 30, // Minimum frames to track before analyzing
  MAX_DISTANCE_THRESHOLD: 200, // Maximum distance to consider following (pixels)
  MIN_FOLLOWING_DURATION: 60, // Minimum frames of following behavior to trigger alert
  DIRECTION_SIMILARITY_THRESHOLD: 0.7, // Cosine similarity threshold for movement direction
  ALERT_COOLDOWN_FRAMES: 300, // Frames to wait before re-alerting about same follower pair
  POSITION_HISTORY_LENGTH: 50 // Number of position history points to keep
};

// =========================================//
function toggleFollowerDetection() {
  const followerSwitch = document.getElementById("follower-switch");
  const followerSensitivitySlider = document.getElementById("follower-sensitivity-slider");
  
  if (!followerSwitch) return;

  window.followerDetectionEnabled = followerSwitch.checked;
  followerSensitivitySlider.disabled = !followerSwitch.checked;

  // Reset tracking data when toggling
  if (window.followerDetectionEnabled) {
    window.trackedPersons.clear();
    window.followingPatterns.clear();
    window.followerAlertCooldown.clear();
    console.log("Follower detection enabled");
  } else {
    console.log("Follower detection disabled");
  }

  updateFollowerStatus("normal");
  
  // Save state to localStorage
  localStorage.setItem(
    "followerDetectionMode",
    followerSwitch.checked ? "on" : "off"
  );

  // Play voice status if enabled
  if (window.voiceStatusEnabled) {
    playVoiceStatus(
      "Follower Detection " + (followerSwitch.checked ? "On" : "Off")
    );
  }
}

// =========================================//
function setFollowerDetectionMode(mode) {
  const followerSwitch = document.getElementById("follower-switch");
  const followerSensitivitySlider = document.getElementById("follower-sensitivity-slider");
  
  if (followerSwitch) {
    followerSwitch.checked = mode === "on";
    followerSensitivitySlider.disabled = mode !== "on";
    window.followerDetectionEnabled = mode === "on";
  }
}

// =========================================//
function updateValueFollower(value) {
  window.followerSensitivity = parseInt(value);
  document.getElementById("follower-sensitivity-value").textContent = value;
  
  // Adjust detection thresholds based on sensitivity
  const sensitivityFactor = value / 5;
  FOLLOWER_CONFIG.MAX_DISTANCE_THRESHOLD = 200 / sensitivityFactor;
  FOLLOWER_CONFIG.MIN_FOLLOWING_DURATION = Math.max(30, 60 / sensitivityFactor);
  
  console.log(`Follower sensitivity set to ${value}`);
}

// =========================================//
function updateFollowerStatus(status) {
  const normalStatus = document.getElementById("follower-status-normal");
  const warnStatus = document.getElementById("follower-status-warn");
  const alertStatus = document.getElementById("follower-status-alert");
  
  if (!normalStatus || !warnStatus || !alertStatus) return;

  // Reset all status indicators
  normalStatus.style.backgroundColor = "#ccc";
  warnStatus.style.backgroundColor = "#ccc";
  alertStatus.style.backgroundColor = "#ccc";
  
  // Set active status
  switch (status) {
    case "normal":
      normalStatus.style.backgroundColor = "#28a745";
      break;
    case "warn":
      warnStatus.style.backgroundColor = "#ffc107";
      break;
    case "alert":
      alertStatus.style.backgroundColor = "#dc3545";
      break;
  }
}

// =========================================//
// Main follower detection function - call this with detected persons
function detectFollowers(detectedPersons, frameNumber = Date.now()) {
  if (!window.followerDetectionEnabled || !detectedPersons || detectedPersons.length < 2) {
    updateFollowerStatus("normal");
    return;
  }

  // Update tracked persons with new positions
  updateTrackedPersons(detectedPersons, frameNumber);
  
  // Analyze following patterns
  const followingDetected = analyzeFollowingPatterns(frameNumber);
  
  // Update UI status based on detection results
  if (followingDetected.alert) {
    updateFollowerStatus("alert");
    triggerFollowerAlert(followingDetected.pairs);
  } else if (followingDetected.warn) {
    updateFollowerStatus("warn");
  } else {
    updateFollowerStatus("normal");
  }
}

// =========================================//
function updateTrackedPersons(detectedPersons, frameNumber) {
  const currentPersons = new Map();
  
  // Match detected persons with existing tracked persons
  detectedPersons.forEach((person, index) => {
    const personId = findBestMatch(person, window.trackedPersons, frameNumber);
    const id = personId || `person_${index}_${frameNumber}`;
    
    if (!window.trackedPersons.has(id)) {
      window.trackedPersons.set(id, {
        id: id,
        positions: [],
        lastSeen: frameNumber,
        createdAt: frameNumber
      });
    }
    
    const trackedPerson = window.trackedPersons.get(id);
    trackedPerson.positions.push({
      x: person.bbox[0] + person.bbox[2] / 2, // center x
      y: person.bbox[1] + person.bbox[3] / 2, // center y
      frame: frameNumber,
      bbox: person.bbox
    });
    
    // Keep only recent position history
    if (trackedPerson.positions.length > FOLLOWER_CONFIG.POSITION_HISTORY_LENGTH) {
      trackedPerson.positions = trackedPerson.positions.slice(-FOLLOWER_CONFIG.POSITION_HISTORY_LENGTH);
    }
    
    trackedPerson.lastSeen = frameNumber;
    currentPersons.set(id, trackedPerson);
  });
  
  // Remove persons not seen for too long
  const staleThreshold = frameNumber - 150; // Remove if not seen for 150 frames
  for (const [id, person] of window.trackedPersons) {
    if (person.lastSeen < staleThreshold) {
      window.trackedPersons.delete(id);
    }
  }
}

// =========================================//
function findBestMatch(person, trackedPersons, frameNumber) {
  let bestMatch = null;
  let bestDistance = Infinity;
  
  const personCenterX = person.bbox[0] + person.bbox[2] / 2;
  const personCenterY = person.bbox[1] + person.bbox[3] / 2;
  
  for (const [id, trackedPerson] of trackedPersons) {
    if (trackedPerson.positions.length === 0) continue;
    
    const lastPos = trackedPerson.positions[trackedPerson.positions.length - 1];
    const distance = Math.sqrt(
      Math.pow(personCenterX - lastPos.x, 2) + 
      Math.pow(personCenterY - lastPos.y, 2)
    );
    
    // Only consider matches within reasonable distance and recent time
    if (distance < 100 && frameNumber - lastPos.frame < 30 && distance < bestDistance) {
      bestDistance = distance;
      bestMatch = id;
    }
  }
  
  return bestMatch;
}

// =========================================//
function analyzeFollowingPatterns(frameNumber) {
  let alertDetected = false;
  let warnDetected = false;
  const followingPairs = [];
  
  const persons = Array.from(window.trackedPersons.values())
    .filter(p => p.positions.length >= FOLLOWER_CONFIG.MIN_TRACKING_FRAMES);
  
  // Compare each pair of persons
  for (let i = 0; i < persons.length; i++) {
    for (let j = i + 1; j < persons.length; j++) {
      const person1 = persons[i];
      const person2 = persons[j];
      
      const followingResult = analyzePersonPair(person1, person2, frameNumber);
      
      if (followingResult.isFollowing) {
        const pairKey = `${person1.id}_${person2.id}`;
        
        if (!window.followingPatterns.has(pairKey)) {
          window.followingPatterns.set(pairKey, {
            startFrame: frameNumber,
            duration: 0,
            follower: followingResult.follower,
            target: followingResult.target
          });
        }
        
        const pattern = window.followingPatterns.get(pairKey);
        pattern.duration = frameNumber - pattern.startFrame;
        
        if (pattern.duration >= FOLLOWER_CONFIG.MIN_FOLLOWING_DURATION) {
          alertDetected = true;
          followingPairs.push({
            follower: pattern.follower,
            target: pattern.target,
            duration: pattern.duration
          });
        } else {
          warnDetected = true;
        }
      }
    }
  }
  
  // Clean up old patterns
  for (const [key, pattern] of window.followingPatterns) {
    if (frameNumber - pattern.startFrame > pattern.duration + 60) {
      window.followingPatterns.delete(key);
    }
  }
  
  return {
    alert: alertDetected,
    warn: warnDetected,
    pairs: followingPairs
  };
}

// =========================================//
function analyzePersonPair(person1, person2, frameNumber) {
  if (person1.positions.length < FOLLOWER_CONFIG.MIN_TRACKING_FRAMES ||
      person2.positions.length < FOLLOWER_CONFIG.MIN_TRACKING_FRAMES) {
    return { isFollowing: false };
  }
  
  // Get recent positions for analysis
  const recentFrames = Math.min(30, person1.positions.length, person2.positions.length);
  const pos1 = person1.positions.slice(-recentFrames);
  const pos2 = person2.positions.slice(-recentFrames);
  
  // Calculate movement vectors and distances
  let followingScore = 0;
  let validComparisons = 0;
  
  for (let i = 1; i < recentFrames; i++) {
    const dist = Math.sqrt(
      Math.pow(pos1[i].x - pos2[i].x, 2) + 
      Math.pow(pos1[i].y - pos2[i].y, 2)
    );
    
    if (dist > FOLLOWER_CONFIG.MAX_DISTANCE_THRESHOLD) continue;
    
    // Calculate movement vectors
    const vec1 = {
      x: pos1[i].x - pos1[i-1].x,
      y: pos1[i].y - pos1[i-1].y
    };
    
    const vec2 = {
      x: pos2[i].x - pos2[i-1].x,
      y: pos2[i].y - pos2[i-1].y
    };
    
    // Calculate direction similarity (cosine similarity)
    const similarity = calculateCosineSimilarity(vec1, vec2);
    
    if (similarity > FOLLOWER_CONFIG.DIRECTION_SIMILARITY_THRESHOLD) {
      followingScore++;
    }
    
    validComparisons++;
  }
  
  const followingRatio = validComparisons > 0 ? followingScore / validComparisons : 0;
  const isFollowing = followingRatio > 0.6; // 60% of movements should be similar
  
  if (isFollowing) {
    // Determine who is the follower (usually the one behind)
    const avgDist1 = calculateAverageDistance(pos1);
    const avgDist2 = calculateAverageDistance(pos2);
    
    return {
      isFollowing: true,
      follower: avgDist1 < avgDist2 ? person2.id : person1.id,
      target: avgDist1 < avgDist2 ? person1.id : person2.id,
      confidence: followingRatio
    };
  }
  
  return { isFollowing: false };
}

// =========================================//
function calculateCosineSimilarity(vec1, vec2) {
  const dot = vec1.x * vec2.x + vec1.y * vec2.y;
  const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  return dot / (mag1 * mag2);
}

// =========================================//
function calculateAverageDistance(positions) {
  if (positions.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 1; i < positions.length; i++) {
    totalDistance += Math.sqrt(
      Math.pow(positions[i].x - positions[i-1].x, 2) + 
      Math.pow(positions[i].y - positions[i-1].y, 2)
    );
  }
  
  return totalDistance / (positions.length - 1);
}

// =========================================//
function triggerFollowerAlert(followingPairs) {
  const currentTime = Date.now();
  
  followingPairs.forEach(pair => {
    const alertKey = `${pair.follower}_${pair.target}`;
    const lastAlert = window.followerAlertCooldown.get(alertKey) || 0;
    
    // Check cooldown to prevent spam
    if (currentTime - lastAlert > 5000) { // 5 second cooldown
      window.followerAlertCooldown.set(alertKey, currentTime);
      
      console.log(`FOLLOWER ALERT: ${pair.follower} is following ${pair.target}`);
      
      // Trigger existing alert mechanisms
      if (window.voiceAlertEnabled) {
        playVoiceAlert("Follower detected");
      }
      
      // Add to detected objects display
      const alertMessage = `Follower detected: Person following behavior`;
      updateDetectedObjectsDisplay(alertMessage);
      
      // Trigger notification if enabled
      if (window.notificationEnabled && 'Notification' in window) {
        new Notification('OpenLens Security Alert', {
          body: 'Follower behavior detected',
          icon: 'app/img/icon.png'
        });
      }
      
      // Email alert if enabled
      if (window.emailAlertEnabled) {
        sendEmailAlert(`Follower Alert: Suspicious following behavior detected at ${new Date().toLocaleString()}`);
      }
      
      // SMS alert if enabled  
      if (window.smsAlertEnabled) {
        sendSmsAlert(`OpenLens Alert: Follower detected at ${new Date().toLocaleString()}`);
      }
    }
  });
}

// =========================================//
function updateDetectedObjectsDisplay(message) {
  const objectsInput = document.getElementById("objects-input");
  const objAlertInput = document.getElementById("obj-alert-input");
  
  if (objectsInput) {
    const currentTime = new Date().toLocaleTimeString();
    objectsInput.value += `\n[${currentTime}] ${message}`;
    objectsInput.scrollTop = objectsInput.scrollHeight;
  }
  
  if (objAlertInput) {
    objAlertInput.value = message;
  }
}

// =========================================//
// Initialize follower detection settings on page load
function initializeFollowerDetection() {
  const savedMode = localStorage.getItem("followerDetectionMode");
  if (savedMode) {
    setFollowerDetectionMode(savedMode);
  }
  
  const savedSensitivity = localStorage.getItem("followerSensitivity");
  if (savedSensitivity) {
    const slider = document.getElementById("follower-sensitivity-slider");
    if (slider) {
      slider.value = savedSensitivity;
      updateValueFollower(savedSensitivity);
    }
  }
  
  console.log("Follower detection initialized");
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFollowerDetection);
} else {
  initializeFollowerDetection();
}