import { EffectType } from '../components/EffectPicker';

type ExtractedImage = {
  base64: string;
  mimeType?: string;
};

const EFFECT_PROMPTS: Record<EffectType, string> = {
  cartoon_ghost:
    'Add whimsical translucent cartoon ghosts swirling just behind each person and sprinkle floating spectral lanterns around the group. Subtly tint the surrounding environment with a playful moonlit glow while keeping every person otherwise unchanged.',
  haunted_fog:
    'Wrap the scene in a creeping supernatural fog that pools around every person, with hints of moonbeams and distant haunted silhouettes in the background. Maintain clarity on faces while adding soft volumetric lighting and moonlit ambience.',
  vhs_glitch:
    'Transform the photo with a retro VHS horror vibe. Introduce analog scanlines, color channel offsets, and spectral distortion while turning the surroundings into a flickering haunted TV scene with warped neon signage, keeping each person as a crisp focal point.',
  pumpkin_aura:
    'Surround every person with a fiery pumpkin-orange aura. Add subtle embers, glowing jack-o\'-lanterns, and enchanted autumn foliage radiating from the environment while keeping each person recognizable.',
  witch_makeover:
    'Give each person a stylish witch costume complete with pointed hats, flowing cloaks, and glowing spell props that suit their pose. Apply theatrical makeup with emerald eyeshadow and dramatic liner to every face. Keep most of the background environment unchanged, only adding a faint magical glow near the group.',
  vampire_glam:
    'Transform each person into an elegant vampire aristocrat with tailored dark ensembles, high collars, and ornate jewelry. Apply pale porcelain skin, wine-red lipstick, and subtle fang highlights to every face while keeping the background largely unchanged aside from soft moonlit accents around the group.',
  zombie_decay:
    'Create a cinematic zombie makeover on every person. Add distressed clothing textures, cracked and mottled skin with cool undertones, and tasteful faux blood near mouths while keeping each person recognizable. Enhance with sunken eyeshadow and contouring, and keep the background mostly unchanged except for subtle atmospheric haze near the group.',
  bubble_mirage:
    'Fill the scene with dreamy pastel bubbles drifting across the frame and bathe the environment in a soft carnival glow. Keep every person clear and in focus while adding gentle light refractions and translucent bubble reflections around them.',
  laser_carnival:
    'Add vibrant neon laser beams and energetic carnival lighting streaking around the group. Maintain sharp detail on every person while layering in colorful light rays, prisms, and energized atmosphere that suggest motion and music.',
  sparkle_rain:
    'Let shimmering glitter rain fall around every person, catching warm light as it drifts through the scene. Preserve facial clarity and highlight edges with a glowing shimmer while the background picks up twinkling reflections and soft bokeh.',
  ai_masquerade:
    'Project futuristic holographic masquerade masks onto each face, blending metallic sheens with translucent light effects that feel high-tech yet elegant. Keep everyone fully recognizable while enhancing the environment with subtle digital overlays and prismatic glow.',
  glitch_glam:
    'Apply stylish holographic glitches and neon shimmer bands that warp around each person like a fashion-forward distortion. Retain crystal-clear facial features while adding layered scanlines, pixel shifts, and iridescent trails that give the scene an avant-garde energy.',
  confetti_explosion:
    'Freeze a joyful mid-motion burst of confetti surrounding the group with vivid color and depth. Ensure every person stays crisp while scattering paper pieces, sparkles, and celebratory motion blur through the air.',
  mask_magic:
    'Adorn each person with ornate carnival masks, sculpted metallic accents, and curling golden smoke that feels theatrical yet refined. Maintain facial recognition while blending in warm ambient lighting and rich festival textures around the group.',
  electric_groove:
    'Infuse the photo with neon motion trails and rhythmic light waves dancing around every person. Keep their outfits and expressions sharp while adding dynamic streaks, glowing outlines, and colorful pulses that convey a lively carnival performance.',
  joker_illusion:
    'Transform each person with bold harlequin makeup, jewel-toned jester collars, and holographic cap-and-bells accents that match their pose. Spin a deck of luminous playing cards and ribbons of emerald and violet light around the group while keeping every face expressive and sharp.',
  midway_marquee:
    'Surround the group with a glowing carnival midway marquee complete with retro bulbs, striped tent drapery, and cascading warm light. Keep every person crystal clear while extending the scene with soft lens flares, marquee signage, and subtle fairground silhouettes in the distance.',
  cotton_candy_twirl:
    'Envelope the group in pastel cotton candy clouds that swirl gently and emit a sugary prismatic glow. Maintain skin tones and facial detail while adding sparkling sugar dust, soft pink and blue highlights, and playful fairground bokeh throughout the background.'
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
    'You are a creative Halloween photo editor. Apply the requested transformation directly to the provided photo and support multiple people if present.',
    EFFECT_PROMPTS[effect],
    `Aim for a ${descriptor} intensity so the transformation feels intentional without overpowering the original photo.`,
    'Make sure every person is clear and the overall photo is not too dark. Respect each person\'s facial features and keep them without any unintended edits.',
    'Do not remove or merge people; treat each individual consistently.',
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

  const payloadData = payload as Record<string, unknown>;

  const candidates = payloadData.candidates;
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

  const images = payloadData.images;
  if (Array.isArray(images)) {
    for (const image of images) {
      const extracted = extractBase64FromPart(image);
      if (extracted?.base64) {
        return extracted;
      }
    }
  }

  const generatedImages = (payloadData as { generatedImages?: unknown }).generatedImages;
  if (Array.isArray(generatedImages)) {
    for (const generated of generatedImages) {
      const extracted = extractBase64FromPart(generated);
      if (extracted?.base64) {
        return extracted;
      }
    }
  }

  const imageArtifacts = (payloadData as { imageArtifacts?: unknown }).imageArtifacts;
  if (Array.isArray(imageArtifacts)) {
    for (const artifact of imageArtifacts) {
      const extracted = extractBase64FromPart(artifact);
      if (extracted?.base64) {
        return extracted;
      }
    }
  }

  const predictions = payloadData.predictions;
  if (Array.isArray(predictions)) {
    for (const prediction of predictions) {
      const extracted = extractBase64FromPart(prediction);
      if (extracted?.base64) {
        return extracted;
      }
    }
  }

  const dataArray = payloadData.data;
  if (Array.isArray(dataArray)) {
    for (const item of dataArray) {
      const extracted = extractBase64FromPart(item);
      if (extracted?.base64) {
        return extracted;
      }
    }
  }

  const image = payloadData.image;
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
  const apiBase =
    import.meta.env.VITE_GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-image';

  if (!apiKey) {
    throw new EffectsApiError(
      'Gemini configuration is missing. Please set VITE_GEMINI_API_KEY (and optionally VITE_GEMINI_MODEL / VITE_GEMINI_API_BASE_URL) in your .env file.',
      undefined,
      false
    );
  }

  const sanitizedBaseUrl = apiBase.replace(/\/+$/, '');

  const [meta, rawBase64] = imageData.includes(',') ? imageData.split(',', 2) : [undefined, imageData];
  const base64Image = (rawBase64 || imageData).replace(/\s/g, '');
  const mimeTypeMatch = meta?.match(/data:(.*);base64/);
  const sourceMimeType = mimeTypeMatch?.[1] || 'image/png';

  const prompt = buildPrompt(effect, intensity);

  try {
    const url =
      `${sanitizedBaseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const body = {
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
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      let errorMessage = `Gemini request failed with status ${response.status}`;
      try {
        const errorPayload = await response.json();
        const apiError = (errorPayload as { error?: { message?: string } }).error?.message;
        if (apiError) {
          errorMessage = apiError;
        }
      } catch (parseError) {
        if (parseError instanceof Error && parseError.message) {
          errorMessage += ` (${parseError.message})`;
        }
      }

      throw new EffectsApiError(errorMessage, response.status, response.status === 429 || response.status >= 500);
    }

    const payload = await response.json();
    const extractedImage = extractImageFromResponse(payload);

    if (!extractedImage?.base64) {
      throw new EffectsApiError('Gemini response missing image data', undefined, false);
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
  intensity: number = 28,
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
