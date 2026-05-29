export default function ApiStatus() {
  const checks = [
    { label: 'Gemini AI', ok: !!import.meta.env.VITE_GEMINI_API_KEY },
    { label: 'OpenAI', ok: !!import.meta.env.VITE_OPENAI_API_KEY },
    { label: 'Google Maps', ok: !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY },
    {
      label: 'Twilio',
      ok:
        !!import.meta.env.VITE_TWILIO_ACCOUNT_SID &&
        !!import.meta.env.VITE_TWILIO_AUTH_TOKEN &&
        !!import.meta.env.VITE_TWILIO_FROM_NUMBER,
    },
  ];

  const missing = checks.filter((c) => !c.ok);

  if (missing.length === checks.length) return null;

  return (
    <div className="card mb-6 text-sm border border-slate-200">
      <p className="font-medium text-slate-700 mb-2">API key status (loaded in browser)</p>
      <ul className="space-y-1">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span className={c.ok ? 'text-heal-600' : 'text-amber-600'}>{c.ok ? '✓' : '○'}</span>
            <span className={c.ok ? 'text-slate-600' : 'text-amber-700'}>{c.label}</span>
          </li>
        ))}
      </ul>
      {missing.length > 0 && (
        <p className="text-xs text-amber-700 mt-2">
          Missing keys won&apos;t load until you save .env and restart <code>npm run dev</code>.
        </p>
      )}
      <p className="text-xs text-slate-400 mt-2">
        Dev server: {window.location.origin}
      </p>
    </div>
  );
}
