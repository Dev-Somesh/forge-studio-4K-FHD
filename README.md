# 🎨 Forge Studio: AI Neural Wallpaper Engine

[![Netlify Status](https://api.netlify.com/api/v1/badges/da666e65-cb95-4de4-86ab-04ba29598766/deploy-status)](https://app.netlify.com/projects/forgestudio/deploys)
[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://forgestudio.netlify.app/)
[![AI-Gemini](https://img.shields.io/badge/AI-Gemini%203%20Pro-purple.svg)](https://ai.google.dev/)

**Forge Studio** is a specialized **AI Neural Wallpaper Engine** designed for high-fidelity generative art. By orchestrating state-of-the-art **Gemini 2.5 Flash** and **Gemini 3 Pro Image** models, it synthesizes ultra-high-definition (4K) minimalist assets for modern workspaces.

### 🔗 [Launch Forge Studio](https://forgestudio.netlify.app/)

#### ⚡ Setup Phase

![Forge Studio Setup](./Public/1.%20Welcome%20Popup.png)

#### 🎨 Design Workspace

![Forge Studio Main UI](./Public/2.%20dashboard.png)

---

## 📂 Project Structure

- `/public`: Contains all static assets, community-shared screenshots, and neural reference benchmarks (`1.png`, `2.png`, `3.png`, `4.png`).
- `/src`: Core application logic and neural orchestration layer.

---

## ✨ Engine Features

### 💎 Precision Rendering

- **Native 4K Assets**: 3840 x 2160 pixels for pixel-perfect desktop clarity.
- **Dynamic Orientation**: Specialized layout logic for **16:9 Landscape** and **9:16 Portrait**.
- **Gemini 3 Pro Pipeline**: Access to high-tier neural cores for complex geometric synthesis.

### 🏛️ Neural Gallery

- **Reference Feed**: View masterwork presets stored in the `public/` folder.
- **Style Cloning**: Instantly replicate the parameters of a gallery asset to use as a starting point for your own 4K generation.

### 🧠 Identity Matrix & Fandom

- **Character Integration**: Stylized inclusion of Anime, Superhero, or Brand identities (Logo, Symbol, Silhouette).
- **Neural Synthesis**: A Creative Director mode where the engine invents original geometric architectures.
- **Pattern Capture**: Stored library for recurring neural geometric discoveries.

### 🎨 Material Architecture

- **Surface Architect**: Apply finishes like _Frosted Glass_, _Brushed Metal_, _Neon Glow_, and _Organic Matte_.
- **Chromatic Scale**: Curated palette of solids and luminal "Abyss" gradients.
- **Temporal History**: A real-time session tray for instant asset comparison and recovery.

---

## 🛠️ Technical Implementation

- **Core Engine**: React 19 (No-Build ESM Pattern)
- **Neural Interface**: `@google/genai` (Native Gemini SDK Integration)
- **Visual Framework**: Tailwind CSS
- **Persistence Layer**: Browser LocalStorage
- **Deployment**: Netlify-optimized with environment shims for stable global access.

---

## 🚀 Initialization

1. **Environmental Link**: Ensure `API_KEY` is present in your hosting environment.
2. **Core Selection**: Toggle between **FHD (Fast)** and **4K (Precision)** cores.
3. **Orchestration**: Select geometry, material finish, and optional identity nodes.
4. **Synthesis**: Activate the `RUN_ENGINE` command to generate your asset.

---

_Engineered with 🖤 for the Generative Design Community._
