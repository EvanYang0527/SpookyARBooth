import { Leaf, Cpu, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import type { ThemeConfig } from '../themes';

type HeaderProps = {
  username?: string;
  role?: 'admin' | 'user' | null;
  onLogout?: () => void;
  onAdminClick?: () => void;
  themeConfig: ThemeConfig;
};

export default function Header({ username, role, onLogout, onAdminClick, themeConfig }: HeaderProps) {
  const { colors } = themeConfig;
  const LogoIcon = themeConfig.id === 'oix_ainative_2026' ? Cpu : Leaf;

  return (
    <header className={`sticky top-0 z-50 ${colors.headerBg} border-b ${colors.headerBorder} shadow-lg`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${colors.logoBg} rounded-lg flex items-center justify-center`}>
            <LogoIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-sm font-semibold ${colors.textPrimary}`}>{themeConfig.orgLabel}</h1>
            <p className={`text-xs ${colors.textSecondary}`}>{themeConfig.boothLabel}</p>
          </div>
        </div>

        {username && (
          <div className="flex items-center gap-3">
            {role === 'admin' && onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${colors.adminBtn}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </button>
            )}

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg ${colors.userPill}`}>
              <UserCircle className={`w-5 h-5 ${colors.textPrimary}`} />
              <span className="text-sm font-medium">{username}</span>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className={`p-2 rounded-full transition-colors ${colors.logoutBtn}`}
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
