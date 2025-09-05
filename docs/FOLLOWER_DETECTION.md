# Follower Detection Feature

## Overview

The Follower Detection feature is a new addition to OpenLens that analyzes video feeds to detect when people are exhibiting following behavior patterns. This feature enhances security monitoring by identifying potential surveillance or stalking activities.

## Features

### User Interface
- **Toggle Control**: Enable/disable follower detection with a simple checkbox
- **Sensitivity Slider**: Adjustable sensitivity from 0-10 to fine-tune detection thresholds
- **Status Indicators**: Visual status display with green (normal), yellow (warning), and red (alert) states
- **Settings Persistence**: Settings are automatically saved to browser localStorage

### Detection Algorithm
- **Multi-Person Tracking**: Tracks multiple people simultaneously across video frames
- **Movement Pattern Analysis**: Uses cosine similarity to compare movement directions
- **Following Behavior Detection**: Identifies when people move in similar patterns within proximity
- **Configurable Thresholds**: Sensitivity controls adjust distance, duration, and similarity requirements

### Alert System
- **Integrated Alerts**: Works with existing SMS, email, Line notification systems
- **Voice Alerts**: Optional voice notifications when following is detected
- **Browser Notifications**: Desktop notifications for immediate awareness
- **Alert Cooldown**: Prevents spam alerts with configurable cooldown periods

## How It Works

### Detection Process
1. **Person Detection**: Identifies people in the video feed using existing object detection
2. **Position Tracking**: Tracks each person's position and movement over time
3. **Pattern Analysis**: Compares movement vectors between people using mathematical algorithms
4. **Following Detection**: Identifies sustained similar movement patterns
5. **Alert Triggering**: Activates alerts when following behavior exceeds thresholds

### Algorithm Details
- **Minimum Tracking Frames**: 30 frames before analysis begins
- **Maximum Distance**: 200 pixels (adjustable by sensitivity)
- **Minimum Following Duration**: 60 frames (adjustable by sensitivity)
- **Direction Similarity**: 70% cosine similarity threshold
- **Position History**: Maintains 50 recent position points per person

### Sensitivity Settings
- **High Sensitivity (8-10)**: Detects following behavior more easily, shorter distances
- **Medium Sensitivity (4-7)**: Balanced detection with reasonable thresholds
- **Low Sensitivity (1-3)**: Only detects very obvious following behavior

## Usage

### Basic Setup
1. Navigate to the "Detect" section in OpenLens
2. Scroll down to find "Follower Detection"
3. Enable the toggle switch
4. Adjust sensitivity as needed (default: 5)

### Configuration
- **Sensitivity**: Higher values are more sensitive to following behavior
- **Status Monitoring**: Watch the status indicators for real-time feedback
- **Alert Integration**: Enable SMS/email alerts in Settings for notifications

### Testing
The feature includes built-in tests that can be run in the browser console:
```javascript
// Run comprehensive tests
runFollowerDetectionTests();

// Run simulation scenarios
simulateFollowerDetection();
```

## Technical Implementation

### Files Added/Modified
- `app/js/detect_follower.js` - Main follower detection logic
- `app/js/detect_follower_test.js` - Test suite for validation
- `app/pages/detect.html` - UI components added
- `app/js/detect_loop.js` - Integration with main detection loop
- `index.html` - Script includes added

### Integration Points
- **Object Detection**: Hooks into existing person detection from COCO-SSD model
- **Alert System**: Uses existing notification infrastructure
- **UI Framework**: Follows existing design patterns and styling
- **Settings Storage**: Integrates with localStorage system

### Performance Considerations
- **Efficient Tracking**: Only processes person objects, not all detections
- **Memory Management**: Limits position history to prevent memory leaks
- **Optimized Calculations**: Uses efficient mathematical operations
- **Alert Throttling**: Prevents excessive notifications

## Configuration Constants

```javascript
const FOLLOWER_CONFIG = {
  MIN_TRACKING_FRAMES: 30,        // Frames before analysis
  MAX_DISTANCE_THRESHOLD: 200,    // Max following distance (pixels)
  MIN_FOLLOWING_DURATION: 60,     // Min frames to trigger alert
  DIRECTION_SIMILARITY_THRESHOLD: 0.7, // Movement similarity
  ALERT_COOLDOWN_FRAMES: 300,     // Cooldown between alerts
  POSITION_HISTORY_LENGTH: 50     // Position history size
};
```

## Future Enhancements

### Potential Improvements
- **Advanced ML Models**: Integration with pose detection for better accuracy
- **Multiple Following Types**: Detection of different following patterns
- **Historical Analysis**: Long-term pattern recognition
- **Crowd Analysis**: Group behavior detection
- **Privacy Features**: Anonymization options

### API Integration
- **External Alerts**: Integration with security systems
- **Data Export**: CSV/JSON export of detection events
- **Real-time Streaming**: WebSocket support for live monitoring
- **Mobile Notifications**: Push notifications to mobile devices

## Troubleshooting

### Common Issues
- **No Detection**: Ensure object detection is enabled and working
- **False Positives**: Reduce sensitivity or adjust thresholds
- **Performance**: Reduce video resolution if experiencing lag
- **Alerts Not Working**: Check alert settings in main Settings panel

### Browser Requirements
- **Modern Browser**: Chrome, Firefox, Safari, or Edge
- **JavaScript Enabled**: Required for all functionality
- **Local Storage**: For settings persistence
- **Webcam/Video Access**: For detection to function

## Security and Privacy

### Privacy Considerations
- **Local Processing**: All detection happens locally in the browser
- **No Data Upload**: Video data is not transmitted externally
- **Settings Privacy**: User preferences stored locally only
- **Alert Discretion**: Users control all notification settings

### Security Features
- **Real-time Detection**: Immediate identification of following behavior
- **Multiple Alert Channels**: Redundant notification systems
- **Configurable Sensitivity**: Adaptable to different security needs
- **False Positive Prevention**: Sophisticated algorithms reduce false alarms

---

**Note**: This feature requires the OpenLens object detection system to be functional and properly configured. Ensure your camera and detection models are working before enabling follower detection.