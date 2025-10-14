import { EffectType } from '../components/EffectPicker';

type GeminiInlineDataPart = {
  inlineData?: {
    data?: string;
    mimeType?: string;
  };
  text?: string;
};

interface GeminiCandidate {
  content?: {
    parts?: GeminiInlineDataPart[];
  };
  finishReason?: string;
  safetyRatings?: Array<{
    category?: string;
    probability?: string;
  }>;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    safetyRatings?: Array<{
      category?: string;
      probability?: string;
    }>;
  };
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

const effectInstructions: Record<EffectType, string> = {
  cartoon_ghost:
    'add a translucent cartoon ghost companion near the main subject with soft glow and playful details',
  haunted_fog:
    'surround the scene with moody, haunted fog and cool moonlit lighting while keeping the subject visible',
  vhs_glitch:
    'apply a retro VHS horror glitch with chromatic aberration, scan lines, and subtle static noise',
  pumpkin_aura:
    'cast a fiery pumpkin-orange aura lighting from below with sparks and Halloween ambience',
};

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
  const apiKey = import.meta.env.GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
  const apiEndpoint =
    import.meta.env.GOOGLE_API_ENDPOINT || import.meta.env.VITE_GOOGLE_API_ENDPOINT;

  if (!apiEndpoint || !apiKey) {
    throw new EffectsApiError(
      'Google Gemini API is not configured. Please set GOOGLE_API_ENDPOINT and GOOGLE_API_KEY in your environment file.',
      undefined,
      false
    );
  }

  const base64Image = imageData.split(',')[1] || imageData;

  const effectDescription = effectInstructions[effect];
  const prompt = `You are a Halloween photo editor. Enhance the uploaded photo by applying the ${effectDescription}. Keep the original person or people recognisable, preserve proportions, and avoid adding extra text. Use an intensity of ${intensity} out of 100. Return only the final edited image.`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.95,
      topK: 32,
    },
    responseModalities: ['IMAGE'],
  };

  try {
    const endpointWithKey = apiEndpoint.includes('?')
      ? `${apiEndpoint}&key=${encodeURIComponent(apiKey)}`
      : `${apiEndpoint}?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(endpointWithKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const isRetryable = response.status >= 500 || response.status === 429;

      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else {
          errorMessage =
            errorData.error?.message || errorData.message || errorData.error || errorMessage;
        }
      } catch {
        errorMessage = await response.text() || errorMessage;
      }

      throw new EffectsApiError(errorMessage, response.status, isRetryable);
    }

    const data: GeminiResponse = await response.json();

    if (data.error?.message) {
      throw new EffectsApiError(data.error.message, data.error.code, data.error.code === 503);
    }

    const candidate = data.candidates?.[0];

    if (!candidate) {
      throw new EffectsApiError('No candidates returned from Google Gemini API', undefined, true);
    }

    if (candidate.finishReason === 'SAFETY') {
      throw new EffectsApiError(
        'The generated image was blocked by safety filters. Please try a different photo.',
        undefined,
        false
      );
    }

    const imagePart = candidate.content?.parts?.find(
      (part) => part.inlineData?.data || (part.text && /data:image\//.test(part.text))
    );

    if (!imagePart) {
      throw new EffectsApiError('Google Gemini API response did not contain image data.', undefined, true);
    }

    let processedImage: string | undefined;

    if (imagePart.inlineData?.data) {
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      const dataString = imagePart.inlineData.data;
      processedImage = dataString.startsWith('data:')
        ? dataString
        : `data:${mimeType};base64,${dataString}`;
    } else if (imagePart.text) {
      const match = imagePart.text.match(/data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+/);
      if (match) {
        processedImage = match[0];
      } else {
        const cleaned = imagePart.text.replace(/[^A-Za-z0-9+/=]/g, '');
        processedImage = `data:image/png;base64,${cleaned}`;
      }
    }

    if (!processedImage) {
      throw new EffectsApiError('Failed to parse image data from Google Gemini response.', undefined, true);
    }

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
