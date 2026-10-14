/**
 * UGC NET Smart Preparation Portal — Theme & Glassmorphism Controller
 * Author: Jane Rose | Asst. Professor | CSE
 */

export const THEME_PRESETS = [
  { id: 'frosted', name: 'Frosted Glass', icon: '❄️', desc: 'Classic frosted blur with subtle cyan rim light' },
  { id: 'liquid', name: 'Liquid Glass-inspired UI', icon: '💧', desc: 'Fluid organic gradients with refractive highlights' },
  { id: 'crystal', name: 'Crystal Glass', icon: '💎', desc: 'Ultra-crisp razor edges with high transparency' },
  { id: 'aurora', name: 'Aurora Glass', icon: '🌌', desc: 'Luminescent northern lights dancing beneath frost' },
  { id: 'holographic', name: 'Holographic Glass', icon: '🔮', desc: 'Iridescent chromatic sheen with rose & violet tints' },
  { id: 'layered', name: 'Layered Translucent Glass', icon: '📑', desc: 'Elevated multi-tier depth and incremental opacities' },
  { id: 'neumorphic', name: 'Neumorphic Glass Hybrid', icon: '🎛️', desc: 'Extruded tactile bevels with soft double shadows' },
  { id: 'scifi', name: 'Dark Sci-Fi Laboratory', icon: '🔬', desc: 'Cybernetic telemetry aesthetic with cyan accents' },
  { id: 'light-academic', name: 'Light Academic Glass', icon: '📜', desc: 'Serene ivory paper texture with university navy' },
  { id: 'high-contrast', name: 'High-Contrast Accessibility', icon: '👁️', desc: 'WCAG AAA maximum readability with gold borders' }
];

export class ThemeEngine {
  constructor() {
    this.currentTheme = 'frosted';
    this.currentMode = 'dark';
    this.config = {
      blur: 16,
      opacity: 0.18,
      borderAlpha: 0.25,
      accentColor: '#3B82F6',
      shadowDepth: 25,
      particlesEnabled: true,
      reducedMotion: false
    };
    this.init();
  }

  init() {
    // 1. Check OS color scheme preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.currentMode = prefersDark ? 'dark' : 'dark'; // default to sleek dark mode

    // 2. Load persisted preferences
    try {
      const saved = localStorage.getItem('ugc_net_theme_pref');
      if (saved) {
        const parsed = json_safe_parse(saved);
        if (parsed) {
          this.currentTheme = parsed.theme || this.currentTheme;
          this.currentMode = parsed.mode || this.currentMode;
          this.config = { ...this.config, ...(parsed.config || {}) };
        }
      }
    } catch (e) {
      console.warn("Could not read theme from localStorage", e);
    }

    this.applyTheme();
  }

  applyTheme() {
    const root = document.documentElement;
    root.setAttribute('data-theme', this.currentTheme);
    root.setAttribute('data-mode', this.currentMode);

    // Apply custom slider variables
    root.style.setProperty('--user-blur', `${this.config.blur}px`);
    root.style.setProperty('--user-opacity', this.config.opacity);
    root.style.setProperty('--user-border-alpha', this.config.borderAlpha);
    root.style.setProperty('--user-accent', this.config.accentColor);
    root.style.setProperty('--user-shadow-depth', `${this.config.shadowDepth}px`);

    // Parse RGB for rgba() usages
    const rgb = hexToRgb(this.config.accentColor);
    if (rgb) {
      root.style.setProperty('--user-accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    // Save preferences
    try {
      localStorage.setItem('ugc_net_theme_pref', JSON.stringify({
        theme: this.currentTheme,
        mode: this.currentMode,
        config: this.config
      }));
    } catch (e) {}

    // Dispatch event for UI listeners
    window.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: this.currentTheme, mode: this.currentMode, config: this.config }
    }));
  }

  setTheme(themeId) {
    if (THEME_PRESETS.some(t => t.id === themeId)) {
      this.currentTheme = themeId;
      this.applyTheme();
    }
  }

  toggleMode() {
    this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
    this.applyTheme();
  }

  updateConfig(key, value) {
    this.config[key] = value;
    this.applyTheme();
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function json_safe_parse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

export const themeEngineInstance = new ThemeEngine();
