import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only API bridge: serves /api/kit-subscribe through the SAME handler
 * Vercel runs in production, so real end-to-end Kit tests work under
 * `npm run dev`. Credentials come from .env.local (gitignored, server-side
 * only — no VITE_ prefix, so they never enter the client bundle).
 * On Vercel this plugin never runs; /api is handled by the platform.
 */
function devApiBridge(env) {
  return {
    name: 'dev-api-bridge',
    configureServer(server) {
      server.middlewares.use('/api/kit-subscribe', async (req, res) => {
        for (const k of ['KIT_API_KEY', 'KIT_API_SECRET', 'KIT_FORM_ID', 'KIT_TAG_NAME']) {
          if (env[k]) process.env[k] = env[k];
        }
        try {
          let raw = '';
          for await (const chunk of req) raw += chunk;
          req.body = raw ? JSON.parse(raw) : {};
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'invalid JSON' }));
          return;
        }
        const vercelRes = {
          status(code) {
            res.statusCode = code;
            return vercelRes;
          },
          json(obj) {
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify(obj));
            return vercelRes;
          },
        };
        const { default: handler } = await import('./api/kit-subscribe.js');
        await handler(req, vercelRes);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApiBridge(env)],
    server: {
      // Honor the port injected by the preview harness (autoPort) / PORT env,
      // falling back to Vite's default for a plain `npm run dev`.
      port: Number(process.env.PORT) || 5173,
      host: true, // expose on LAN so the quiz can be tested from a phone
    },
  };
});
