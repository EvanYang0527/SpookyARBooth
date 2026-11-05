import { useState } from 'react';
import { Users, Images, ArrowLeft } from 'lucide-react';
import AdminUsers from './AdminUsers';
import AdminSessions from './AdminSessions';

type Tab = 'users' | 'sessions';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('sessions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Photo Booth
          </button>
          <h1 className="text-2xl font-bold text-amber-300">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-amber-950/60 border border-amber-800/40 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setTab('sessions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'sessions'
                ? 'bg-amber-500 text-amber-950 shadow-lg'
                : 'text-amber-300 hover:text-amber-100 hover:bg-amber-800/40'
            }`}
          >
            <Images className="w-4 h-4" />
            Sessions
          </button>
          <button
            onClick={() => setTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'users'
                ? 'bg-amber-500 text-amber-950 shadow-lg'
                : 'text-amber-300 hover:text-amber-100 hover:bg-amber-800/40'
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </button>
        </div>

        {/* Content */}
        <div>
          {tab === 'sessions' && <AdminSessions />}
          {tab === 'users' && <AdminUsers />}
        </div>
      </div>
    </div>
  );
}
