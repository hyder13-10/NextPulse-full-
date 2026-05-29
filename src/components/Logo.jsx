export default function Logo({ size = 'md', showTagline = false }) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', tag: 'text-xs' },
    md: { icon: 'w-10 h-10', text: 'text-xl', tag: 'text-sm' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', tag: 'text-base' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${s.icon} rounded-xl bg-gradient-to-br from-pulse-500 to-heal-500 flex items-center justify-center shadow-sm`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeWidth="2.5"
            d="M4 12c0-4 3-8 8-8s8 4 8 8-3 8-8 8"
          />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div>
        <span className={`font-display font-bold text-pulse-800 ${s.text}`}>NextPulse</span>
        {showTagline && (
          <p className={`text-slate-500 ${s.tag} leading-tight`}>Your health, one pulse ahead.</p>
        )}
      </div>
    </div>
  );
}
