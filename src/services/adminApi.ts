function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('spooky_ar_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  username: string;
  role: 'admin' | 'user';
  expiresAt: string; // ISO string or ''
  createdAt: string;
  createdBy: string;
  isExpired: boolean;
}

export async function getUsers(): Promise<AdminUser[]> {
  const res = await fetch('/api/admin/users', { headers: authHeaders() });
  return handleResponse<AdminUser[]>(res);
}

export async function createUser(data: {
  username: string;
  password: string;
  role: 'admin' | 'user';
  expiresAt: string; // ISO string or ''
}): Promise<void> {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  await handleResponse<unknown>(res);
}

export async function updateUserExpiry(username: string, expiresAt: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${encodeURIComponent(username)}/expiry`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ expiresAt }),
  });
  await handleResponse<unknown>(res);
}

export async function deleteUser(username: string): Promise<void> {
  const res = await fetch(`/api/admin/users/${encodeURIComponent(username)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export interface AdminSession {
  id: string;
  username: string;
  effect: string;
  timestamp: string;
  originalUrl: string | null;
  generatedUrl: string | null;
}

export async function getSessions(): Promise<AdminSession[]> {
  const res = await fetch('/api/admin/sessions', { headers: authHeaders() });
  return handleResponse<AdminSession[]>(res);
}
