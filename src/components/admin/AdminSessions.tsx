import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, X } from 'lucide-react';
import { getSessions, AdminSession } from '../../services/adminApi';

const EFFECT_LABELS: Record<string, string> = {
  thanksgiving_glow: 'Thanksgiving Glow',
  autumn_leaves: 'Autumn Leaves',
  grateful_sparkle: 'Grateful Sparkle',
  harvest_magic: 'Harvest Magic',
  cozy_thanksgiving: 'Cozy Thanksgiving',
  fall_confetti: 'Fall Confetti',
  golden_harvest: 'Golden Harvest',
  thankful_moments: 'Thankful Moments',
  pumpkin_patch: 'Pumpkin Patch',
  autumn_bokeh: 'Autumn Bokeh',
  fall_crown: 'Fall Crown',
  thanksgiving_magic: 'Thanksgiving Magic',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function AdminSessions() {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<AdminSession | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setSessions(await getSessions());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-amber-200/60 text-sm">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded</p>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 rounded-lg p-4 mb-4">{error}</div>
      )}

      {sessions.length === 0 && !error && (
        <div className="text-center py-16 text-amber-200/40">No sessions recorded yet.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSelected(s); setShowOriginal(false); }}
            className="group relative rounded-xl overflow-hidden border-2 border-amber-800/40 hover:border-amber-500/60 transition-all shadow-lg aspect-square bg-amber-950/50"
          >
            {s.generatedUrl ? (
              <img
                src={s.generatedUrl}
                alt={`Session by ${s.username}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-200/30 text-xs">No image</div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-white text-xs font-semibold truncate">{s.username}</p>
              <p className="text-amber-300/80 text-xs truncate">{EFFECT_LABELS[s.effect] ?? s.effect}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-amber-950 border border-amber-700/40 rounded-2xl shadow-2xl max-w-2xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-amber-200 font-semibold">{selected.username}</p>
                <p className="text-amber-300/60 text-sm">{EFFECT_LABELS[selected.effect] ?? selected.effect}</p>
                <p className="text-amber-200/40 text-xs mt-0.5">{formatDate(selected.timestamp)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-amber-200/60 hover:text-amber-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3">
              <img
                src={(showOriginal ? selected.originalUrl : selected.generatedUrl) ?? ''}
                alt={showOriginal ? 'Original photo' : 'Generated photo'}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowOriginal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  !showOriginal
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-amber-900/50 text-amber-300 hover:bg-amber-800/60'
                }`}
              >
                Generated
              </button>
              <button
                onClick={() => setShowOriginal(true)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  showOriginal
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-amber-900/50 text-amber-300 hover:bg-amber-800/60'
                }`}
              >
                Original
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
