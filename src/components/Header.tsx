import { Ghost } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-orange-500/30 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
            <Ghost className="w-7 h-7 text-gray-900" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-orange-400">ITS Technology Innovation Office</h1>
            <p className="text-xs text-gray-400">University IT Services</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-orange-400">
          <Ghost className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Spooky AR Photo Booth</span>
        </div>
      </div>
    </header>
  );
}
