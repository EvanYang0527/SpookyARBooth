import { Leaf, Zap } from 'lucide-react';
import type { ThemeEffect, ThemeColors, ThemeId } from '../themes';

// Kept for backwards compatibility with App.tsx / ResultPanel
export type EffectType = string;

interface EffectPickerProps {
  themeId: ThemeId;
  effects: ThemeEffect[];
  colors: ThemeColors;
  selectedEffect: string;
  onSelectEffect: (effect: string) => void;
  disabled?: boolean;
}

export default function EffectPicker({ themeId, effects, colors, selectedEffect, onSelectEffect, disabled }: EffectPickerProps) {
  const HeadingIcon = themeId === 'oix_ainative_2026' ? Zap : Leaf;

  return (
    <div className="w-full">
      <h2 className={`text-sm font-bold ${colors.textPrimary} mb-3 flex items-center gap-2`}>
        <HeadingIcon className="w-4 h-4" />
        Choose Your Effect
      </h2>

      <div className="grid grid-cols-3 gap-2 items-stretch">
        {effects.map((effect) => {
          const isSelected = selectedEffect === effect.id;

          return (
            <button
              key={effect.id}
              onClick={() => onSelectEffect(effect.id)}
              disabled={disabled}
              className={`
                relative p-2 rounded-lg border-2 transition-all transform hover:scale-105 h-full
                ${isSelected
                  ? `${colors.effectSelectedBorder} bg-gradient-to-br ${colors.effectSelectedBg} shadow-md`
                  : `border-white/10 bg-white/5 ${colors.effectHoverBorder}`
                }
                ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'}
              `}
            >
              <div className="text-center">
                <div className="text-xl mb-1">{effect.emoji}</div>
                <h3 className={`font-semibold text-xs leading-tight ${isSelected ? colors.textPrimary : 'text-white/70'}`}>
                  {effect.name}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
