export type LoginResponse = {
  token: string;
  role: 'admin' | 'user';
  username: string;
  theme: string;
};

export async function login(payload: { username: string; password: string }): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || 'Login failed. Please check your credentials and try again.');
  }

  const data = await response.json() as Partial<LoginResponse>;
  if (!data.token) throw new Error('Login response did not include an access token.');

  return { token: data.token, role: data.role ?? 'user', username: data.username ?? '', theme: data.theme ?? 'gratitude_itsba2026' };
}
