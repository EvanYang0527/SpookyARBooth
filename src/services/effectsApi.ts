import { EffectType } from '../components/EffectPicker';

export class EffectsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'EffectsApiError';
  }
}

export async function applyEffect(
  imageData: string,
  effect: EffectType,
  intensity: number = 70
): Promise<string> {
  const token = localStorage.getItem('spooky_ar_auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch('/api/effects/apply', {
      method: 'POST',
      headers,
      body: JSON.stringify({ imageData, effect, intensity }),
    });
  } catch {
    throw new EffectsApiError('Network error. Please check your connection and try again.', undefined, true);
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let isRetryable = response.status === 429 || response.status >= 500;
    try {
      const payload = await response.json() as { error?: string; isRetryable?: boolean };
      if (payload.error) message = payload.error;
      if (typeof payload.isRetryable === 'boolean') isRetryable = payload.isRetryable;
    } catch {}
    throw new EffectsApiError(message, response.status, isRetryable);
  }

  const payload = await response.json() as { imageData?: string };
  if (!payload.imageData) {
    throw new EffectsApiError('Response missing image data.', undefined, false);
  }
  return payload.imageData;
}

export async function applyEffectWithRetry(
  imageData: string,
  effect: EffectType,
  intensity: number = 70,
  maxRetries: number = 2
): Promise<string> {
  let lastError: EffectsApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await applyEffect(imageData, effect, intensity);
    } catch (error) {
      if (error instanceof EffectsApiError) {
        lastError = error;
        if (!error.isRetryable || attempt === maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      } else {
        throw error;
      }
    }
  }

  throw lastError ?? new EffectsApiError('Failed after retries', undefined, false);
}
