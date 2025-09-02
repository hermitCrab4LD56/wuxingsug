// 颜色主题配置
export const colorThemes = {
  ocean: {
    background: ['#0f172a', '#1e293b', '#334155'],
    water: '#0ea5e9',
    ripple: '#38bdf8',
    light: '#7dd3fc'
  },
  blue: {
    background: ['#0f172a', '#1e293b', '#334155'],
    water: '#0ea5e9',
    ripple: '#38bdf8',
    light: '#7dd3fc'
  },
  green: {
    background: ['#064e3b', '#065f46', '#047857'],
    water: '#059669',
    ripple: '#10b981',
    light: '#34d399'
  },
  purple: {
    background: ['#581c87', '#7c2d92', '#a21caf'],
    water: '#c026d3',
    ripple: '#d946ef',
    light: '#e879f9'
  },
  orange: {
    background: ['#7c2d12', '#9a3412', '#c2410c'],
    water: '#ea580c',
    ripple: '#f97316',
    light: '#fb923c'
  }
};

export type ColorTheme = keyof typeof colorThemes;