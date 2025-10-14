import { EffectType } from '../components/EffectPicker';

interface ApplyEffectRequest {
  image: string;
  effect: EffectType;
  intensity: number;
}

interface ApplyEffectResponse {
  image: string;
  meta: {
    effect: string;
    elapsed_ms: number;
  };
}

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
  const apiEndpoint = import.meta.env.VITE_EFFECTS_API;

  if (!apiEndpoint) {
    throw new EffectsApiError(
      'Effects API endpoint not configured. Please set VITE_EFFECTS_API in your .env file.',
      undefined,
      false
    );
  }

  const base64Image = imageData.split(',')[1] || imageData;

  const requestBody: ApplyEffectRequest = {
    image: base64Image,
    effect,
    intensity
  };

  try {
    const response = await fetch(`${apiEndpoint}/applyEffect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const isRetryable = response.status >= 500 || response.status === 429;

      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = await response.text() || errorMessage;
      }

      throw new EffectsApiError(errorMessage, response.status, isRetryable);
    }

    const data: ApplyEffectResponse = await response.json();

    if (!data.image) {
      throw new EffectsApiError('API response missing image data', undefined, false);
    }

    const processedImage = data.image.startsWith('data:')
      ? data.image
      : `data:image/png;base64,${data.image}`;

    return processedImage;
  } catch (error) {
    if (error instanceof EffectsApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new EffectsApiError(
        'Network error. Please check your connection and try again.',
        undefined,
        true
      );
    }

    throw new EffectsApiError(
      `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      false
    );
  }
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

        if (!error.isRetryable || attempt === maxRetries) {
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      } else {
        throw error;
      }
    }
  }

  throw lastError || new EffectsApiError('Failed after retries', undefined, false);
}
