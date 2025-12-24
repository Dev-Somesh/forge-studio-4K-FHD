import React, { useState, useEffect } from "react";

import {
  WALLPAPER_THEMES,
  WALLPAPER_PATTERNS,
  WALLPAPER_FONTS,
} from "./constants.tsx";
import {
  WallpaperTheme,
  WallpaperPattern,
  GenerationState,
  MaterialFinish,
  Orientation,
  HistoryItem,
  IdentityType,
} from "./types.ts";

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

type QualityMode = "FHD" | "4K";

const MATERIAL_FINISHES: MaterialFinish[] = [
  "Standard",
  "Frosted Glass",
  "Brushed Metal",
  "Neon Glow",
  "Grainy Film",
  "Paper Matte",
];
const IDENTITY_STYLES: IdentityType[] = [
  "None",
  "Logo",
  "Symbol",
  "Silhouette",
];

const GALLERY_PRESETS = [
  {
    id: "ref-1",
    name: "Neon Horizon",
    url: "/WallpaperForge-FHD-fractal-dark.png",
    theme: "grad-cyber",
    pattern: "grid",
    material: "Neon Glow",
    text: "ULTRA NEON",
    quality: "4K",
  },
  {
    id: "ref-2",
    name: "Slate Minimal",
    url: "/Wallpaper-FHD-poly-dark.png",
    theme: "solid-slate",
    pattern: "pills",
    material: "Brushed Metal",
    text: "PURE FOCUS",
    quality: "FHD",
  },
  {
    id: "ref-3",
    name: "Abyss Depth",
    url: "/Wallpaper-FHD-topo-dark.png",
    theme: "grad-ocean",
    pattern: "topo",
    material: "Frosted Glass",
    text: "DEEP WATER",
    quality: "4K",
  },
  {
    id: "ref-4",
    name: "Magma Flow",
    url: "/forge-wallpaper-FHD-1766553318167.png",
    theme: "grad-sunset",
    pattern: "origami",
    material: "Grainy Film",
    text: "CORE HEAT",
    quality: "FHD",
  },
  {
    id: "ref-5",
    name: "Neural Forge",
    url: "/forge-1766553955401.png",
    theme: "grad-amethyst",
    pattern: "auto",
    material: "Standard",
    text: "MIND FORGE",
    quality: "4K",
  },
  {
    id: "ref-6",
    name: "Quantum Grid",
    url: "/forge-1766553972131.png",
    theme: "grad-toxic",
    pattern: "grid",
    material: "Neon Glow",
    text: "QUANTUM",
    quality: "FHD",
  },
];

const App: React.FC = () => {
  const [hasSelectedKey, setHasSelectedKey] = useState<boolean>(false);
  const [isSetupSkipped, setIsSetupSkipped] = useState<boolean>(false);
  const [quality, setQuality] = useState<QualityMode>("FHD");
  const [orientation, setOrientation] = useState<Orientation>("Landscape");
  const [material, setMaterial] = useState<MaterialFinish>("Standard");
  const [selectedTheme, setSelectedTheme] = useState<WallpaperTheme>(
    WALLPAPER_THEMES[0]
  );
  const [selectedPattern, setSelectedPattern] = useState<WallpaperPattern>(
    WALLPAPER_PATTERNS[0]
  );
  const [selectedFont, setSelectedFont] = useState(WALLPAPER_FONTS[0]);
  const [customText, setCustomText] = useState<string>("STAY FOCUSED");

  const [characterName, setCharacterName] = useState<string>("");
  const [identityStyle, setIdentityStyle] = useState<IdentityType>("None");

  const [isGeneratingText, setIsGeneratingText] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [customPatterns, setCustomPatterns] = useState<WallpaperPattern[]>([]);
  const [lastAiPattern, setLastAiPattern] = useState<{
    name: string;
    prompt: string;
  } | null>(null);

  const isCallingRef = React.useRef(false); // Anti-spam ref

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    imageUrl: null,
    error: null,
    status: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("forge_patterns");
    if (saved) setCustomPatterns(JSON.parse(saved));

    const checkKey = async () => {
      try {
        const selected = await window.aistudio?.hasSelectedApiKey();
        setHasSelectedKey(!!selected);
      } catch (e) {
        console.error(e);
      }
    };
    checkKey();
  }, []);

  const saveToLibrary = () => {
    if (!lastAiPattern) return;
    const newPattern: WallpaperPattern = {
      id: `custom_${Date.now()}`,
      name: lastAiPattern.name,
      description: "AI Generated Discovery",
      prompt: lastAiPattern.prompt,
      isCustom: true,
    };
    const updated = [...customPatterns, newPattern];
    setCustomPatterns(updated);
    localStorage.setItem("forge_patterns", JSON.stringify(updated));
    setSelectedPattern(newPattern);
    setLastAiPattern(null);
  };

  const deletePattern = (id: string) => {
    const updated = customPatterns.filter((p) => p.id !== id);
    setCustomPatterns(updated);
    localStorage.setItem("forge_patterns", JSON.stringify(updated));
    if (selectedPattern.id === id) setSelectedPattern(WALLPAPER_PATTERNS[0]);
  };


  const clonePreset = (preset: (typeof GALLERY_PRESETS)[0]) => {
    const theme = WALLPAPER_THEMES.find((t) => t.id === preset.theme);
    const pattern = WALLPAPER_PATTERNS.find((p) => p.id === preset.pattern);
    if (theme) setSelectedTheme(theme);
    if (pattern) setSelectedPattern(pattern);
    setMaterial(preset.material as MaterialFinish);
    setCustomText(preset.text);
    // Visual feedback
    setState((prev) => ({
      ...prev,
      status: `CLONED: ${preset.name.toUpperCase()}`,
    }));
    setTimeout(() => setState((prev) => ({ ...prev, status: "" })), 2000);
  };

  // Helper to call our Netlify function with Anti-Spam
  const callGeminiFunction = async (prompt: string) => {
     if (isCallingRef.current) return null;
     isCallingRef.current = true;

     try {
       const response = await fetch("/.netlify/functions/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // SIMPLIFIED PAYLOAD AS REQUESTED
          body: JSON.stringify({ prompt }), 
       });
       
       const data = await response.json();

       if (!response.ok) {
          throw new Error(data.error || `Server Error: ${response.status}`);
       }
       
       return data;
     } finally {
       // Rate limit cool-down
       setTimeout(() => {
         isCallingRef.current = false;
       }, 1500); 
     }
  };

  const generateQuote = async (forceAuto: boolean = false) => {
    if(isGeneratingText) return;
    setIsGeneratingText(true);
    try {
      // Use the new helper with simplified prompt
      const response = await callGeminiFunction(
        `Generate a ultra-minimalist, punchy, 2-word motivational quote in all caps. Use strong, assertive language. No punctuation.`
      );

      if (!response) return; // blocked by spam filter

      // Response structure might be different depending on API version, handling standard path
      const candidate = response.candidates?.[0]?.content?.parts?.[0]?.text;
      const text = candidate || "DO MORE";
      
      const cleanText = text.trim().toUpperCase().replace(/[.!?]/g, "");
      if (forceAuto) return cleanText;
      setCustomText(cleanText);
    } catch (e) {
      console.error("Quote Generation Failed", e);
      return "DO MORE";
    } finally {
      setIsGeneratingText(false);
    }
  };

  const neuralSurprise = async () => {
    const randomTheme =
      WALLPAPER_THEMES[Math.floor(Math.random() * WALLPAPER_THEMES.length)];
    setSelectedTheme(randomTheme);
    setSelectedPattern(WALLPAPER_PATTERNS[0]);
    setSelectedFont(WALLPAPER_FONTS[0]);
    setMaterial(
      MATERIAL_FINISHES[Math.floor(Math.random() * MATERIAL_FINISHES.length)]
    );
    const freshQuote = await generateQuote(true);
    setCustomText(freshQuote || "STAY FOCUSED");

    if (Math.random() > 0.7) {
      const heroes = [
        "Goku",
        "Spider-Man",
        "Batman",
        "Luffy",
        "Naruto",
        "Iron Man",
      ];
      setCharacterName(heroes[Math.floor(Math.random() * heroes.length)]);
      setIdentityStyle(Math.random() > 0.5 ? "Symbol" : "Silhouette");
    } else {
      setIdentityStyle("None");
    }

    setTimeout(() => generateWallpaper(freshQuote), 100);
  };

  const generateWallpaper = async (overrideText?: string) => {
    // Simplified logic: No client-side key checks needed
    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      status: `NEURAL_INITIALIZE_0x${Math.random()
        .toString(16)
        .slice(2, 6)
        .toUpperCase()}`,
    }));
    setLastAiPattern(null);

    try {
      const isPro = quality === "4K";
      const targetRes =
        orientation === "Landscape"
          ? isPro
            ? "3840x2160"
            : "1920x1080"
          : isPro
          ? "2160x3840"
          : "1080x1920";

      const activeText = overrideText || customText;

      const patternDesc =
        selectedPattern.id === "auto"
          ? "AI-ORCHESTRATED STRUCTURAL PATTERN: As a creative director, invent a completely new, named structural pattern. Describe its visual style in the text output part."
          : `PATTERN: ${selectedPattern.prompt}`;

      const identityPrompt =
        identityStyle !== "None" && characterName.trim()
          ? `IDENTITY_INTEGRATION: Include a minimalist, stylistically consistent ${identityStyle} of "${characterName}". It should be integrated into the structural patterns, behaving as part of the architecture. Apply the same ${material} finish to the identity element. Ensure it is not a sticker, but woven into the geometry.`
          : "";

      const prompt = `Create a high-fidelity ${quality} ${orientation} wallpaper (${targetRes}).
      ${patternDesc}
      ${identityPrompt}
      SURFACE_FINISH: The overall texture and material should be ${material}.
      COLORS: ${selectedTheme.promptColor}.
      TEXT_ELEMENT: "${activeText}". 
      TYPOGRAPHY: ${selectedFont.prompt}.
      AI_COMPOSITION_RULE: ${
        orientation === "Portrait"
          ? "Place the text vertically centered but shifted slightly down to avoid phone clock overlap."
          : "Expert design placement for balance."
      }
      INSTRUCTION_FOR_META: If you are creating an original pattern, include a brief name for it (like 'Quantum Flow' or 'Neon Ribbons') and a technical description of its architecture in the text part of your response.
      STYLE: Ultra-minimalist, high-contrast, professional digital art, professional lighting.`;

      setState((prev) => ({
        ...prev,
        status: `ORCHESTRATING_NEURAL_MATRIX...`,
      }));
      const modelName = isPro
        ? "gemini-3-pro-image-preview"
        : "gemini-2.5-flash-image";

      // Call Netlify Function
      const response = await callGeminiFunction(prompt);

      let b64: string | undefined;
      let aiResponseText: string = "";

      if (response && response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) b64 = part.inlineData.data;
          if (part.text) aiResponseText += part.text;
        }
      }


      if (b64) {
        const url = `data:image/png;base64,${b64}`;
        if (selectedPattern.id === "auto" && aiResponseText) {
          setLastAiPattern({
            name:
              aiResponseText
                .split("\n")[0]
                .replace(/['"]+/g, "")
                .substring(0, 20) || "AI Discovery",
            prompt: aiResponseText,
          });
        }
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          imageUrl: url,
          status: "STABLE_OUTPUT",
        }));
        setHistory((prev) =>
          [
            { id: Date.now().toString(), url, timestamp: Date.now() },
            ...prev,
          ].slice(0, 10)
        );
      } else {
        throw new Error("NULL_NEURAL_PAYLOAD");
      }
    } catch (err: any) {
      if (err.message && err.message.includes("API Key missing")) {
         // Handle missing server key if needed, or just standard error
      }
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: err.message,
        status: "HALTED_ERR",
      }));
    }
  };

  const allPatterns = [...WALLPAPER_PATTERNS, ...customPatterns];
  const solidThemes = WALLPAPER_THEMES.filter(
    (t) => (t as any).type === "solid"
  );
  const gradientThemes = WALLPAPER_THEMES.filter(
    (t) => (t as any).type === "gradient"
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 text-zinc-400 font-mono text-xs leading-tight selection:bg-indigo-600/30">
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h2 className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Neural_Engine_Config
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">

                <h3 className="text-xs font-black text-indigo-500 uppercase flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-indigo-500/50"></span>{" "}
                  Neural_Library_Data ({customPatterns.length})
                </h3>
                <div className="max-h-56 overflow-y-auto border border-zinc-800 rounded bg-black/40 divide-y divide-zinc-800/50 custom-scrollbar">
                  {customPatterns.length === 0 ? (
                    <div className="p-8 text-center text-zinc-700 uppercase italic text-xs tracking-widest">
                      Library_Is_Void
                    </div>
                  ) : (
                    customPatterns.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 flex justify-between items-center group hover:bg-zinc-800/20"
                      >
                        <span className="text-zinc-300 font-bold uppercase tracking-tight text-xs">
                          {p.name}
                        </span>
                        <button
                          onClick={() => deletePattern(p.id)}
                          className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                        >
                          PURGE
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between border border-zinc-800/60 bg-zinc-900/20 p-3 mb-5 rounded-lg backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center font-black italic shadow-lg text-xl rounded-md">

            F
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-[0.2em] uppercase italic text-sm">
              Forge Studio
            </span>
            <span className="text-[10px] text-indigo-500 font-black tracking-widest uppercase opacity-80">
              AI Neural Wallpaper Engine
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end px-4 border-r border-zinc-800">
            <span className="text-[9px] uppercase font-black text-zinc-600">
              Active_Core
            </span>
            <span className="text-[10px] text-indigo-400 font-bold tracking-tight">
              {quality === "4K" ? "GEMINI_3_PRO_IMAGE" : "GEMINI_2.5_FLASH"}
            </span>
          </div>
          <div className="flex bg-black/50 rounded p-1 border border-zinc-800 shadow-inner">
            {["FHD", "4K"].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q as QualityMode)}
                className={`px-5 py-1.5 rounded text-xs font-black uppercase transition-all duration-300 ${
                  quality === q
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex bg-black/50 rounded p-1 border border-zinc-800">
            {["Landscape", "Portrait"].map((o) => (
              <button
                key={o}
                onClick={() => setOrientation(o as Orientation)}
                className={`px-4 py-1.5 rounded text-xs font-black uppercase transition-all ${
                  orientation === o ? "bg-zinc-800 text-white" : "text-zinc-600"
                }`}
              >
                {o === "Landscape" ? "□" : "▭"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded border border-zinc-800 bg-black flex items-center justify-center text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all text-xl"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <section className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-lg overflow-hidden">
            <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-sm"></span> [01]
              Geometry_Matrix
            </h4>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {allPatterns.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPattern(p)}
                  className={`w-full text-left px-4 py-2.5 rounded-md border transition-all flex items-center justify-between group ${
                    selectedPattern.id === p.id
                      ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                      : "border-transparent hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span className="truncate font-bold uppercase tracking-tighter text-xs">
                    {p.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.isCustom && (
                      <span className="text-[10px] bg-indigo-600/20 px-1.5 rounded text-indigo-400">
                        USR
                      </span>
                    )}
                    {p.id === "auto" && (
                      <span
                        className={`text-xs ${
                          state.isGenerating ? "animate-sparkle" : ""
                        }`}
                      >
                        ✨
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-lg">
            <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">
              [02] Surface_Finish
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {MATERIAL_FINISHES.map((f) => (
                <button
                  key={f}
                  onClick={() => setMaterial(f)}
                  className={`py-3 px-2 border rounded text-xs uppercase font-black transition-all ${
                    material === f
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-zinc-800 text-zinc-600 hover:border-zinc-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-lg">
            <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">
              [03] Chromatic_Scale
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {solidThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t)}
                    className={`aspect-square rounded-sm border transition-all ${
                      selectedTheme.id === t.id
                        ? "border-white ring-2 ring-white/20 scale-110 z-10"
                        : "border-zinc-800 hover:border-zinc-500"
                    } ${t.previewColor}`}
                    title={t.name}
                  />
                ))}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {gradientThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t)}
                    className={`aspect-square rounded-sm border transition-all ${
                      selectedTheme.id === t.id
                        ? "border-white ring-2 ring-white/20 scale-110 z-10"
                        : "border-zinc-800 hover:border-zinc-500"
                    } ${t.previewColor}`}
                    title={t.name}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-lg">
            <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-sm"></span> [04]
              Identity_Matrix
            </h4>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-200 focus:border-indigo-500 outline-none font-bold text-xs"
                  placeholder="CHARACTER / HERO / ANIME"
                />
                {characterName && (
                  <button
                    onClick={() => setCharacterName("")}
                    className="absolute right-3 top-2.5 text-zinc-600 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {IDENTITY_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setIdentityStyle(style)}
                    className={`py-2 border rounded text-[10px] uppercase font-black transition-all ${
                      identityStyle === style
                        ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                        : "border-zinc-800 text-zinc-600 hover:border-zinc-700"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-lg">
            <h4 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">
              [05] Semantic_Logic
            </h4>
            <div className="space-y-3">
              <div className="relative group">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  className="w-full bg-black/60 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-200 focus:border-indigo-500 outline-none pr-12 font-bold tracking-tight text-xs"
                  placeholder="MOTIVATIONAL_TEXT"
                />
                <button
                  onClick={() => generateQuote(false)}
                  disabled={isGeneratingText}
                  className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded transition-all active:scale-90"
                >
                  <span
                    className={`text-sm ${
                      isGeneratingText ? "animate-sparkle" : ""
                    }`}
                  >
                    ✨
                  </span>
                </button>
              </div>
              <select
                value={selectedFont.id}
                onChange={(e) =>
                  setSelectedFont(
                    WALLPAPER_FONTS.find((f) => f.id === e.target.value) ||
                      WALLPAPER_FONTS[0]
                  )
                }
                className="w-full bg-black/60 border border-zinc-800 rounded-md px-4 py-2.5 text-zinc-200 outline-none appearance-none font-bold text-xs cursor-pointer"
              >
                {WALLPAPER_FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="space-y-3">
            <button
              onClick={() => generateWallpaper()}
              disabled={state.isGenerating}
              className={`w-full py-5 rounded-xl font-black text-xs uppercase shadow-2xl transition-all active:scale-[0.98] ${
                state.isGenerating
                  ? "bg-zinc-800 text-zinc-600 cursor-wait"
                  : quality === "4K"
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-zinc-100 text-black hover:bg-white"
              }`}
            >
              {state.isGenerating
                ? "NEURAL_SYNTHESIS_ACTIVE..."
                : `RUN_ENGINE_v${quality} (3840x2160)`}
            </button>
            <button
              onClick={neuralSurprise}
              disabled={state.isGenerating}
              className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all"
            >
              <span className={state.isGenerating ? "animate-sparkle" : ""}>
                ✨
              </span>{" "}
              NEURAL_SURPRISE
            </button>
          </div>

          {state.error && (
            <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-[10px] text-red-500 uppercase leading-relaxed animate-in fade-in slide-in-from-top-1">
              ERR_CODE: {state.error.split(" ").slice(0, 3).join("_")}... Check
              Terminal.
            </div>
          )}
        </div>

        <div className="lg:col-span-9 flex flex-col gap-5">
          {/* Main Preview */}
          <div
            className={`relative bg-black rounded-2xl border border-zinc-800/50 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 ${
              orientation === "Landscape"
                ? "aspect-video"
                : "aspect-[9/16] w-full max-w-sm mx-auto"
            }`}
          >
            {state.imageUrl ? (
              <div className="h-full w-full relative animate-in fade-in duration-1000">
                <img
                  src={state.imageUrl}
                  alt="Neural Output"
                  className="w-full h-full object-cover transition-transform duration-[8000ms] hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-all flex flex-col items-center justify-center gap-8 backdrop-blur-[4px]">
                  <div className="flex flex-col gap-5 scale-90 hover:scale-100 transition-transform">
                    <button
                      onClick={() => {
                        if (state.imageUrl) {
                          const link = document.createElement("a");
                          link.href = state.imageUrl;
                          link.download = `forge-engine-${Date.now()}.png`;
                          link.click();
                        }
                      }}
                      className="px-12 py-4 bg-white text-black font-black uppercase rounded-full shadow-2xl active:scale-95 text-xs"
                    >
                      EXPORT_ASSET (4K)
                    </button>
                    {lastAiPattern && (
                      <button
                        onClick={saveToLibrary}
                        className="px-12 py-4 bg-indigo-600 text-white font-black uppercase rounded-full shadow-2xl active:scale-95 text-xs"
                      >
                        💾 CAPTURE_PATTERN: {lastAiPattern.name}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-8 opacity-60">
                <div className="relative">
                  <div className="w-20 h-20 border-2 border-zinc-500/50 rounded-full animate-[spin_12s_linear_infinite]"></div>
                  <div className="absolute inset-0 w-20 h-20 border-t-4 border-indigo-400 rounded-full animate-[spin_3s_ease-in-out_infinite] shadow-lg shadow-indigo-500/20"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="uppercase tracking-[0.6em] font-black text-sm text-zinc-200">
                    {state.isGenerating
                      ? state.status
                      : "AWAITING_INPUT_SEQUENCE"}
                  </p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest animate-pulse">
                    {state.isGenerating
                      ? "NEURAL_LINK_ENGAGED"
                      : "ENGINE_CORE_READY"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Relocated Neural Gallery Section */}
          <section className="bg-zinc-900/40 border border-indigo-500/10 p-5 rounded-2xl overflow-hidden ring-1 ring-indigo-500/5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>{" "}
                Neural_Gallery (Masterwork_Presets) - {GALLERY_PRESETS.length} items
              </h4>
              <span className="text-[9px] text-zinc-600 uppercase font-black tracking-tighter">
                Clone style for 4K Engine calibration
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {GALLERY_PRESETS.map((p) => (
                <div
                  key={p.id}
                  className="relative group rounded-xl overflow-hidden border border-zinc-800 aspect-video cursor-pointer shadow-lg"
                  onClick={() => clonePreset(p)}
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-[11px] text-indigo-400 font-black uppercase tracking-widest block mb-1">
                        {p.name}
                      </span>
                      <div className="flex gap-2">
                        <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-sm uppercase">
                          {p.material}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-indigo-600/90 text-white text-[8px] px-2 py-0.5 rounded-full font-black tracking-widest backdrop-blur-sm border border-indigo-400/30">
                    {p.quality}_REF
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* History Tray */}
          {history.length > 0 && (
            <div className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-xl overflow-hidden shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                  Session_Stream
                </span>
                <div className="h-[1px] flex-grow bg-zinc-800/50"></div>
              </div>
              <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 px-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setState((s) => ({ ...s, imageUrl: item.url }))
                    }
                    className={`flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all hover:border-indigo-500/50 active:scale-95 ${
                      state.imageUrl === item.url
                        ? "border-indigo-500 scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                        : "border-zinc-800"
                    }`}
                  >
                    <img
                      src={item.url}
                      className={`${
                        orientation === "Landscape"
                          ? "w-36 aspect-video"
                          : "h-36 aspect-[9/16]"
                      } object-cover`}
                      alt="history"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <footer className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-zinc-800/40 pt-6 opacity-40">
            <div className="space-y-1.5">
              <span className="text-[10px] block uppercase text-zinc-600 font-black tracking-widest">
                Neural_Core
              </span>
              <p className="font-bold text-xs tracking-tight text-zinc-300">
                {quality === "4K" ? "PRO_V3" : "FLASH_V2.5"}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] block uppercase text-zinc-600 font-black tracking-widest">
                Canvas_Ratio
              </span>
              <p className="font-bold text-xs tracking-tight text-zinc-300">
                {orientation.toUpperCase()}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] block uppercase text-zinc-600 font-black tracking-widest">
                Architect_Finish
              </span>
              <p className="font-bold text-xs tracking-tight text-indigo-400">
                {material.toUpperCase()}
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] block uppercase text-zinc-600 font-black tracking-widest">
                Identity_Node
              </span>
              <p
                className={`font-bold text-xs tracking-tight ${
                  identityStyle !== "None" ? "text-indigo-500" : "text-zinc-500"
                }`}
              >
                {identityStyle !== "None"
                  ? characterName.toUpperCase().substring(0, 10) || "ACTIVE"
                  : "NULL"}
              </p>
            </div>
          </footer>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
          25% { transform: scale(1.2) rotate(15deg); opacity: 0.8; filter: brightness(1.5); }
          50% { transform: scale(0.9) rotate(-15deg); opacity: 1; filter: brightness(2); }
          75% { transform: scale(1.3) rotate(10deg); opacity: 0.7; filter: brightness(1.2); }
        }
        .animate-sparkle { 
          display: inline-block;
          animation: sparkle 0.8s ease-in-out infinite; 
          text-shadow: 0 0 10px rgba(255,255,255,0.8);
        }
      `}</style>
    </div>
  );
};

export default App;
