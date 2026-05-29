import { useState } from 'react';
import Logo from '../components/Logo';
import { setUser, setContacts, setOnboarded } from '../utils/storage';

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      setError('Please add at least one emergency contact.');
      return;
    }

    setUser({ name: name.trim() });
    setContacts([{ name: contactName.trim(), phone: contactPhone.trim() }]);
    setOnboarded();
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pulse-100 via-white to-heal-100">
      <div className="card max-w-md w-full animate-slide-up shadow-lg">
        <div className="text-center mb-8">
          <Logo size="lg" showTagline />
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Welcome to NextPulse</h1>
        <p className="text-slate-600 mb-6 text-sm">
          Let&apos;s personalize your experience and set up your first emergency contact.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-700 mb-3">First emergency contact</p>
            <div className="space-y-3">
              <input
                className="input-field"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact name"
              />
              <input
                className="input-field"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
