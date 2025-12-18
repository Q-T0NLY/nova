/**
 * 🎨 NEXUS ULTRA-MODERN THEME SYSTEM V2
 * Advanced color palette with gradients, animations, and accessibility
 * Production-grade theming with dynamic CSS variables
 */

export interface ColorStop {
  color: string;
  position: number;
}

export interface GradientDef {
  angle: number;
  colors: ColorStop[];
}

export interface AnimationConfig {
  duration: string;
  easing: string;
  delay?: string;
}

export interface ThemeConfig {
  name: string;
  mode: 'dark' | 'light';
  primary: string;
  primaryGradient: GradientDef;
  secondary: string;
  secondaryGradient: GradientDef;
  accent: string;
  accentGradient: GradientDef;
  background: string;
  backgroundGradient: GradientDef;
  surface: string;
  surfaceGradient: GradientDef;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  bubbles: {
    user: string;
    assistant: string;
    system: string;
  };
  borders: {
    light: string;
    medium: string;
    dark: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
  };
  animations: {
    fast: AnimationConfig;
    normal: AnimationConfig;
    slow: AnimationConfig;
    verySlow: AnimationConfig;
  };
  effects: {
    blur: string;
    backdropBlur: string;
    saturation: string;
    brightness: string;
  };
}

const neonGradient = (color: string): GradientDef => ({
  angle: 135,
  colors: [
    { color: color, position: 0 },
    { color: `${color}cc`, position: 100 }
  ]
});

const metallicGradient = (color: string): GradientDef => ({
  angle: 90,
  colors: [
    { color: `${color}00`, position: 0 },
    { color: color, position: 50 },
    { color: `${color}00`, position: 100 }
  ]
});

export const THEMES = {
  cyberpunk: {
    name: 'Cyberpunk Neon',
    mode: 'dark' as const,
    primary: '#FF00FF',
    primaryGradient: neonGradient('#FF00FF'),
    secondary: '#00FFFF',
    secondaryGradient: neonGradient('#00FFFF'),
    accent: '#FFFF00',
    accentGradient: neonGradient('#FFFF00'),
    background: '#0A0A0A',
    backgroundGradient: {
      angle: 180,
      colors: [
        { color: '#0A0A0A', position: 0 },
        { color: '#1A0A1A', position: 100 }
      ]
    },
    surface: '#1A1A2E',
    surfaceGradient: {
      angle: 135,
      colors: [
        { color: '#1A1A2E', position: 0 },
        { color: '#2A1A3E', position: 100 }
      ]
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      tertiary: '#808080',
      inverse: '#000000'
    },
    status: {
      success: '#00FF00',
      warning: '#FFA500',
      error: '#FF0000',
      info: '#00CCFF'
    },
    bubbles: {
      user: '#FF00FF',
      assistant: '#00FFFF',
      system: '#FFD700'
    },
    borders: {
      light: '#FF00FF40',
      medium: '#FF00FF80',
      dark: '#FF00FFFF'
    },
    shadows: {
      sm: '0 2px 8px rgba(255, 0, 255, 0.15)',
      md: '0 4px 16px rgba(255, 0, 255, 0.25)',
      lg: '0 8px 24px rgba(255, 0, 255, 0.35)',
      xl: '0 12px 32px rgba(255, 0, 255, 0.45)',
      glow: '0 0 20px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.2)'
    },
    animations: {
      fast: { duration: '0.15s', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      normal: { duration: '0.3s', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      slow: { duration: '0.6s', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      verySlow: { duration: '1.2s', easing: 'ease-in-out' }
    },
    effects: {
      blur: 'blur(10px)',
      backdropBlur: 'backdrop-filter: blur(10px)',
      saturation: 'saturate(1.2)',
      brightness: 'brightness(1.1)'
    }
  },

  matrix: {
    name: 'Matrix Rain',
    mode: 'dark' as const,
    primary: '#00FF41',
    primaryGradient: neonGradient('#00FF41'),
    secondary: '#008F11',
    secondaryGradient: neonGradient('#008F11'),
    accent: '#00FF41',
    accentGradient: neonGradient('#00FF41'),
    background: '#000000',
    backgroundGradient: {
      angle: 180,
      colors: [
        { color: '#000000', position: 0 },
        { color: '#001A00', position: 100 }
      ]
    },
    surface: '#0A0A0A',
    surfaceGradient: {
      angle: 135,
      colors: [
        { color: '#0A0A0A', position: 0 },
        { color: '#001A0A', position: 100 }
      ]
    },
    text: {
      primary: '#00FF41',
      secondary: '#008F11',
      tertiary: '#005500',
      inverse: '#FFFFFF'
    },
    status: {
      success: '#00FF41',
      warning: '#FFFF00',
      error: '#FF0000',
      info: '#00FFFF'
    },
    bubbles: {
      user: '#00FF41',
      assistant: '#008F11',
      system: '#00FF41'
    },
    borders: {
      light: '#00FF4140',
      medium: '#00FF4180',
      dark: '#00FF41FF'
    },
    shadows: {
      sm: '0 2px 8px rgba(0, 255, 65, 0.15)',
      md: '0 4px 16px rgba(0, 255, 65, 0.25)',
      lg: '0 8px 24px rgba(0, 255, 65, 0.35)',
      xl: '0 12px 32px rgba(0, 255, 65, 0.45)',
      glow: '0 0 20px rgba(0, 255, 65, 0.6), inset 0 0 15px rgba(0, 255, 65, 0.2)'
    },
    animations: {
      fast: { duration: '0.15s', easing: 'linear' },
      normal: { duration: '0.3s', easing: 'linear' },
      slow: { duration: '0.6s', easing: 'linear' },
      verySlow: { duration: '1.2s', easing: 'ease-in-out' }
    },
    effects: {
      blur: 'blur(8px)',
      backdropBlur: 'backdrop-filter: blur(8px)',
      saturation: 'saturate(1.3)',
      brightness: 'brightness(1.15)'
    }
  },

  ocean: {
    name: 'Ocean Depths',
    mode: 'dark' as const,
    primary: '#00B4D8',
    primaryGradient: neonGradient('#00B4D8'),
    secondary: '#0077B6',
    secondaryGradient: neonGradient('#0077B6'),
    accent: '#90E0EF',
    accentGradient: neonGradient('#90E0EF'),
    background: '#000B1A',
    backgroundGradient: {
      angle: 180,
      colors: [
        { color: '#000B1A', position: 0 },
        { color: '#001B3A', position: 100 }
      ]
    },
    surface: '#001D3D',
    surfaceGradient: {
      angle: 135,
      colors: [
        { color: '#001D3D', position: 0 },
        { color: '#002D5D', position: 100 }
      ]
    },
    text: {
      primary: '#E0F7FF',
      secondary: '#90E0EF',
      tertiary: '#00B4D8',
      inverse: '#000000'
    },
    status: {
      success: '#38B000',
      warning: '#FFD000',
      error: '#FF0054',
      info: '#00D9FF'
    },
    bubbles: {
      user: '#00B4D8',
      assistant: '#0077B6',
      system: '#90E0EF'
    },
    borders: {
      light: '#00B4D840',
      medium: '#00B4D880',
      dark: '#00B4D8FF'
    },
    shadows: {
      sm: '0 2px 8px rgba(0, 180, 216, 0.15)',
      md: '0 4px 16px rgba(0, 180, 216, 0.25)',
      lg: '0 8px 24px rgba(0, 180, 216, 0.35)',
      xl: '0 12px 32px rgba(0, 180, 216, 0.45)',
      glow: '0 0 20px rgba(0, 180, 216, 0.5), inset 0 0 20px rgba(144, 224, 239, 0.1)'
    },
    animations: {
      fast: { duration: '0.2s', easing: 'ease-out' },
      normal: { duration: '0.4s', easing: 'ease-out' },
      slow: { duration: '0.8s', easing: 'ease-out' },
      verySlow: { duration: '1.6s', easing: 'ease-in-out' }
    },
    effects: {
      blur: 'blur(12px)',
      backdropBlur: 'backdrop-filter: blur(12px)',
      saturation: 'saturate(1.1)',
      brightness: 'brightness(1.05)'
    }
  },

  aurora: {
    name: 'Aurora Borealis',
    mode: 'dark' as const,
    primary: '#C81D25',
    primaryGradient: neonGradient('#C81D25'),
    secondary: '#00A676',
    secondaryGradient: neonGradient('#00A676'),
    accent: '#FFC300',
    accentGradient: neonGradient('#FFC300'),
    background: '#0D1B2A',
    backgroundGradient: {
      angle: 180,
      colors: [
        { color: '#0D1B2A', position: 0 },
        { color: '#1B2845', position: 100 }
      ]
    },
    surface: '#1D3557',
    surfaceGradient: {
      angle: 135,
      colors: [
        { color: '#1D3557', position: 0 },
        { color: '#2D4A6F', position: 100 }
      ]
    },
    text: {
      primary: '#F1FAEE',
      secondary: '#A8DADC',
      tertiary: '#457B9D',
      inverse: '#000000'
    },
    status: {
      success: '#52B788',
      warning: '#FFB703',
      error: '#E63946',
      info: '#06FFF0'
    },
    bubbles: {
      user: '#C81D25',
      assistant: '#00A676',
      system: '#FFC300'
    },
    borders: {
      light: '#C81D2540',
      medium: '#C81D2580',
      dark: '#C81D25FF'
    },
    shadows: {
      sm: '0 2px 8px rgba(200, 29, 37, 0.15)',
      md: '0 4px 16px rgba(200, 29, 37, 0.25)',
      lg: '0 8px 24px rgba(200, 29, 37, 0.35)',
      xl: '0 12px 32px rgba(200, 29, 37, 0.45)',
      glow: '0 0 20px rgba(200, 29, 37, 0.5), inset 0 0 20px rgba(0, 166, 118, 0.15)'
    },
    animations: {
      fast: { duration: '0.2s', easing: 'ease-out' },
      normal: { duration: '0.4s', easing: 'ease-out' },
      slow: { duration: '0.8s', easing: 'ease-out' },
      verySlow: { duration: '1.6s', easing: 'ease-in-out' }
    },
    effects: {
      blur: 'blur(10px)',
      backdropBlur: 'backdrop-filter: blur(10px)',
      saturation: 'saturate(1.25)',
      brightness: 'brightness(1.08)'
    }
  }
};

export const getTheme = (themeName: string): ThemeConfig => {
  return (THEMES as Record<string, ThemeConfig>)[themeName] || THEMES.cyberpunk;
};

export const injectCSSVariables = (theme: ThemeConfig): void => {
  const root = document.documentElement;
  const vars = {
    '--color-primary': theme.primary,
    '--color-secondary': theme.secondary,
    '--color-accent': theme.accent,
    '--color-background': theme.background,
    '--color-surface': theme.surface,
    '--color-text-primary': theme.text.primary,
    '--color-text-secondary': theme.text.secondary,
    '--color-text-tertiary': theme.text.tertiary,
    '--color-success': theme.status.success,
    '--color-warning': theme.status.warning,
    '--color-error': theme.status.error,
    '--color-info': theme.status.info,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
    '--shadow-xl': theme.shadows.xl,
    '--shadow-glow': theme.shadows.glow,
    '--animation-duration-fast': theme.animations.fast.duration,
    '--animation-duration-normal': theme.animations.normal.duration,
    '--animation-duration-slow': theme.animations.slow.duration,
    '--animation-easing-fast': theme.animations.fast.easing,
    '--animation-easing-normal': theme.animations.normal.easing,
    '--animation-easing-slow': theme.animations.slow.easing
  };

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const gradientToCSS = (gradient: GradientDef): string => {
  const colorStops = gradient.colors
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');
  return `linear-gradient(${gradient.angle}deg, ${colorStops})`;
};
