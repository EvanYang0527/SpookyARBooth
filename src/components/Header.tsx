import { Leaf, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';

type HeaderProps = {
  username?: string;
  role?: 'admin' | 'user' | null;
  onLogout?: () => void;
  onAdminClick?: () => void;
};

export default function Header({ username, role, onLogout, onAdminClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-amber-950 border-b border-amber-600/30 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-600/50">
            <Leaf className="w-7 h-7 text-amber-950" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-amber-400">ITS Technology Innovation Office</h1>
            <p className="text-xs text-amber-200/60">Gratitude Photo Booth</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-amber-400">
            <Leaf className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Gratitude Photo Booth</span>
          </div>

          {username && (
            <div className="flex items-center gap-3">
              {role === 'admin' && onAdminClick && (
                <button
                  type="button"
                  onClick={onAdminClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30 text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </button>
              )}

              <div className="flex items-center gap-2 bg-amber-900/60 border border-amber-500/40 text-amber-100 px-3 py-1.5 rounded-full shadow-lg shadow-amber-900/20">
                <UserCircle className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium">{username}</span>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-full text-amber-200/60 hover:text-amber-400 hover:bg-amber-900/50 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
