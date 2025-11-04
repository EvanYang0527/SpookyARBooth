import { Ghost, LogOut, UserCircle } from 'lucide-react';

type HeaderProps = {
  username?: string;
  onLogout?: () => void;
};

export default function Header({ username, onLogout }: HeaderProps) {
  return (
    <header className="bg-gray-900 border-b border-orange-500/30 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
            <Ghost className="w-7 h-7 text-gray-900" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-orange-400">ITS Technology Innovation Office</h1>
            <p className="text-xs text-gray-400">AI Photo Booth</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-orange-400">
            <Ghost className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">AI Photo Booth</span>
          </div>

          {username && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-800/80 border border-orange-500/40 text-gray-100 px-3 py-1.5 rounded-full shadow-lg shadow-orange-900/20">
                <UserCircle className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-medium">{username}</span>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-full text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors"
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
