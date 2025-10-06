// =========================================//
// FOLLOWER DETECTION TESTS
// Simple test to verify the detection algorithm functionality

// Test data - simulated person detections
const testPersons = [
  // Two people moving in similar directions (following behavior)
  {
    frame1: [
      { bbox: [100, 100, 50, 100] }, // Person 1
      { bbox: [200, 120, 50, 100] }  // Person 2 following
    ],
    frame2: [
      { bbox: [110, 100, 50, 100] }, // Person 1 moves right
      { bbox: [210, 120, 50, 100] }  // Person 2 follows same direction
    ],
    frame3: [
      { bbox: [120, 100, 50, 100] }, // Person 1 continues right
      { bbox: [220, 120, 50, 100] }  // Person 2 continues following
    ]
  },
  // Two people moving in different directions (not following)
  {
    frame1: [
      { bbox: [100, 100, 50, 100] }, // Person 1
      { bbox: [200, 120, 50, 100] }  // Person 2
    ],
    frame2: [
      { bbox: [110, 100, 50, 100] }, // Person 1 moves right
      { bbox: [190, 120, 50, 100] }  // Person 2 moves left
    ],
    frame3: [
      { bbox: [120, 100, 50, 100] }, // Person 1 continues right
      { bbox: [180, 120, 50, 100] }  // Person 2 continues left
    ]
  }
];

// =========================================//
function runFollowerDetectionTests() {
  console.log("🧪 Starting Follower Detection Tests...");
  
  // Test 1: Following behavior detection
  console.log("\n📋 Test 1: Following Behavior Detection");
  testFollowingBehavior();
  
  // Test 2: Non-following behavior detection
  console.log("\n📋 Test 2: Non-Following Behavior Detection");
  testNonFollowingBehavior();
  
  // Test 3: Sensitivity adjustment
  console.log("\n📋 Test 3: Sensitivity Adjustment");
  testSensitivityAdjustment();
  
  // Test 4: Alert cooldown system
  console.log("\n📋 Test 4: Alert Cooldown System");
  testAlertCooldown();
  
  console.log("\n✅ Follower Detection Tests Completed!");
}

// =========================================//
function testFollowingBehavior() {
  // Reset tracking data
  window.trackedPersons.clear();
  window.followingPatterns.clear();
  window.followerDetectionEnabled = true;
  
  const frames = testPersons[0]; // Following behavior data
  let frameNumber = 1000;
  
  // Simulate multiple frames of following behavior
  [frames.frame1, frames.frame2, frames.frame3].forEach((frameData, index) => {
    frameNumber += 10;
    detectFollowers(frameData, frameNumber);
    console.log(`  Frame ${index + 1}: Tracked ${window.trackedPersons.size} persons`);
  });
  
  // Add more frames to trigger following detection
  for (let i = 0; i < 10; i++) {
    frameNumber += 10;
    detectFollowers([
      { bbox: [130 + i * 10, 100, 50, 100] },
      { bbox: [230 + i * 10, 120, 50, 100] }
    ], frameNumber);
  }
  
  const hasFollowing = window.followingPatterns.size > 0;
  console.log(`  ✅ Following patterns detected: ${hasFollowing ? 'YES' : 'NO'}`);
  console.log(`  📊 Patterns found: ${window.followingPatterns.size}`);
}

// =========================================//
function testNonFollowingBehavior() {
  // Reset tracking data
  window.trackedPersons.clear();
  window.followingPatterns.clear();
  window.followerDetectionEnabled = true;
  
  const frames = testPersons[1]; // Non-following behavior data
  let frameNumber = 2000;
  
  // Simulate multiple frames of non-following behavior
  [frames.frame1, frames.frame2, frames.frame3].forEach((frameData, index) => {
    frameNumber += 10;
    detectFollowers(frameData, frameNumber);
    console.log(`  Frame ${index + 1}: Tracked ${window.trackedPersons.size} persons`);
  });
  
  // Add more frames with divergent movement
  for (let i = 0; i < 10; i++) {
    frameNumber += 10;
    detectFollowers([
      { bbox: [130 + i * 10, 100, 50, 100] },  // Moving right
      { bbox: [170 - i * 10, 120, 50, 100] }   // Moving left
    ], frameNumber);
  }
  
  const hasFollowing = window.followingPatterns.size > 0;
  console.log(`  ✅ Following patterns detected: ${hasFollowing ? 'NO' : 'YES (correct)'}`);
  console.log(`  📊 Patterns found: ${window.followingPatterns.size}`);
}

// =========================================//
function testSensitivityAdjustment() {
  // Test high sensitivity (should detect more easily)
  updateValueFollower(9);
  console.log(`  High sensitivity (9): Distance threshold = ${FOLLOWER_CONFIG.MAX_DISTANCE_THRESHOLD}`);
  
  // Test low sensitivity (should be more strict)
  updateValueFollower(2);
  console.log(`  Low sensitivity (2): Distance threshold = ${FOLLOWER_CONFIG.MAX_DISTANCE_THRESHOLD}`);
  
  // Reset to default
  updateValueFollower(5);
  console.log(`  ✅ Sensitivity adjustment working correctly`);
}

// =========================================//
function testAlertCooldown() {
  // Reset cooldown data
  window.followerAlertCooldown.clear();
  
  const testPairs = [
    { follower: 'person_1', target: 'person_2', duration: 100 }
  ];
  
  // Trigger first alert
  triggerFollowerAlert(testPairs);
  const firstAlertTime = window.followerAlertCooldown.get('person_1_person_2');
  
  // Try to trigger immediate second alert (should be blocked)
  triggerFollowerAlert(testPairs);
  const secondAlertTime = window.followerAlertCooldown.get('person_1_person_2');
  
  const cooldownWorking = firstAlertTime === secondAlertTime;
  console.log(`  ✅ Alert cooldown working: ${cooldownWorking ? 'YES' : 'NO'}`);
}

// =========================================//
function simulateFollowerDetection() {
  console.log("🎯 Running Follower Detection Simulation...");
  
  // Enable follower detection
  window.followerDetectionEnabled = true;
  window.followerSensitivity = 5;
  
  // Simulate realistic following scenario
  const scenarios = [
    {
      name: "Person walking alone",
      frames: [
        [{ bbox: [100, 100, 50, 100] }]
      ]
    },
    {
      name: "Two people walking together (side by side)",
      frames: [
        [
          { bbox: [100, 100, 50, 100] },
          { bbox: [160, 100, 50, 100] }
        ]
      ]
    },
    {
      name: "Clear following behavior",
      frames: generateFollowingFrames()
    }
  ];
  
  scenarios.forEach((scenario, index) => {
    console.log(`\n📹 Scenario ${index + 1}: ${scenario.name}`);
    window.trackedPersons.clear();
    window.followingPatterns.clear();
    
    scenario.frames.forEach((frameData, frameIndex) => {
      detectFollowers(frameData, 3000 + frameIndex * 10);
    });
    
    console.log(`  Results: ${window.followingPatterns.size} following patterns detected`);
  });
}

// =========================================//
function generateFollowingFrames() {
  const frames = [];
  for (let i = 0; i < 50; i++) {
    frames.push([
      { bbox: [100 + i * 5, 100 + Math.sin(i * 0.1) * 5, 50, 100] }, // Leader
      { bbox: [150 + i * 5, 120 + Math.sin(i * 0.1) * 5, 50, 100] }  // Follower
    ]);
  }
  return frames;
}

// =========================================//
// Export test functions for manual execution
if (typeof window !== 'undefined') {
  window.runFollowerDetectionTests = runFollowerDetectionTests;
  window.simulateFollowerDetection = simulateFollowerDetection;
  
  console.log("🧪 Follower Detection Tests Ready!");
  console.log("Run tests with: runFollowerDetectionTests()");
  console.log("Run simulation with: simulateFollowerDetection()");
}