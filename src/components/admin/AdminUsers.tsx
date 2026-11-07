import { useEffect, useState } from 'react';
import { UserPlus, Trash2, CalendarClock, Loader2, ShieldCheck, User, Palette } from 'lucide-react';
import { getUsers, createUser, updateUserExpiry, updateUserTheme, deleteUser, AdminUser } from '../../services/adminApi';
import { THEME_OPTIONS } from '../../themes';

function defaultExpiry(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function formatExpiry(expiresAt: string, isExpired: boolean): string {
  if (!expiresAt) return 'Never';
  const d = new Date(expiresAt);
  const diff = Math.round((d.getTime() - Date.now()) / 86400000);
  if (isExpired) return `Expired ${Math.abs(diff)}d ago`;
  return `${d.toLocaleDateString()} (${diff}d left)`;
}

function themeLabel(themeId: string): string {
  return THEME_OPTIONS.find(t => t.id === themeId)?.label ?? themeId;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    theme: 'gratitude_itsba2026' as string,
    expiresAt: defaultExpiry(),
    neverExpires: false,
  });
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingExpiry, setEditingExpiry] = useState<string | null>(null);
  const [newExpiry, setNewExpiry] = useState('');

  const [editingTheme, setEditingTheme] = useState<string | null>(null);
  const [newTheme, setNewTheme] = useState('');

  async function load() {
    try {
      setError('');
      setUsers(await getUsers());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setFormError('Username and password are required.');
      return;
    }
    setCreating(true);
    setFormError('');
    try {
      await createUser({
        username: form.username.trim(),
        password: form.password,
        role: form.role,
        theme: form.theme,
        expiresAt: form.neverExpires ? '' : new Date(form.expiresAt).toISOString(),
      });
      setForm({ username: '', password: '', role: 'user', theme: 'gratitude_itsba2026', expiresAt: defaultExpiry(), neverExpires: false });
      await load();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(username: string) {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      await deleteUser(username);
      await load();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function handleUpdateExpiry(username: string) {
    try {
      await updateUserExpiry(username, newExpiry ? new Date(newExpiry).toISOString() : '');
      setEditingExpiry(null);
      await load();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function handleUpdateTheme(username: string) {
    try {
      await updateUserTheme(username, newTheme);
      setEditingTheme(null);
      await load();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-300 rounded-lg p-4">{error}</div>
      )}

      {/* User table */}
      <div className="overflow-x-auto rounded-xl border border-amber-800/40">
        <table className="w-full text-sm">
          <thead className="bg-amber-900/40 text-amber-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Theme</th>
              <th className="px-4 py-3 text-left">Expiry</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/30">
            {users.map((u) => (
              <tr key={u.username} className="hover:bg-amber-900/20 transition-colors">
                <td className="px-4 py-3 font-medium text-amber-100">{u.username}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    u.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-gray-700/60 text-gray-300'
                  }`}>
                    {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-amber-200/80">
                  {editingTheme === u.username ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                        className="bg-amber-950 border border-amber-700 rounded px-2 py-1 text-amber-100 text-xs"
                      >
                        {THEME_OPTIONS.map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleUpdateTheme(u.username)}
                        className="text-xs bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTheme(null)}
                        className="text-xs text-amber-400 hover:text-amber-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs">{themeLabel(u.theme ?? 'gratitude_itsba2026')}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-amber-200/80">
                  {editingExpiry === u.username ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={newExpiry}
                        onChange={(e) => setNewExpiry(e.target.value)}
                        className="bg-amber-950 border border-amber-700 rounded px-2 py-1 text-amber-100 text-xs"
                      />
                      <button
                        onClick={() => handleUpdateExpiry(u.username)}
                        className="text-xs bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingExpiry(null)}
                        className="text-xs text-amber-400 hover:text-amber-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    formatExpiry(u.expiresAt, u.isExpired)
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${u.isExpired ? 'text-red-400' : 'text-green-400'}`}>
                    {u.isExpired ? 'Expired' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingTheme(u.username);
                        setNewTheme(u.theme ?? 'gratitude_itsba2026');
                      }}
                      className="p-1.5 text-blue-400 hover:text-blue-200 hover:bg-blue-800/40 rounded transition-colors"
                      title="Change theme"
                    >
                      <Palette className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingExpiry(u.username);
                        setNewExpiry(u.expiresAt ? u.expiresAt.slice(0, 10) : '');
                      }}
                      className="p-1.5 text-amber-400 hover:text-amber-200 hover:bg-amber-800/40 rounded transition-colors"
                      title="Edit expiry"
                    >
                      <CalendarClock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.username)}
                      className="p-1.5 text-red-400 hover:text-red-200 hover:bg-red-900/30 rounded transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-amber-200/40">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create user form */}
      <div className="bg-amber-950/50 border border-amber-800/40 rounded-xl p-6">
        <h3 className="text-amber-300 font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add New User
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-amber-300/70 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="username"
              className="w-full bg-amber-950 border border-amber-700/60 rounded-lg px-3 py-2 text-amber-100 placeholder:text-amber-200/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-amber-300/70 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-amber-950 border border-amber-700/60 rounded-lg px-3 py-2 text-amber-100 placeholder:text-amber-200/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-amber-300/70 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
              className="w-full bg-amber-950 border border-amber-700/60 rounded-lg px-3 py-2 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-amber-300/70 mb-1">Theme</label>
            <select
              value={form.theme}
              onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
              className="w-full bg-amber-950 border border-amber-700/60 rounded-lg px-3 py-2 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {THEME_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-amber-300/70 mb-1">
              Expiry date <span className="text-amber-500/60">(default: 14 days)</span>
            </label>
            <input
              type="date"
              value={form.expiresAt}
              disabled={form.neverExpires}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              className="w-full bg-amber-950 border border-amber-700/60 rounded-lg px-3 py-2 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-40"
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-amber-200/60">
              <input
                type="checkbox"
                checked={form.neverExpires}
                onChange={(e) => setForm((f) => ({ ...f, neverExpires: e.target.checked }))}
                className="accent-amber-500"
              />
              Never expires (admin accounts)
            </label>
          </div>

          {formError && (
            <div className="sm:col-span-2 text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
              {formError}
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 font-semibold rounded-lg transition-colors"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {creating ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
