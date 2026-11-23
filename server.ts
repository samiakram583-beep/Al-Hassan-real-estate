import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const app = express();
const ROOT_DIR = process.cwd();
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const firebaseConfigPath = path.join(ROOT_DIR, 'firebase-applet-config.json');
const firebaseConfig = fs.existsSync(firebaseConfigPath)
  ? JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf-8'))
  : {};

const BOOTSTRAPPED_ADMIN_EMAIL = 'samullah404@gmail.com';

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/maps-config', (_req, res) => {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  res.json({ apiKey });
});

async function verifyAdminToken(authHeader: string | undefined): Promise<{ uid: string; email: string } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const idToken = authHeader.slice(7).trim();
  if (!idToken || !firebaseConfig.apiKey) return null;

  try {
    const lookupRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseConfig.apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!lookupRes.ok) return null;
    const lookupJson = (await lookupRes.json()) as {
      users?: Array<{ localId?: string; email?: string; emailVerified?: boolean }>;
    };
    const user = lookupJson.users?.[0];
    if (!user || !user.localId || !user.email || !user.emailVerified) return null;

    if (user.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL) {
      return { uid: user.localId, email: user.email };
    }

    // Check Firestore admins collection using the caller's ID token
    const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
    const docRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(firebaseConfig.projectId)}/databases/${encodeURIComponent(dbId)}/documents/admins/${encodeURIComponent(user.localId)}`,
      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );
    if (docRes.ok) {
      return { uid: user.localId, email: user.email };
    }
    return null;
  } catch {
    return null;
  }
}

app.post('/api/upload', async (req, res) => {
  const admin = await verifyAdminToken(req.headers.authorization);
  if (!admin) {
    res.status(403).json({ error: 'Authorized administrator authentication required.' });
    return;
  }

  const { mimeType, dataBase64 } = req.body as {
    filename?: string;
    mimeType?: string;
    dataBase64?: string;
  };

  const allowedTypes: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };

  if (!mimeType || !allowedTypes[mimeType] || !dataBase64 || typeof dataBase64 !== 'string') {
    res.status(400).json({ error: 'Invalid image payload. Supported formats: JPG, PNG, WebP.' });
    return;
  }

  const cleanBase64 = dataBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');

  if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
    res.status(400).json({ error: 'Image size must be between 1 byte and 5 MB.' });
    return;
  }

  const ext = allowedTypes[mimeType];
  const storedName = `${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const targetPath = path.join(UPLOADS_DIR, storedName);
  fs.writeFileSync(targetPath, buffer);

  res.status(201).json({
    url: `/uploads/${storedName}`,
    sizeBytes: buffer.length,
    uploadedBy: admin.uid,
  });
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      `Sitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
    ].join('\n')
  );
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const routes = ['', '/properties', '/investments', '/about', '/contact'];
  const today = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r || '/'}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === '/properties' || r === '' ? 'daily' : 'monthly'}</changefreq>
    <priority>${r === '' ? '1.0' : r === '/properties' ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
