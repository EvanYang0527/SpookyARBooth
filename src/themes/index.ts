export type ThemeId = 'gratitude_itsba2026' | 'oix_ainative_2026';

export interface ThemeEffect {
  id: string;
  name: string;
  emoji: string;
}

export interface ThemeFrame {
  path: string;
  label: string;
  window: {
    widthRatio: number;
    heightRatio: number;
    offsetXRatio: number;
    offsetYRatio: number;
  };
}

export interface ThemeColors {
  mainBg: string;
  headerBg: string;
  headerBorder: string;
  logoBg: string;
  textPrimary: string;
  textSecondary: string;
  adminBtn: string;
  userPill: string;
  logoutBtn: string;
  sidebarBg: string;
  sidebarBorder: string;
  cameraBg: string;
  cameraBorder: string;
  cameraGlow: string;
  captureBtn: string;
  captureBtnHover: string;
  spinnerColor: string;
  effectSelectedBorder: string;
  effectSelectedBg: string;
  effectHoverBorder: string;
}

export interface ThemeConfig {
  id: ThemeId;
  orgLabel: string;
  boothLabel: string;
  effects: ThemeEffect[];
  frames: Record<string, ThemeFrame>;
  defaultFrame: string;
  processingText: string;
  colors: ThemeColors;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  gratitude_itsba2026: {
    id: 'gratitude_itsba2026',
    orgLabel: 'ITS Technology Innovation Office',
    boothLabel: 'Gratitude Photo Booth',
    effects: [
      { id: 'thanksgiving_glow',  name: 'Thanksgiving Glow',  emoji: '🌟' },
      { id: 'autumn_leaves',      name: 'Autumn Leaves',      emoji: '🍂' },
      { id: 'grateful_sparkle',   name: 'Grateful Sparkle',   emoji: '✨' },
      { id: 'harvest_magic',      name: 'Harvest Magic',      emoji: '🌾' },
      { id: 'cozy_thanksgiving',  name: 'Cozy Thanksgiving',  emoji: '🕯️' },
      { id: 'fall_confetti',      name: 'Fall Confetti',      emoji: '🎉' },
      { id: 'golden_harvest',     name: 'Golden Harvest',     emoji: '🌻' },
      { id: 'thankful_moments',   name: 'Thankful Moments',   emoji: '💛' },
      { id: 'pumpkin_patch',      name: 'Pumpkin Patch',      emoji: '🎃' },
      { id: 'autumn_bokeh',       name: 'Autumn Bokeh',       emoji: '🍁' },
      { id: 'fall_crown',         name: 'Fall Crown',         emoji: '👑' },
      { id: 'thanksgiving_magic', name: 'Thanksgiving Magic', emoji: '🪄' },
    ],
    frames: {
      Gratitude1: {
        path: '/Gratitude1.png',
        label: 'Gratitude (Autumn)',
        window: { widthRatio: 0.84, heightRatio: 0.73, offsetXRatio: 0, offsetYRatio: 0.03 },
      },
      Gratitude2: {
        path: '/Gratitude2.png',
        label: 'Gratitude (Classic)',
        window: { widthRatio: 0.88, heightRatio: 0.70, offsetXRatio: 0, offsetYRatio: 0.0 },
      },
    },
    defaultFrame: 'Gratitude2',
    processingText: 'Applying autumn effects...',
    colors: {
      mainBg:               'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950',
      headerBg:             'bg-amber-950',
      headerBorder:         'border-amber-600/30',
      logoBg:               'bg-amber-600 shadow-lg shadow-amber-600/50',
      textPrimary:          'text-amber-400',
      textSecondary:        'text-amber-200/60',
      adminBtn:             'bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30',
      userPill:             'bg-amber-900/60 border border-amber-500/40 text-amber-100',
      logoutBtn:            'text-amber-200/60 hover:text-amber-400 hover:bg-amber-900/50',
      sidebarBg:            'bg-black/20',
      sidebarBorder:        'border-amber-800/40',
      cameraBg:             'bg-amber-950/60',
      cameraBorder:         'border-amber-500/30',
      cameraGlow:           'shadow-amber-500/20',
      captureBtn:           'from-amber-500 to-orange-600',
      captureBtnHover:      'hover:from-amber-600 hover:to-orange-700',
      spinnerColor:         'text-amber-400',
      effectSelectedBorder: 'border-amber-500',
      effectSelectedBg:     'from-amber-500/20 to-orange-600/20',
      effectHoverBorder:    'hover:border-amber-500/50',
    },
  },

  oix_ainative_2026: {
    id: 'oix_ainative_2026',
    orgLabel: 'ITS Open Innovation Exchange',
    boothLabel: 'AI-Native Photo Booth',
    effects: [
      { id: 'oix_ai_aura',           name: 'AI Aura',           emoji: '🔮' },
      { id: 'oix_holographic',       name: 'Holographic',       emoji: '💎' },
      { id: 'oix_cyber_circuit',     name: 'Cyber Circuit',     emoji: '⚡' },
      { id: 'oix_neural_glow',       name: 'Neural Glow',       emoji: '🧠' },
      { id: 'oix_digital_transform', name: 'Digital Transform', emoji: '🌐' },
      { id: 'oix_agent_mode',        name: 'Agent Mode',        emoji: '🤖' },
      { id: 'oix_quantum_state',     name: 'Quantum State',     emoji: '⚛️' },
      { id: 'oix_future_vision',     name: 'Future Vision',     emoji: '👁️' },
      { id: 'oix_data_stream',       name: 'Data Stream',       emoji: '📡' },
      { id: 'oix_innovation_spark',  name: 'Innovation Spark',  emoji: '💡' },
      { id: 'oix_ai_native',         name: 'AI Native',         emoji: '🚀' },
      { id: 'oix_open_exchange',     name: 'Open Exchange',     emoji: '🌟' },
    ],
    frames: {
      OIX1: {
        path: '/OIX1.png',
        label: 'Innovation Frame',
        window: { widthRatio: 0.88, heightRatio: 0.70, offsetXRatio: 0, offsetYRatio: 0.0 },
      },
    },
    defaultFrame: 'OIX1',
    processingText: 'Applying AI transformation...',
    colors: {
      mainBg:               'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950',
      headerBg:             'bg-slate-950',
      headerBorder:         'border-blue-700/30',
      logoBg:               'bg-blue-700 shadow-lg shadow-blue-700/50',
      textPrimary:          'text-cyan-400',
      textSecondary:        'text-cyan-200/60',
      adminBtn:             'bg-blue-700/20 border border-blue-500/40 text-blue-300 hover:bg-blue-700/30',
      userPill:             'bg-blue-900/60 border border-blue-500/40 text-blue-100',
      logoutBtn:            'text-blue-200/60 hover:text-cyan-400 hover:bg-blue-900/50',
      sidebarBg:            'bg-blue-950/40',
      sidebarBorder:        'border-blue-800/40',
      cameraBg:             'bg-blue-950/60',
      cameraBorder:         'border-cyan-500/30',
      cameraGlow:           'shadow-cyan-500/20',
      captureBtn:           'from-cyan-500 to-blue-600',
      captureBtnHover:      'hover:from-cyan-600 hover:to-blue-700',
      spinnerColor:         'text-cyan-400',
      effectSelectedBorder: 'border-cyan-500',
      effectSelectedBg:     'from-cyan-500/20 to-blue-600/20',
      effectHoverBorder:    'hover:border-cyan-500/50',
    },
  },
};

export function getTheme(themeId?: string | null): ThemeConfig {
  if (themeId && themeId in THEMES) {
    return THEMES[themeId as ThemeId];
  }
  return THEMES.gratitude_itsba2026;
}

export const THEME_OPTIONS: Array<{ id: ThemeId; label: string }> = [
  { id: 'gratitude_itsba2026', label: 'Gratitude (ITSBA 2026)' },
  { id: 'oix_ainative_2026',   label: 'OIX AI-Native (2026)' },
];
