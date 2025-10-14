import { Ghost, Cloud, Zap, Flame } from 'lucide-react';

export type EffectType = 'cartoon_ghost' | 'haunted_fog' | 'vhs_glitch' | 'pumpkin_aura';

interface Effect {
  id: EffectType;
  name: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface EffectPickerProps {
  selectedEffect: EffectType;
  onSelectEffect: (effect: EffectType) => void;
  disabled?: boolean;
}

const effects: Effect[] = [
  {
    id: 'cartoon_ghost',
    name: 'Cartoon Ghost',
    emoji: '👻',
    icon: Ghost,
    description: 'Playful ghostly overlay'
  },
  {
    id: 'haunted_fog',
    name: 'Haunted Fog',
    emoji: '🎃',
    icon: Cloud,
    description: 'Eerie fog atmosphere'
  },
  {
    id: 'vhs_glitch',
    name: 'VHS Glitch',
    emoji: '🕸️',
    icon: Zap,
    description: 'Retro horror distortion'
  },
  {
    id: 'pumpkin_aura',
    name: 'Pumpkin Aura',
    emoji: '💀',
    icon: Flame,
    description: 'Fiery Halloween glow'
  }
];

export default function EffectPicker({ selectedEffect, onSelectEffect, disabled }: EffectPickerProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-orange-400 mb-4 text-center flex items-center justify-center gap-2">
        <Ghost className="w-6 h-6" />
        Choose Your Spooky Effect
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {effects.map((effect) => {
          const Icon = effect.icon;
          const isSelected = selectedEffect === effect.id;

          return (
            <button
              key={effect.id}
              onClick={() => onSelectEffect(effect.id)}
              disabled={disabled}
              className={`
                relative p-4 rounded-xl border-2 transition-all transform hover:scale-105
                ${isSelected
                  ? 'border-orange-500 bg-gradient-to-br from-orange-500/20 to-purple-600/20 shadow-lg shadow-orange-500/50'
                  : 'border-gray-700 bg-gray-800 hover:border-orange-500/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'}
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{effect.emoji}</div>
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-orange-400' : 'text-gray-400'}`} />
                <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-orange-300' : 'text-gray-300'}`}>
                  {effect.name}
                </h3>
                <p className="text-xs text-gray-500">{effect.description}</p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
