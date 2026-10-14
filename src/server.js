import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { configureCloudinary, isCloudinaryEnabled } from './config/cloudinary.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { uploadsDir } from './middleware/upload.js';
import { ensureSeedData } from './services/seedService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseOrigins(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

async function start() {
  await connectDB(env.mongoUri);
  await ensureSeedData();
  console.log(`Admin: ${env.adminEmail}`);

  if (configureCloudinary()) {
    console.log('Cloudinary uploads enabled');
  } else {
    console.log('Local disk uploads (set CLOUDINARY_* for production persistence)');
  }

  const app = express();
  const allowedOrigins = parseOrigins(env.clientOrigin);
  if (process.env.RENDER_EXTERNAL_URL) {
    allowedOrigins.push(process.env.RENDER_EXTERNAL_URL.replace(/\/$/, ''));
  }

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (
          env.nodeEnv !== 'production' ||
          allowedOrigins.includes('*') ||
          allowedOrigins.includes(origin) ||
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        ) {
          return cb(null, true);
        }
        // Same-origin SPA on Render: browser may still send Origin matching the service URL
        if (allowedOrigins.length === 0) return cb(null, true);
        return cb(null, false);
      },
      credentials: true,
    })
  );
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static(uploadsDir));
  app.use('/api', apiRoutes);

  // Production: serve Vite build from the same service (single Render web service)
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  const hasFrontend = fs.existsSync(path.join(frontendDist, 'index.html'));
  if (hasFrontend) {
    app.use(express.static(frontendDist, { index: false }));
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
      res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) next(err);
      });
    });
  } else {
    app.use(notFound);
  }

  app.use(errorHandler);

  const host = '0.0.0.0';
  const server = app.listen(env.port, host, () => {
    console.log(`API listening on http://${host}:${env.port}`);
    if (hasFrontend) console.log(`Serving frontend from ${frontendDist}`);
    if (isCloudinaryEnabled()) console.log('Media storage: Cloudinary');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${env.port} is already in use. Stop the other process and try again.`);
      process.exit(1);
    }
    console.error('Server error', err);
    process.exit(1);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
