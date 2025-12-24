# 🎨 Forge Studio: Neural Wallpaper Engine

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Gemini 3 Pro](https://img.shields.io/badge/AI-Gemini%203%20Pro-purple.svg)](https://ai.google.dev/)

**Forge Studio** is a professional-grade generative design dashboard built for the modern creator. It leverages Google's state-of-the-art **Gemini 2.5 Flash** and **Gemini 3 Pro Image** models to synthesize ultra-high-fidelity (4K) minimalist wallpapers.

Beyond simple prompt engineering, Forge Studio implements **Neural Synthesis**—an intelligent orchestration layer that invents original structural patterns, architectural geometries, and sophisticated typographic compositions.

---

## ✨ Key Features

### 💎 Precision & Resolution
- **Native 4K Assets**: Generates true 3840 x 2160 pixels for crystal-clear desktop displays.
- **Orientation Switching**: Intelligent composition logic for both **Landscape (16:9)** and **Portrait (9:16)**.
- **Pro Pipeline**: Integrates `gemini-3-pro-image-preview` for high-quality, complex rendering tasks.

### 🧠 Generative Intelligence
- **Neural Synthesis**: A "surprise me" mode where the AI acts as a Creative Director, inventing brand-new structural patterns.
- **Pattern Capture**: Found a pattern the AI invented? Save it to your local **Matrix Library** for future reuse.
- **Linguistic Alignment**: AI-driven quote generation that ensures motivational text matches the visual mood.

### 🎨 Design Controls
- **Material Architect**: Apply physical finishes like *Frosted Glass*, *Brushed Metal*, *Neon Glow*, and *Organic Matte*.
- **Chromatic Scale**: A curated palette of "Nero" solids and luminal "Abyss" gradients.
- **Temporal History**: A session-based history tray to track, compare, and recover your best generations.

---

## 🛠️ Tech Stack

- **Core**: React 19 (Modern Functional Components)
- **AI Integration**: `@google/genai` (Native Gemini SDK)
- **Styling**: Tailwind CSS (Minimalist Cyberpunk Aesthetic)
- **Persistence**: LocalStorage (Pattern Library & Session State)
- **Engine**: Gemini 2.5 Flash (FHD) / Gemini 3 Pro (4K)

---

## 🚀 Getting Started

### Prerequisites
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/)).
- To use **4K Mode**, ensure you have a billing-enabled project to access Gemini 3 Pro.

### Quick Start
1. **Initialize Engine**: Link your API key via the "System_Configuration" (⚙️).
2. **Select Matrix**: Choose a base Geometry Pattern (e.g., *Fluid Topo* or *Origami Folds*).
3. **Set Finish**: Choose a surface material (e.g., *Neon Glow* for vibrant results).
4. **Choose Resolution**: Toggle between **FHD** (Fast) and **4K** (High Fidelity).
5. **Synthesize**: Hit `START_SYNTHESIS` and watch the neural network build your asset.

---

## 📂 Project Structure

```text
.
├── App.tsx           # Main Dashboard Logic & AI Orchestration
├── constants.tsx     # Theme, Pattern, and Font definitions
├── types.ts          # TypeScript interfaces for the design system
├── index.tsx         # React DOM Entry point
├── index.html        # Main container with Tailwind & ESM imports
└── metadata.json     # App manifest & permissions
```

---

## 📝 Configuration Note

Forge Studio is designed with an **"Identity-First"** security model for API keys.
- **FHD Mode**: Uses the environment-provided key for rapid prototyping.
- **4K Pro Mode**: Requires an explicit user-selected key via the Google AI Studio OAuth dialog to ensure secure usage of high-tier models.

---

## 🤝 Contributing

We welcome contributions to the **Forge Studio** project! Whether it's adding new material finishes, geometry patterns, or enhancing the AI orchestration logic, feel free to open a Pull Request.

---

*Engineered with 🖤 for the Design Community.*
