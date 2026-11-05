import { Router, Request, Response } from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate';
import { applyEffect } from '../services/openai';
import { uploadPhoto } from '../services/blobStorage';
import { createSession } from '../services/tableStorage';

const router = Router();

const requireAuth = process.env.REQUIRE_AUTH === 'true';

router.post(
  '/apply',
  requireAuth ? authenticate : optionalAuthenticate,
  async (req: Request, res: Response) => {
    const { imageData, effect, intensity = 70 } = req.body as {
      imageData?: string;
      effect?: string;
      intensity?: number;
    };

    if (!imageData || !effect) {
      res.status(400).json({ error: 'imageData and effect are required.' });
      return;
    }

    const username = req.auth?.username ?? 'guest';
    const dateStr = new Date().toISOString().slice(0, 10);
    const timestamp = Date.now();
    const originalBlobName = `originals/${dateStr}/${username}/${timestamp}.jpg`;
    const generatedBlobName = `generated/${dateStr}/${username}/${timestamp}_${effect}.jpg`;

    // Save original photo (non-blocking — don't fail the request if storage is down)
    uploadPhoto(originalBlobName, imageData).catch((err) =>
      console.error('Failed to save original photo:', err)
    );

    let resultImageData: string;
    try {
      resultImageData = await applyEffect(imageData, effect, Number(intensity));
    } catch (err: unknown) {
      const apiErr = err as Error & { statusCode?: number; isRetryable?: boolean };
      console.error('OpenAI effect error:', apiErr.message);
      res.status(apiErr.statusCode ?? 500).json({
        error: apiErr.message,
        isRetryable: apiErr.isRetryable ?? false,
      });
      return;
    }

    // Save generated photo and session record (non-blocking)
    Promise.all([
      uploadPhoto(generatedBlobName, resultImageData),
      createSession({ username, effect, originalBlobName, generatedBlobName }),
    ]).catch((err) => console.error('Failed to save generated photo/session:', err));

    res.json({ imageData: resultImageData });
  }
);

export default router;
