export interface ThemeColors {
  '--color-primary': string;
  '--color-primary-light': string;
  '--color-primary-dark': string;
  '--color-bg': string;
  '--color-card': string;
  '--color-text': string;
  '--color-text-secondary': string;
  '--color-border': string;
  '--color-pattern': string;
}

export interface Theme {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  backgroundPattern: string;
}

// Helper to convert raw SVG string to a data URL more reliably than Base64
const svgToUrl = (svg: string) => {
    // Use `currentColor` in SVG definitions for strokes/fills to inherit color
    const coloredSvg = svg.replace(/<svg/g, `<svg fill='none' stroke='currentColor' stroke-width='1'`);
    const optimizedSvg = coloredSvg
        .replace(/"/g, "'")
        .replace(/%/g, "%25")
        .replace(/#/g, "%23")
        .replace(/{/g, "%7B")
        .replace(/}/g, "%7D")
        .replace(/</g, "%3C")
        .replace(/>/g, "%3E")
        .replace(/\s+/g, ' ');
    return `url("data:image/svg+xml,${optimizedSvg}")`;
};

const defaultTheme: Theme = {
  colors: {
    light: {
      '--color-primary': '#00897B',
      '--color-primary-light': '#4DB6AC',
      '--color-primary-dark': '#00695C',
      '--color-bg': '#F7FAFC',
      '--color-card': '#FFFFFF',
      '--color-text': '#1A202C',
      '--color-text-secondary': '#4A5568',
      '--color-border': '#E2E8F0',
      '--color-pattern': 'rgba(26, 32, 44, 0.08)',
    },
    dark: {
      '--color-primary': '#4DB6AC',
      '--color-primary-light': '#80CBC4',
      '--color-primary-dark': '#00897B',
      '--color-bg': '#1A202C',
      '--color-card': '#2D3748',
      '--color-text': '#F7FAFC',
      '--color-text-secondary': '#A0AEC0',
      '--color-border': '#4A5568',
      '--color-pattern': 'rgba(247, 250, 252, 0.08)',
    }
  },
  backgroundPattern: svgToUrl('<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M-10 10l20-20m-10 30l40-40m-10 50l60-60m-10 70l80-80m-10 90l100-100m-10 110l120-120m-110 110l120-120m-130 110l120-120m-130 90l100-100m-110 70l80-80m-90 50l60-60m-70 30l40-40m-50 10l20-20"/></svg>')
};


export const stateThemes: Record<string, Theme> = {
  'Default': defaultTheme,
};
