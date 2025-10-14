import { GoogleGenAI } from '@google/genai';
import { EffectType } from '../components/EffectPicker';

type ExtractedImage = {
  base64: string;
  mimeType?: string;
};

const EFFECT_PROMPTS: Record<EffectType, string> = {
  cartoon_ghost:
    'Add a whimsical translucent cartoon ghost hovering just behind the subject. Keep the subject sharp and friendly while blending the ghost with a cool blue glow.',
  haunted_fog:
    'Wrap the scene in a creeping supernatural fog that pools around the subject. Maintain clarity on faces while adding soft volumetric lighting and moonlit ambience.',
  vhs_glitch:
    'Transform the photo with a retro VHS horror vibe. Introduce analog scanlines, color channel offsets, and spectral distortion while preserving the subject as the focal point.',
  pumpkin_aura:
    'Surround the subject with a fiery pumpkin-orange aura. Add subtle embers, jack-o\'-lantern inspired lighting, and warm highlights that enhance the Halloween mood.'
};

const getIntensityDescriptor = (intensity: number): string => {
  if (intensity <= 30) return 'subtle';
  if (intensity <= 60) return 'balanced';
  if (intensity <= 85) return 'dramatic';
  return 'maximum';
};

const buildPrompt = (effect: EffectType, intensity: number): string => {
  const descriptor = getIntensityDescriptor(intensity);

  return [
    'You are a creative Halloween photo editor. Apply the requested transformation directly to the provided photo.',
    EFFECT_PROMPTS[effect],
    `The overall intensity should feel ${descriptor}.` ,
    'Respect the subject\'s facial features and keep them recognizable.',
    'Return only the transformed image without text overlays or borders.'
  ].join(' ');
};

type InlineDataPart = {
  inlineData?: {
    data?: string;
    mimeType?: string;
  };
  data?: string;
  mimeType?: string;
  b64_json?: string;
  imageBase64?: string;
  imageBytes?: string;
};

const extractBase64FromPart = (part: unknown): ExtractedImage | null => {
  if (!part || typeof part !== 'object') {
    if (typeof part === 'string' && part.startsWith('data:image')) {
      const [header, data] = part.split(',', 2);
      const mimeType = header.match(/data:(.*);base64/);
      return data
        ? {
            base64: data,
            mimeType: mimeType?.[1]
          }
        : null;
    }

    return null;
  }

  const inlineData = (part as InlineDataPart).inlineData;
  if (inlineData?.data) {
    return {
      base64: inlineData.data,
      mimeType: inlineData.mimeType
    };
  }

  const data = (part as InlineDataPart).data;
  const mimeType = (part as InlineDataPart).mimeType;
  if (data) {
    return { base64: data, mimeType };
  }

  const imageBase64 = (part as InlineDataPart).b64_json || (part as InlineDataPart).imageBase64;
  if (imageBase64) {
    return { base64: imageBase64, mimeType };
  }

  const imageBytes = (part as InlineDataPart).imageBytes;
  if (imageBytes) {
    return { base64: imageBytes, mimeType };
  }

  return null;
};

const extractImageFromResponse = (payload: unknown): ExtractedImage | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as Record<string, unknown>;

  const candidates = data.candidates;
  if (Array.isArray(candidates)) {
    for (const candidate of candidates) {
      const parts = (candidate as { content?: { parts?: unknown[] } }).content?.parts;
      if (Array.isArray(parts)) {
        for (const part of parts) {
          const extracted = extractBase64FromPart(part);
          if (extracted?.base64) {
            return extracted;
          }
        }
      }
    }
  }

  const images = data.images;
  if (Array.isArray(images)) {
    for (const image of images) {
      const extracted = extractBase64FromPart(image);
      if (extracted?.base64) {
        return extracted;
      }
    }
  }

  const predictions = data.predictions;
  if (Array.isArray(predictions)) {
    for (const prediction of predictions) {
      const extracted = extractBase64FromPart(prediction);
      if (extracted?.base64) {
        return extracted;
      }
    }
  }

  const image = data.image;
  if (image) {
    const extracted = extractBase64FromPart(image);
    if (extracted?.base64) {
      return extracted;
    }
  }

  return null;
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
  const apiKey = import.meta.env.GOOGLE_API_KEY;
  const model = import.meta.env.GOOGLE_IMAGE_MODEL || 'gemini-2.5-flash-image';

  if (!apiKey) {
    throw new EffectsApiError(
      'Google Gemini API configuration is missing. Please set GOOGLE_API_KEY in your .env file.',
      undefined,
      false
    );
  }

  const [meta, rawBase64] = imageData.includes(',') ? imageData.split(',', 2) : [undefined, imageData];
  const base64Image = rawBase64 || imageData;
  const mimeTypeMatch = meta?.match(/data:(.*);base64/);
  const sourceMimeType = mimeTypeMatch?.[1] || 'image/png';

  const prompt = buildPrompt(effect, intensity);
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: sourceMimeType
              }
            }
          ]
        }
      ]
    });

    const extractedImage = extractImageFromResponse(response);

    if (!extractedImage?.base64) {
      throw new EffectsApiError('AI response missing image data', undefined, false);
    }

    const outputMimeType = extractedImage.mimeType || 'image/png';
    const processedImage = extractedImage.base64.startsWith('data:')
      ? extractedImage.base64
      : `data:${outputMimeType};base64,${extractedImage.base64}`;

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

    const statusCode = typeof (error as { status?: number }).status === 'number'
      ? (error as { status?: number }).status
      : undefined;
    const errorMessage =
      (error instanceof Error && error.message) ||
      (typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: unknown }).message)
        : 'Unknown error');

    throw new EffectsApiError(`Unexpected error: ${errorMessage}`, statusCode, statusCode === 429 || (statusCode ?? 0) >= 500);
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
