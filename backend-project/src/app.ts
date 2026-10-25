import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { openApiSpec } from './docs/openapi';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  // Render ושירותי ענן אחרים יושבים מאחורי Proxy - נדרש כדי לזהות נכון את כתובת ה-IP
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // CSP כבוי כי השרת מחזיר JSON, ו-Swagger UI צריך להריץ את הסקריפטים שלו
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: env.corsOrigins.includes('*') ? true : env.corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  // אתר ה-React שנבנה (frontend/dist). קיים רק אחרי בנייה, ולכן בפיתוח השרת מחזיר JSON בלבד
  const webRoot = path.resolve(process.cwd(), '../frontend/dist');
  const hasWeb = fs.existsSync(path.join(webRoot, 'index.html'));

  if (!hasWeb) {
    app.get('/', (_req, res) => {
      res.json({ name: 'Community Polls API', docs: '/api-docs', health: '/api/health' });
    });
  }

  // Swagger UI + קובץ ה-OpenAPI עצמו
  app.get('/api-docs/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: 'Community Polls API',
      swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
    }),
  );

  app.use('/api', apiRouter);

  if (hasWeb) {
    app.use(express.static(webRoot));
    // כל כתובת שאינה API מחזירה את index.html, כדי שרענון בעמוד פנימי של React יעבוד
    app.get(/^\/(?!api(\/|$)|api-docs(\/|$)).*/, (_req, res) => {
      res.sendFile(path.join(webRoot, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
