# 🚆 RAILPULSE AI — Smart Railway Control & Real-Time AI Delay Prediction System

> **Smart India Hackathon (SIH) Prototype**  
> An AI-driven Railway Operations Control Dashboard featuring live train GIS tracking on Leaflet / OpenStreetMap, real-time delay probability forecasting, root-cause bottleneck diagnostics, and an interactive "What-If" Dispatch Decision Support System (CDSS).

---

## 🌟 Key Highlights & Features

### 1. 🗺️ Live GIS Fleet Tracking (Leaflet + OpenStreetMap)
- **High-Performance Map**: Renders major Indian Railway corridors (Delhi–Mumbai Golden Corridor, Delhi–Howrah Main Trunk, Grand Trunk, Dedicated Freight Corridor) without paid API keys.
- **Dynamic Train Telemetry**: Animated SVG locomotive markers with real-time speed, live heading orientation, and delay status halos (Green = On Time, Amber = Minor Delay, Red = High Risk, Slate = Freight).
- **Interactive Stations**: Junction nodes displaying platform saturation and dwell counters.
- **Full Route Highlighting**: Click on any train to inspect past trajectory, current block section, and AI predicted route.

### 2. 🤖 AI Delay Prediction & Risk Engine
- **Accurate Model Inference**: Multi-factor breakdown analyzing signal/block congestion, station dwell overruns, trailing freight proximity, speed restrictions (PSR), and weather impact.
- **Card Telemetry View**:
  ```
  TRAIN 12951
  Mumbai → Delhi

  Current Location: Ratlam Junction
  Next Station: Kota Junction

  Scheduled Arrival: 21:35
  AI Predicted Arrival: 22:04

  Delay: +29 min
  Confidence: 91%

  Delay Risk:
  ████████░░ HIGH
  ```

### 3. ⚡ "What-If" Controller Decision Support Sandbox (CDSS)
- Empowers railway section controllers to simulate dispatch interventions:
  - *Precedence Holding* (e.g. Hold Freight 70412 at Ramganj Mandi Loop)
  - *Platform Swapping* (e.g. Pre-allocate PF-3 at Kota Jn)
  - *Dynamic Speed Recovery* (e.g. Authorize MPS 130 km/h acceleration)
- Projects net minutes recovered and provides 1-click execution to section controllers.

### 4. 📊 Analytics & Heatmap Suite (Recharts)
- Station dwell overrun vs arrival delay curves
- On-time performance by train category (Vande Bharat vs Rajdhani vs Superfast vs Freight)
- Critical junction bottleneck congestion ranking (Kota Jn, DDU, Kanpur Central, Ratlam Jn)
- 24-hour diurnal delay surge trend and actual vs AI residual error validation table.

### 5. 🚨 Real-Time Safety & Operational Alert Center
- Conflict alerts, headway infractions, and auto-mitigation workflows with audio chimes.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v24 LTS recommended)
- npm

### Run Development Server
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:5173` (or the URL displayed in the terminal).

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Tactical Dark Theme
- **Mapping**: Leaflet.js + React-Leaflet + OpenStreetMap CartoDB Tiles
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **Animations & Effects**: Canvas-Confetti & Web Audio API synthesizer
