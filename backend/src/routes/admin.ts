import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  listUsers,
  createUser,
  updateUserExpiry,
  deleteUser,
  listSessions,
} from '../services/tableStorage';
import { generateSasUrl } from '../services/blobStorage';

const router = Router();
router.use(authenticate, requireAdmin);

// ─── Users ───────────────────────────────────────────────────────────────────

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await listUsers();
    const now = new Date();
    res.json(
      users.map((u) => ({
        ...u,
        isExpired: u.expiresAt !== '' && new Date(u.expiresAt) < now,
      }))
    );
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Failed to list users.' });
  }
});

router.post('/users', async (req: Request, res: Response) => {
  const { username, password, role = 'user', expiresAt } = req.body as {
    username?: string;
    password?: string;
    role?: 'admin' | 'user';
    expiresAt?: string; // ISO string or '' for never
  };

  if (!username || !password) {
    res.status(400).json({ error: 'username and password are required.' });
    return;
  }

  // Default expiry: 14 days from now if not specified
  const resolvedExpiry =
    expiresAt !== undefined
      ? expiresAt
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  try {
    await createUser({
      username: username.trim(),
      password,
      role,
      expiresAt: resolvedExpiry,
      createdBy: req.auth!.username,
    });
    res.status(201).json({ message: 'User created.' });
  } catch (err: unknown) {
    const azErr = err as { statusCode?: number };
    if (azErr.statusCode === 409) {
      res.status(409).json({ error: 'A user with that username already exists.' });
    } else {
      console.error('Create user error:', err);
      res.status(500).json({ error: 'Failed to create user.' });
    }
  }
});

router.put('/users/:username/expiry', async (req: Request, res: Response) => {
  const { username } = req.params;
  const { expiresAt } = req.body as { expiresAt?: string };

  if (expiresAt === undefined) {
    res.status(400).json({ error: 'expiresAt is required.' });
    return;
  }

  try {
    await updateUserExpiry(username, expiresAt);
    res.json({ message: 'Expiry updated.' });
  } catch (err) {
    console.error('Update expiry error:', err);
    res.status(500).json({ error: 'Failed to update expiry.' });
  }
});

router.delete('/users/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  if (username === req.auth!.username) {
    res.status(400).json({ error: 'You cannot delete your own account.' });
    return;
  }

  try {
    await deleteUser(username);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// ─── Sessions ─────────────────────────────────────────────────────────────────

router.get('/sessions', async (_req: Request, res: Response) => {
  try {
    const sessions = await listSessions(200);
    // Attach SAS URLs so the browser can display photos (valid for 1 hour)
    const withUrls = sessions.map((s) => ({
      ...s,
      originalUrl: s.originalBlobName ? generateSasUrl(s.originalBlobName, 60) : null,
      generatedUrl: s.generatedBlobName ? generateSasUrl(s.generatedBlobName, 60) : null,
    }));
    res.json(withUrls);
  } catch (err) {
    console.error('List sessions error:', err);
    res.status(500).json({ error: 'Failed to list sessions.' });
  }
});

export default router;
