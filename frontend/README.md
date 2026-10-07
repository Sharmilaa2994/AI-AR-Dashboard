# AI-Powered AR Dashboard with Computer Vision and Gesture-Based Interaction

An interactive Augmented Reality (AR) dashboard that uses computer vision, real-time hand tracking, gesture recognition, virtual cursor interaction, and object detection to create a touchless user interface.

The system uses a standard webcam as the input device and translates hand movements and gestures into dashboard actions. The architecture is designed to support future integration with advanced AR displays, haptic interfaces, and spatial-computing hardware.

---

##  Project Overview

Traditional dashboards rely on physical input devices such as a mouse, keyboard, or touchscreen.

This project explores a touchless alternative by combining:

- Computer Vision
- Hand Landmark Detection
- Gesture Recognition
- Virtual Cursor Control
- Object Detection
- Real-Time Interaction Processing
- AR-style HUD Visualization
- Performance Monitoring

The webcam captures the user's hand movements, the computer vision pipeline detects hand landmarks, and the gesture engine converts those movements into meaningful interaction commands.

---

## Objectives

The main objectives of this project are:

1. Develop a real-time computer vision based interaction system.
2. Track human hand movements using MediaPipe.
3. Recognize predefined hand gestures.
4. Convert gestures into dashboard actions.
5. Implement a virtual cursor controlled by the index finger.
6. Integrate object detection into the AR workspace.
7. Provide real-time visual feedback through an AR HUD.
8. Monitor computer vision pipeline performance.
9. Maintain a modular architecture for future hardware integration.

---

## Key Features

###  Real-Time Hand Tracking

The system detects and tracks hand landmarks using MediaPipe Hand Landmarker.

The detected hand contains 21 landmarks representing important points of the hand.

---

###  Gesture Recognition

The gesture engine recognizes hand configurations and converts them into interaction commands.

| Gesture | Action |
|---|---|
| Point | Move Virtual Cursor |
| Pinch | Select / Click |
| Open Palm | Show / Reset Dashboard |
| Two Finger | Navigate |
| Fist | Cancel / Close |
| Unknown | No Action |

---

###  Virtual Cursor

The index finger can act as a virtual cursor.

When the user performs the `POINT` gesture:

```text
Hand Movement
      ↓
Index Finger Tracking
      ↓
Screen Coordinate Mapping
      ↓
Virtual Cursor
      ↓
Dashboard Interaction