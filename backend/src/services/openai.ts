const OIX_EFFECT_PROMPTS: Record<string, string> = {
  oix_ai_aura:
    'Surround each person with a soft, ethereal neural network aura. Add delicate glowing blue and cyan luminescent halos that suggest digital consciousness and AI intelligence. Include faint floating geometric particles and subtle binary code traces drifting in the atmosphere. Keep every person\'s face completely recognizable and naturally lit while creating a sense of being part of an intelligent system.',
  oix_holographic:
    'Transform the scene with stunning holographic effects. Add iridescent prismatic light refractions and translucent geometric holographic panels floating around each person. Include subtle grid lines suggesting augmented reality overlays with a deep dark background. Keep faces sharp and recognizable while giving clothing and surroundings a futuristic holographic shimmer in cool blue and cyan tones.',
  oix_cyber_circuit:
    'Overlay elegant circuit board patterns and digital pathways around each person. Add glowing PCB traces, neural connection nodes, and electric-blue data conduits weaving organically through the background. Keep people fully visible with natural features while surrounding them with a sophisticated technological tapestry in deep blue and cyan.',
  oix_neural_glow:
    'Illuminate the scene with soft glowing neural network pathways. Add interconnected luminescent nodes and synaptic connections flowing through the environment in cool blue and cyan tones, as if the group is inside a living AI system. Create a sense of intelligent connectivity while keeping every face naturally recognizable and clearly visible.',
  oix_digital_transform:
    'Apply a subtle digital transformation where the background transitions from the physical world into a sleek digital environment. Add geometric shapes, clean grid lines, and softly glowing data visualizations around the group. Keep each person\'s appearance completely natural and in focus while the world around them evolves into a sophisticated digital aesthetic.',
  oix_agent_mode:
    'Create an AI agent activation aesthetic around each person. Add subtle scanning grid overlays, pulsing status indicators, and translucent agent interface elements floating nearby. Include a cool blue ambient glow suggesting active AI processing and agent coordination. Keep faces natural and recognizable while conveying a sense of AI-empowered focus and capability.',
  oix_quantum_state:
    'Surround each person with quantum computing visualization effects. Add probability wave patterns, quantum bit spheres, and interference overlays in deep blue and indigo tones. Create an atmosphere suggesting quantum superposition and computational power with elegant geometric precision while keeping every person clearly visible and naturally lit.',
  oix_future_vision:
    'Apply an augmented reality future-vision overlay to the scene. Add transparent AR interface elements, predictive data displays, and clean HUD-style graphics floating around each person. Include subtle depth-of-field digital effects. Keep faces crystal clear and naturally lit while surrounding people with the visual language of an AI-augmented future.',
  oix_data_stream:
    'Create a flowing data stream effect around each person with softly cascading luminous particles and information flows in blue and cyan tones. The streams should feel organic and purposeful, converging toward the people as if they are the center of an intelligent data ecosystem. Keep people sharp and naturally lit at the focal point of the stream.',
  oix_innovation_spark:
    'Add electric sparks of innovation and creativity around each person with brilliant light bursts, creative energy arcs, and dynamic geometric shapes suggesting breakthrough thinking. Use electric blue, cyan, and white tones for the sparks. Maintain natural faces and ensure the glow adds energy and inspiration without overpowering the people.',
  oix_ai_native:
    'Transform the scene to suggest a world where AI is native infrastructure. Add a sophisticated layering of digital depth, ambient AI indicators, cool blue tone color grading, and intelligent system aesthetics. Keep people completely recognizable and naturally lit while surrounding them with the aesthetic of a truly AI-native environment where technology and humanity coexist seamlessly.',
  oix_open_exchange:
    'Create a collaborative open innovation atmosphere around the group. Add interconnected networks of light showing knowledge sharing, collaborative neural pathways appearing between people, and an open digital ecosystem aesthetic. Use warm-to-cool gradients suggesting the meeting of human creativity and AI intelligence. Keep everyone\'s face natural, clearly visible, and at the center of the collaborative exchange.',
};

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
  const isOix = effect.startsWith('oix_');
  const effectPrompt = (isOix ? OIX_EFFECT_PROMPTS : EFFECT_PROMPTS)[effect] ?? `Apply a beautiful ${effect} photo effect`;
  const descriptor = getIntensityDescriptor(intensity);
  const systemContext = isOix
    ? 'You are a creative AI-era photo editor specializing in futuristic and technology-themed transformations. Apply the requested transformation directly to the provided photo and support multiple people if present.'
    : 'You are a creative Thanksgiving photo editor. Apply the requested transformation directly to the provided photo and support multiple people if present.';
  return [
    systemContext,
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
