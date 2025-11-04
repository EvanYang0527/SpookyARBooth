import type { ComponentType, SVGProps } from 'react';
import { Ghost, Sparkles, VenetianMask, PartyPopper } from 'lucide-react';

export type EffectType =
  | 'cartoon_ghost'
  | 'haunted_fog'
  | 'vhs_glitch'
  | 'pumpkin_aura'
  | 'witch_makeover'
  | 'vampire_glam'
  | 'zombie_decay'
  | 'bubble_mirage'
  | 'laser_carnival'
  | 'sparkle_rain'
  | 'ai_masquerade'
  | 'glitch_glam'
  | 'confetti_explosion'
  | 'mask_magic'
  | 'electric_groove'
  | 'joker_illusion'
  | 'midway_marquee'
  | 'cotton_candy_twirl';

type IconProps = SVGProps<SVGSVGElement>;

const buildIconClassName = (base: string, className?: string) =>
  className ? `${base} ${className}` : base;

const svgDefaults = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

const Bubbles = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-bubbles', className)}>
    <circle cx="7" cy="8" r="3" />
    <circle cx="16.5" cy="6.5" r="2" />
    <circle cx="17" cy="15" r="3.5" />
    <circle cx="9.5" cy="17.5" r="2.5" />
    <circle cx="4.5" cy="14.5" r="1.5" />
  </svg>
);

const Laser = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-laser', className)}>
    <circle cx="12" cy="12" r="2.5" />
    <line x1="3" y1="12" x2="8" y2="12" />
    <line x1="13.5" y1="6" x2="21" y2="3.5" />
    <line x1="13.5" y1="18" x2="21" y2="20.5" />
    <line x1="12" y1="14.5" x2="9" y2="20.5" />
  </svg>
);

const Glitch = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-glitch', className)}>
    <path d="M4 7h10" />
    <path d="M10 7v4" />
    <path d="M20 11H8" />
    <path d="M14 11v4" />
    <path d="M4 15h12" />
    <path d="M18 15v3" />
    <path d="M6 7V4" />
  </svg>
);

const Masks = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-masks', className)}>
    <path d="M3 6h10v3c0 3-2 5-5 5s-5-2-5-5V6Z" />
    <path d="M21 6h-4v3c0 1.7-.6 3.2-1.6 4.2" />
    <path d="M18 13c0 2.5-1.5 5-5 5l1 3" />
    <path d="M6.5 11c.5-.5 1.2-.5 1.7 0" />
    <path d="M9.5 11c.5-.5 1.2-.5 1.7 0" />
    <path d="M17.5 9.5c-.5-.5-1.2-.5-1.7 0" />
    <path d="M20.5 9.5c-.5-.5-1.2-.5-1.7 0" />
    <path d="M7 14.5c.6.8 1.5 1.5 3 1.5" />
  </svg>
);

const Dance = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-dance', className)}>
    <circle cx="12" cy="4.5" r="2" />
    <path d="M8 9.5 12 11l4-1.5" />
    <path d="M12 11l-1.5 4.5" />
    <path d="M10 15.5 6.5 19" />
    <path d="M12 15.5l3 2" />
    <path d="M15 17.5 17.5 22" />
  </svg>
);

const Mask = (props: IconProps) => <VenetianMask {...props} />;
const Confetti = (props: IconProps) => <PartyPopper {...props} />;

const Jester = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-jester', className)}>
    <path d="M5 9c0-2.5 2-4.5 4.5-4.5 1.3 0 2.5.6 3.5 1.5 1-1 2.2-1.5 3.5-1.5C18 4.5 20 6.5 20 9" />
    <path d="M7 14c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    <path d="M7 14v2c0 1.7 1.3 3 3 3h4c1.7 0 3-1.3 3-3v-2" />
    <path d="M6 9c0 .8-.7 1.5-1.5 1.5S3 9.8 3 9s.7-1.5 1.5-1.5" />
    <path d="M18 9c0 .8.7 1.5 1.5 1.5S21 9.8 21 9s-.7-1.5-1.5-1.5" />
    <circle cx="11" cy="11" r=".6" />
    <circle cx="13" cy="11" r=".6" />
  </svg>
);

const Marquee = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-marquee', className)}>
    <path d="M4 11c0-4 3.6-7 8-7s8 3 8 7" />
    <path d="M4 11h16v6H4z" />
    <path d="M7 11v6" />
    <path d="M12 11v6" />
    <path d="M17 11v6" />
    <path d="M6 17h12" />
    <circle cx="8" cy="7" r=".6" />
    <circle cx="16" cy="7" r=".6" />
  </svg>
);

const CottonCandy = ({ className, ...props }: IconProps) => (
  <svg {...svgDefaults} {...props} className={buildIconClassName('lucide lucide-cotton-candy', className)}>
    <path d="M12 22c-1.5-2-2.5-4.5-2.5-7.5" />
    <path d="M12 22c1-2 2-4.5 2-7.5" />
    <path d="M7.5 9.5c0-2.8 2.2-5 4.5-5s4.5 1.9 4.5 4.8-2.5 5.2-4.5 5.2-4.5-2.2-4.5-5z" />
    <path d="M9 7c-.5-.5-1.3-1-2-.9-1.6.2-2.5 1.6-2.5 3.2 0 1.5 1 3 2.6 3.3" />
    <path d="M15 7c.5-.5 1.3-1 2-.9 1.6.2 2.5 1.6 2.5 3.2 0 1.5-1 3-2.6 3.3" />
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
  // {
  //   id: 'cartoon_ghost',
  //   name: 'Cartoon Ghost',
  //   emoji: '👻',
  //   icon: Ghost,
  //   description: 'Playful ghostly overlay'
  // },
  // {
  //   id: 'pumpkin_aura',
  //   name: 'Pumpkin Aura',
  //   emoji: '🎃',
  //   icon: Flame,
  //   description: 'Fiery Halloween glow'
  // },
  // {
  //   id: 'witch_makeover',
  //   name: 'Witch Makeover',
  //   emoji: '🧙‍♀️',
  //   icon: Wand2,
  //   description: 'Pointed hat & enchanted makeup'
  // },
  // {
  //   id: 'vampire_glam',
  //   name: 'Vampire Glam',
  //   emoji: '🧛‍♀️',
  //   icon: Moon,
  //   description: 'Glam fangs & midnight couture'
  // },
  // {
  //   id: 'zombie_decay',
  //   name: 'Zombie Decay',
  //   emoji: '🧟',
  //   icon: Skull,
  //   description: 'Undead costume & FX makeup'
  // },
  // {
  //   id: 'bubble_mirage',
  //   name: 'Bubble Mirage',
  //   emoji: '🎈',
  //   icon: Bubbles,
  //   description: 'Dreamy pastel bubbles & carnival glow'
  // },
  // {
  //   id: 'laser_carnival',
  //   name: 'Laser Carnival',
  //   emoji: '⚡',
  //   icon: Laser,
  //   description: 'Neon beams & energized carnival lights'
  // },
  {
    id: 'sparkle_rain',
    name: 'Sparkle Rain',
    emoji: '✨',
    icon: Sparkles,
    description: 'Glitter drift & warm glowing shimmer'
  },
  // {
  //   id: 'ai_masquerade',
  //   name: 'AI Masquerade',
  //   emoji: '🕶️',
  //   icon: Mask,
  //   description: 'Futuristic holographic masquerade masks'
  // },
  // {
  //   id: 'glitch_glam',
  //   name: 'Glitch Glam',
  //   emoji: '🌀',
  //   icon: Glitch,
  //   description: 'Holographic distortions & neon shimmer'
  // },
  {
    id: 'confetti_explosion',
    name: 'Confetti Explosion',
    emoji: '🎉',
    icon: Confetti,
    description: 'Joyful carnival confetti burst mid-motion'
  },
  {
    id: 'mask_magic',
    name: 'Mask Magic',
    emoji: '🎭',
    icon: Masks,
    description: 'Golden smoke, ornate masks, & warm glow'
  },
  {
    id: 'electric_groove',
    name: 'Electric Groove',
    emoji: '💃',
    icon: Dance,
    description: 'Neon motion trails & carnival rhythm'
  },
  {
    id: 'joker_illusion',
    name: 'Joker Illusion',
    emoji: '🃏',
    icon: Jester,
    description: 'Harlequin makeup, floating cards, & mischievous neon'
  },
  {
    id: 'midway_marquee',
    name: 'Midway Marquee',
    emoji: '🎪',
    icon: Marquee,
    description: 'Glowing tent lights & vintage carnival marquee glow'
  },
  // {
  //   id: 'cotton_candy_twirl',
  //   name: 'Cotton Candy Twirl',
  //   emoji: '🍭',
  //   icon: CottonCandy,
  //   description: 'Pastel sugar clouds & swirling fairground sparkle'
  // }
];

export default function EffectPicker({ selectedEffect, onSelectEffect, disabled }: EffectPickerProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-orange-400 mb-4 text-center flex items-center justify-center gap-2">
        <Ghost className="w-6 h-6" />
        Choose Your Effect
      </h2>

      <div className="grid grid-cols-5 gap-4 items-stretch">
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
