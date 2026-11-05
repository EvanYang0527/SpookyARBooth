import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../services/tableStorage';

const router = Router();

function signToken(username: string, role: 'admin' | 'user') {
  return jwt.sign(
    { username, role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );
}

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const trimmed = username.trim();

  try {
    // --- Primary path: Azure Table Storage ---
    const user = await getUserByUsername(trimmed);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid username or password.' });
        return;
      }
      if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
        res.status(403).json({ error: 'Your account has expired. Please contact an administrator.' });
        return;
      }
      res.json({ token: signToken(user.username, user.role), role: user.role, username: user.username });
      return;
    }

    res.status(401).json({ error: 'Invalid username or password.' });
  } catch {
    // --- Fallback: Azure Storage not configured — check env-var admin credentials ---
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminUsername && adminPassword && trimmed === adminUsername && password === adminPassword) {
      console.warn('Logged in via env-var admin fallback (Azure Storage not configured).');
      res.json({ token: signToken(adminUsername, 'admin'), role: 'admin', username: adminUsername });
      return;
    }

    res.status(401).json({ error: 'Invalid username or password.' });
  }
});

export default router;
