import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import effectsRoutes from './routes/effects';
import adminRoutes from './routes/admin';
import { ensureTablesExist, ensureAdminUser } from './services/tableStorage';
import { ensureContainerExists } from './services/blobStorage';

const app = express();

// Parse JSON bodies up to 20 MB (base64 images can be large)
app.use(express.json({ limit: '20mb' }));

// CORS — only needed when the frontend dev server runs separately
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
if (allowedOrigins.length > 0) {
  app.use(cors({ origin: allowedOrigins, credentials: true }));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/effects', effectsRoutes);
app.use('/api/admin', adminRoutes);

// Serve the Vite production build (../dist relative to backend/)
const distPath = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = Number(process.env.PORT) || 3001;

async function start() {
  try {
    await Promise.all([ensureTablesExist(), ensureContainerExists()]);
    await ensureAdminUser();
    console.log('Azure Storage tables and container ready.');
  } catch (err) {
    console.warn('Warning: Could not initialize Azure Storage:', (err as Error).message);
    console.warn('The server will start but storage features may not work.');
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start();
