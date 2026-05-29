import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'twilio-dev-proxy',
        configureServer(server) {
          server.middlewares.use('/api/twilio/sms', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
              res.statusCode = 204;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            const sid = env.VITE_TWILIO_ACCOUNT_SID;
            const token = env.VITE_TWILIO_AUTH_TOKEN;
            const from = env.VITE_TWILIO_FROM_NUMBER;

            if (!sid || !token || !from) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Twilio credentials missing in .env' }));
              return;
            }

            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString('utf8');
            let body;
            try {
              body = JSON.parse(raw);
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              return;
            }

            const params = new URLSearchParams();
            params.set('To', body.to);
            params.set('From', body.from || from);
            params.set('Body', body.body);

            try {
              const twilioRes = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
                {
                  method: 'POST',
                  headers: {
                    Authorization:
                      'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: params.toString(),
                }
              );

              const data = await twilioRes.text();
              res.statusCode = twilioRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            } catch (err) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Twilio proxy failed' }));
            }
          });
        },
      },
    ],
    server: {
      port: 5173,
      open: true,
    },
  };
});
