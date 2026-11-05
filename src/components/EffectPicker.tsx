import type { ComponentType } from 'react';
import { Sparkles, Sun, Leaf, Flame, PartyPopper, Star, Heart, Aperture, Crown, Wand2, Wheat } from 'lucide-react';

export type EffectType =
  | 'thanksgiving_glow'
  | 'autumn_leaves'
  | 'grateful_sparkle'
  | 'harvest_magic'
  | 'cozy_thanksgiving'
  | 'fall_confetti'
  | 'golden_harvest'
  | 'thankful_moments'
  | 'pumpkin_patch'
  | 'autumn_bokeh'
  | 'fall_crown'
  | 'thanksgiving_magic';

const Pumpkin = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3c0 0-1-1-2 0" />
    <path d="M8 7c-2 0-4 2-4 5s2 5 4 5h8c2 0 4-2 4-5s-2-5-4-5H8z" />
    <path d="M9 10h.01M15 10h.01M9 13h6" />
  </svg>
);

interface Effect {
  id: EffectType;
  name: string;
  emoji: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
}

interface EffectPickerProps {
  selectedEffect: EffectType;
  onSelectEffect: (effect: EffectType) => void;
  disabled?: boolean;
}

const effects: Effect[] = [
  {
    id: 'thanksgiving_glow',
    name: 'Thanksgiving Glow',
    emoji: '🌟',
    icon: Sun,
    description: 'Warm golden glow with twinkle lights'
  },
  {
    id: 'autumn_leaves',
    name: 'Autumn Leaves',
    emoji: '🍂',
    icon: Leaf,
    description: 'Colorful fall leaves swirling around'
  },
  {
    id: 'grateful_sparkle',
    name: 'Grateful Sparkle',
    emoji: '✨',
    icon: Sparkles,
    description: 'Golden sparkles & floating autumn leaves'
  },
  {
    id: 'harvest_magic',
    name: 'Harvest Magic',
    emoji: '🌾',
    icon: Wheat,
    description: 'Pumpkins, wheat & warm string lights'
  },
  {
    id: 'cozy_thanksgiving',
    name: 'Cozy Thanksgiving',
    emoji: '🕯️',
    icon: Flame,
    description: 'Amber lighting & glowing autumn decor'
  },
  {
    id: 'fall_confetti',
    name: 'Fall Confetti',
    emoji: '🎉',
    icon: PartyPopper,
    description: 'Autumn-inspired confetti burst'
  },
  {
    id: 'golden_harvest',
    name: 'Golden Harvest',
    emoji: '🌻',
    icon: Star,
    description: 'Glowing foliage & sparkling harvest lights'
  },
  {
    id: 'thankful_moments',
    name: 'Thankful Moments',
    emoji: '💛',
    icon: Heart,
    description: 'Fairy lights & autumn sparkles'
  },
  {
    id: 'pumpkin_patch',
    name: 'Pumpkin Patch',
    emoji: '🎃',
    icon: Pumpkin,
    description: 'Pumpkins, hay & warm golden lights'
  },
  {
    id: 'autumn_bokeh',
    name: 'Autumn Bokeh',
    emoji: '🍁',
    icon: Aperture,
    description: 'Golden bokeh & drifting fall leaves'
  },
  {
    id: 'fall_crown',
    name: 'Fall Crown',
    emoji: '👑',
    icon: Crown,
    description: 'Delicate autumn leaf crowns'
  },
  {
    id: 'thanksgiving_magic',
    name: 'Thanksgiving Magic',
    emoji: '🪄',
    icon: Wand2,
    description: 'Swirling leaves & golden particles'
  }
];

export default function EffectPicker({ selectedEffect, onSelectEffect, disabled }: EffectPickerProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-amber-400 mb-4 text-center flex items-center justify-center gap-2">
        <Leaf className="w-6 h-6" />
        Choose Your Effect
      </h2>

      <div className="grid grid-cols-4 gap-4 items-stretch">
        {effects.map((effect) => {
          const Icon = effect.icon;
          const isSelected = selectedEffect === effect.id;

          return (
            <button
              key={effect.id}
              onClick={() => onSelectEffect(effect.id)}
              disabled={disabled}
              className={`
                relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 h-full
                ${isSelected
                  ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-600/20 shadow-lg shadow-amber-500/50'
                  : 'border-amber-900/60 bg-amber-950/40 hover:border-amber-500/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'}
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{effect.emoji}</div>
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-amber-400' : 'text-amber-200/50'}`} />
                <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-amber-300' : 'text-amber-100/80'}`}>
                  {effect.name}
                </h3>
                <p className="text-xs text-gray-500">{effect.description}</p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
