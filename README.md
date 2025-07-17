# OpenLens: Web-Based Real-Time Object Detection

![JavaScript](https://img.shields.io/badge/javascript-ES6%2B-blue)
![Node.js](https://img.shields.io/badge/node.js-18%2B-blue)
![License](https://img.shields.io/badge/license-MIT-blue)
![Visitors](https://visitor-badge.laobi.icu/badge?page_id=OCR-tech.OpenLens)

**OpenLens** is a web-based application for real-time object detection and video analysis. It supports live camera input, IP streams from IP cameras and mobile phone cameras, and video files with customizable detection settings and an intuitive user interface.

<br/>
<p align="center">
<img src="app/img/img1a.png" style="width:65%; height:auto;">&emsp;
</p>

## Features

- **Real-Time Detection**: Detects objects in live video streams.
- **Bounding Boxes and Labels**: Overlays bounding boxes and labels on the detected objects.
- **Customizable Detection**: Configure detection for fire, motion, and more.
- **Modular Backend**: Node.js backend for stream management and API integration.
- **Voice Command Control**: Users can use voice commands to control the system.
- **Flexible Input**: Supports webcam, video files, IP cameras, and internet streams.
- **Intuitive User Interface**: Easy-to-use interface with help and tutorial components.

<!-- - **Adaptability**: Adapts to user preferences and improves based on input command history and environments. -->
<!-- - **Intuitive UI**: Includes help, tutorial, and menu components. -->
<!-- - **Source & Unit Selection**: Easily switch between video sources. -->
<!-- - **Help and Tutorial**: Provides help and tutorial components for user guidance. -->
<!-- - **Keyboard Shortcuts**: Allow quick access to key functionalities.
- **Object Selection**: Users can select target objects for detection.
- **Snapshot Saving**: Users can save snapshots of detected objects.
- **Sound Alerts**: The system generates sound alerts based on detection.
- **SMS Alert**: Sends an SMS alert when certain objects are detected.
- **Adaptability**: The system adapts to user preferences and improves based on input voice command history and environmental challenges. -->
<!-- - Select target objects.
- Save snapshots of detected objects.
- Generate sound alerts based on detection. -->

## Requirements

- **Node.js** >= 18
- **npm** >= 9
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Webcam access permission
- Localhost / remote HTTPS

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/OCR-tech/OpenLens.git
   cd OpenLens
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the backend server:
   ```sh
   node app/backend/server.js
   ```

<!-- 4. Open [index.html](index.html) in your browser. -->

## Usage

**Steps:**

- **Start Detection**: Click the "Start" button to begin real-time object detection.
- **Select Source**: Choose between webcam, video file, IP camera, or internet stream.
- **Configure Detection**: Use the UI to set detection parameters for fire, motion, and other objects.
- **View Results**: Detected objects will be highlighted in the video stream with bounding boxes and labels.

**Input sources:**

- **Webcam Input**: Use built-in webcam or external USB webcam.
- **IP Camera Input**: Connect to IP cameras or mobile devices.
- **Internet Video Streams**: Stream video from compatible URLs.
- **Video File Input**: Upload video files for detection.

**How to run:**

1. Open a terminal and navigate to `OpenLens`.
2. Run a local server: `node app/backend/server.js`.
3. Open your browser: `http://localhost:5500` or `http://<ip-address>:5500/`.

**Note**: For low-cost solutions, unused/broken screen mobile phones can be used as IP webcams.

## Customization

- **Target Object Settings**: Define which objects you want to detect.
- **Alert Settings**: Adjust sound alert thresholds and preferences.
- **Voice Command History**: Configure how the system adapts to voice command history.

<!-- Voice Commands:
| Voice Command        | Description                         |
| -------------------- | ----------------------------------- |
| Detect [Object Name] | Detect specific objects             |
| Stop [Object Name]   | Stop detecting specific objects     |
| Save [Object Name]   | Save a snapshot of detected objects |
| Help                 | List available commands             |
| Exit                 | Exit the program                    |

- "**Detect [Object Name]**": Detect specific objects (e.g., "Detect car").
- "**Stop [Object Name]**": Stop detecting specific objects (e.g., "Stop car").
- "**Save [Object Name]**": Save a snapshot of specific detected objects (e.g., "Save car").
- "**Help**": List available commands.
- "**Exit**": Exit the program.
- "**Detect**": Detect all objects in the model.
- "**Stop**": Stop detecting all objects.
- "**Alert**": Generate an alert sound when all objects are detected.
- "**Alert [Object Name]**": Generate an alert sound when specific objects are detected (e.g., "Alert person").
- "**Save**": Save a snapshot of all detected objects. -->

<!-- The system adapts to user preferences over time based on input voice command history, improving accuracy and user experience. -->

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **Email**: ocrtech.mail@gmail.com
- **Website**: [https://ocr-tech.github.io](https://ocr-tech.github.io)
- **GitHub**: [https://github.com/OCR-tech](https://github.com/OCR-tech)
