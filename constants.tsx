
import { WallpaperTheme, WallpaperPattern } from './types';

export interface EnhancedTheme extends WallpaperTheme {
  type: 'solid' | 'gradient';
}

export const WALLPAPER_THEMES: EnhancedTheme[] = [
  // SOLIDS
  { id: 'solid-dark', name: 'Nero', type: 'solid', colors: ['#000000'], promptColor: 'solid pitch black', previewColor: 'bg-black' },
  { id: 'solid-white', name: 'Snow', type: 'solid', colors: ['#ffffff'], promptColor: 'solid pure white', previewColor: 'bg-white' },
  { id: 'solid-red', name: 'Crimson', type: 'solid', colors: ['#dc2626'], promptColor: 'solid deep crimson red', previewColor: 'bg-red-600' },
  { id: 'solid-blue', name: 'Cobalt', type: 'solid', colors: ['#2563eb'], promptColor: 'solid cobalt blue', previewColor: 'bg-blue-600' },
  { id: 'solid-slate', name: 'Slate', type: 'solid', colors: ['#475569'], promptColor: 'solid professional slate grey', previewColor: 'bg-slate-600' },
  { id: 'solid-emerald', name: 'Emerald', type: 'solid', colors: ['#059669'], promptColor: 'solid emerald green', previewColor: 'bg-emerald-600' },
  
  // GRADIENTS
  { id: 'grad-cyber', name: 'Neon City', type: 'gradient', colors: ['#ff00ff', '#00ffff'], promptColor: 'vibrant neon pink to electric cyan gradient', previewColor: 'bg-gradient-to-br from-pink-500 to-cyan-500' },
  { id: 'grad-ocean', name: 'Abyss', type: 'gradient', colors: ['#006994', '#001219'], promptColor: 'deep navy to glowing aquamarine gradient', previewColor: 'bg-gradient-to-br from-blue-900 to-cyan-900' },
  { id: 'grad-sunset', name: 'Magma', type: 'gradient', colors: ['#d35400', '#e67e22'], promptColor: 'deep burnt orange to vibrant amber gradient', previewColor: 'bg-gradient-to-br from-orange-700 to-yellow-500' },
  { id: 'grad-amethyst', name: 'Amethyst', type: 'gradient', colors: ['#8e44ad', '#9b59b6'], promptColor: 'rich royal purple to muted lavender gradient', previewColor: 'bg-gradient-to-br from-purple-800 to-purple-400' },
  { id: 'grad-toxic', name: 'Radioactive', type: 'gradient', colors: ['#000000', '#39FF14'], promptColor: 'pitch black to neon radioactive green gradient', previewColor: 'bg-gradient-to-br from-black to-green-500' },
  { id: 'grad-aurora', name: 'Aurora', type: 'gradient', colors: ['#00d2ff', '#3a7bd5'], promptColor: 'soft boreal sky blue to deep space blue gradient', previewColor: 'bg-gradient-to-br from-sky-400 to-blue-600' },
];

export const WALLPAPER_PATTERNS: WallpaperPattern[] = [
  { 
    id: 'auto', 
    name: 'Neural Synthesis', 
    description: 'AI decides the structural pattern based on mood.',
    prompt: 'Surprise me with a sophisticated, original structural pattern (e.g., generative parametric curves, fluid architectural motion, or complex geometric fractals) that creates a harmonious balance with the color scheme and typography.'
  },
  { 
    id: 'pills', 
    name: 'Concentric Pills', 
    description: 'Smooth, nested rounded rectangles with deep shadows.',
    prompt: 'Concentric, nested rounded rectangular "pill" shapes that curve and stack elegantly, creating deep shadow-based depth effects.'
  },
  { 
    id: 'grid', 
    name: 'Cyber Grid', 
    description: 'A technical, futuristic grid system with glowing intersections.',
    prompt: 'A sophisticated isometric cybernetic grid system with thin illuminated lines and subtle perspective depth.'
  },
  { 
    id: 'topo', 
    name: 'Fluid Topo', 
    description: 'Organic, flowing lines mimicking a topographical map.',
    prompt: 'Liquid topographical contour lines that flow organically across the canvas, creating a sense of smooth terrain depth.'
  },
  { 
    id: 'origami', 
    name: 'Origami Folds', 
    description: 'Sharp, angular paper-like creases and geometric folds.',
    prompt: 'Abstract origami-inspired sharp paper folds and angular creases with high-contrast shadows and clean geometric intersections.'
  }
];

export const WALLPAPER_FONTS = [
  { id: 'auto', name: 'Neural Selection', prompt: 'the most aesthetically suitable typeface for this specific composition (AI choice)' },
  { id: 'modern', name: 'Modern Sans', prompt: 'a bold, ultra-clean modern sans-serif with wide tracking' },
  { id: 'display', name: 'Impact Display', prompt: 'a heavy, high-impact condensed display typeface' },
  { id: 'mono', name: 'Futuristic Mono', prompt: 'a crisp, futuristic monospaced font like a terminal interface' },
  { id: 'serif', name: 'Elegant Serif', prompt: 'a sophisticated, high-contrast fashion serif with fine hairlines' },
  { id: 'italic', name: 'Aggressive Italic', prompt: 'a fast-paced, slanted techno-italic font' },
];
