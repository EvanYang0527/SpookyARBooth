const EFFECT_PROMPTS: Record<string, string> = {
  thanksgiving_glow:
    'Surround every person with a warm golden Thanksgiving glow. Add softly falling autumn leaves, subtle twinkle lights, and rich amber highlights around the group. Keep every person clear and recognizable while giving the scene a cozy seasonal atmosphere.',
  autumn_leaves:
    'Fill the scene with colorful autumn leaves gently swirling around every person in shades of orange, red, gold, and burgundy. Add soft golden sunlight and subtle seasonal bokeh while keeping faces, expressions, and clothing unchanged.',
  grateful_sparkle:
    'Add an elegant Thanksgiving celebration effect with warm golden sparkles, tiny glowing lights, and softly floating autumn leaves surrounding the group. Maintain natural skin tones and facial clarity while creating a festive and welcoming atmosphere.',
  harvest_magic:
    'Transform the surroundings into a beautiful Thanksgiving harvest scene with small pumpkins, fall foliage, wheat accents, and warm string lights around the group. Keep every person completely recognizable while adding soft golden lighting and seasonal depth.',
  cozy_thanksgiving:
    'Create a cozy Thanksgiving atmosphere around every person with warm amber lighting, softly falling leaves, subtle pumpkins, and glowing autumn decorations. Preserve faces, expressions, and outfits while enhancing the environment with a welcoming seasonal glow.',
  fall_confetti:
    'Create a joyful Thanksgiving celebration with a burst of autumn-inspired confetti and colorful fall leaves around the group. Use warm orange, gold, burgundy, and brown tones while keeping every person crisp, natural, and clearly visible.',
  golden_harvest:
    'Surround the group with an elegant golden harvest effect featuring glowing autumn foliage, wheat, small pumpkins, and warm sparkling lights. Add soft golden illumination around the edges while keeping every face natural and recognizable.',
  thankful_moments:
    'Add a sophisticated Thanksgiving photo effect with floating golden leaves, warm fairy lights, and subtle autumn sparkles surrounding every person. Keep the people unchanged and in sharp focus while giving the background a warm, celebratory Thanksgiving ambience.',
  pumpkin_patch:
    'Create a playful Thanksgiving pumpkin patch atmosphere around the group with decorative pumpkins, colorful fall leaves, hay accents, and warm golden lights. Keep every person fully recognizable and naturally lit while adding cheerful seasonal details around them.',
  autumn_bokeh:
    'Bathe the scene in warm Thanksgiving colors with golden bokeh lights, softly drifting autumn leaves, and gentle amber highlights around every person. Preserve natural faces and clothing while adding an elegant fall atmosphere to the surroundings.',
  fall_crown:
    'Add delicate autumn leaf crowns and subtle fall foliage accents around each person using warm red, orange, and golden leaves. Keep faces completely recognizable and natural while adding a soft festive Thanksgiving glow around the group.',
  thanksgiving_magic:
    'Create a magical Thanksgiving celebration around the group with swirling autumn leaves, glowing golden particles, small decorative pumpkins, and warm fairy lights. Keep every person crisp and recognizable while filling the scene with rich fall colors and a joyful seasonal atmosphere.',
};

function getIntensityDescriptor(intensity: number): string {
  if (intensity <= 30) return 'subtle';
  if (intensity <= 60) return 'balanced';
  if (intensity <= 85) return 'dramatic';
  return 'maximum';
}

function buildPrompt(effect: string, intensity: number): string {
  const effectPrompt = EFFECT_PROMPTS[effect] ?? `Apply a beautiful ${effect} photo effect`;
  const descriptor = getIntensityDescriptor(intensity);
  return [
    'You are a creative Thanksgiving photo editor. Apply the requested transformation directly to the provided photo and support multiple people if present.',
    effectPrompt,
    `Aim for a ${descriptor} intensity so the transformation feels intentional without overpowering the original photo.`,
    "Make sure every person is clear and the overall photo is not too dark. Respect each person's facial features and keep them without any unintended edits.",
    'Do not remove or merge people; treat each individual consistently.',
    'Return only the transformed image without text overlays or borders.',
  ].join(' ');
}

export async function applyEffect(imageBase64: string, effect: string, intensity: number): Promise<string> {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = (process.env.AZURE_OPENAI_ENDPOINT || '').replace(/\/+$/, '');
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-image-2.5-flare';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview';

  if (!apiKey || !endpoint) {
    throw new Error('AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT must be set.');
  }

  const isOpenAICompatible = endpoint.includes('/openai/v1');
  const isAzureOpenAI = endpoint.includes('.openai.azure.com') && !isOpenAICompatible;

  let url: string;
  let authHeaders: Record<string, string>;

  if (isOpenAICompatible) {
    url = `${endpoint}/images/edits`;
    authHeaders = { Authorization: `Bearer ${apiKey}` };
  } else if (isAzureOpenAI) {
    url = `${endpoint}/openai/deployments/${encodeURIComponent(deployment)}/images/edits?api-version=${encodeURIComponent(apiVersion)}`;
    authHeaders = { 'api-key': apiKey };
  } else {
    url = `${endpoint}/images/edits?api-version=${encodeURIComponent(apiVersion)}`;
    authHeaders = { 'api-key': apiKey };
  }

  const raw = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(raw, 'base64');
  const imageBlob = new Blob([buffer], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('image[]', imageBlob, 'photo.jpg');
  formData.append('prompt', buildPrompt(effect, intensity));
  formData.append('n', '1');
  if (isOpenAICompatible) {
    formData.append('model', deployment);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: authHeaders,
    body: formData,
  });

  if (!response.ok) {
    let message = `Azure OpenAI error ${response.status}`;
    try {
      const payload = await response.json() as { error?: { message?: string } };
      if (payload.error?.message) message = payload.error.message;
    } catch {}
    const isRetryable = response.status === 429 || response.status >= 500;
    const err = new Error(message) as Error & { statusCode: number; isRetryable: boolean };
    err.statusCode = response.status;
    err.isRetryable = isRetryable;
    throw err;
  }

  const payload = await response.json() as { data?: Array<{ b64_json?: string }> };
  const b64 = payload.data?.[0]?.b64_json;
  if (!b64) throw new Error('Azure OpenAI response missing image data');

  return `data:image/png;base64,${b64}`;
}
