import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/medicines', label: 'Medicines' },
  { to: '/fitness', label: 'Fitness' },
  { to: '/symptoms', label: 'Symptoms' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/wellness', label: 'Wellness' },
  { to: '/emergency', label: 'SOS Settings' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <Logo size="sm" />
        </NavLink>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-pulse-50 text-pulse-700"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-1 flex-wrap justify-end">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-pulse-100 text-pulse-800'
                    : 'text-slate-600 hover:bg-pulse-50 hover:text-pulse-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 px-4 py-3 flex flex-col gap-1 animate-slide-up">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-pulse-100 text-pulse-800' : 'text-slate-600 hover:bg-pulse-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
