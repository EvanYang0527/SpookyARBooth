type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

const sanitizeBaseUrl = (rawBaseUrl: string | undefined): string => {
  if (!rawBaseUrl) {
    return '';
  }

  return rawBaseUrl.replace(/\/+$/, '');
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const apiBase = sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
  const url = `${apiBase}/login`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Login failed. Please check your credentials and try again.');
  }

  const data = (await response.json()) as Partial<LoginResponse>;

  if (!data?.token) {
    throw new Error('Login response did not include an access token.');
  }

  return { token: data.token };
}
