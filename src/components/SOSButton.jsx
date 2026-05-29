import { useState } from 'react';
import { getContacts, getUser } from '../utils/storage';
import { sendEmergencySMS, getCurrentPosition } from '../utils/api';

export default function SOSButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSOS = () => {
    const contacts = getContacts();
    if (contacts.length === 0) {
      setError('No emergency contacts saved. Add contacts in SOS Settings first.');
      setShowConfirm(true);
      return;
    }
    setError('');
    setShowConfirm(true);
  };

  const confirmAlert = async () => {
    const contacts = getContacts().filter((c) => c.name && c.phone);
    if (contacts.length === 0) {
      setError('Add at least one emergency contact in SOS Settings.');
      return;
    }

    setSending(true);
    setError('');

    try {
      const user = getUser();
      const { lat, lng } = await getCurrentPosition();
      await sendEmergencySMS(contacts, user.name || 'NextPulse user', lat, lng);
      setSent(true);
      setShowConfirm(false);
    } catch (err) {
      setError(err.message || 'Failed to send emergency alert.');
    } finally {
      setSending(false);
    }
  };

  const closeAll = () => {
    setShowConfirm(false);
    setSent(false);
    setError('');
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSOS}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-emergency-600 text-white font-bold text-sm shadow-lg shadow-red-300/50 hover:bg-emergency-700 hover:scale-105 active:scale-95 transition-all animate-pulse-soft flex items-center justify-center border-4 border-white"
        aria-label="Emergency SOS"
      >
        SOS
      </button>

      {showConfirm && !sent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-sm w-full border-emergency-200 shadow-xl animate-slide-up">
            <h2 className="font-display font-bold text-xl text-emergency-700 mb-2">Emergency Alert</h2>
            <p className="text-slate-600 mb-4">
              Are you sure you want to alert your emergency contacts?
            </p>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
            )}
            <div className="flex gap-3">
              <button type="button" className="btn-secondary flex-1" onClick={closeAll} disabled={sending}>
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2.5 rounded-xl bg-emergency-600 text-white font-medium hover:bg-emergency-700 disabled:opacity-50"
                onClick={confirmAlert}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Alert'}
              </button>
            </div>
          </div>
        </div>
      )}

      {sent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-emergency-700/90 backdrop-blur-sm">
          <div className="text-center text-white max-w-sm animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold mb-2">Help is on the way</h2>
            <p className="text-white/90 mb-8">
              Your emergency contacts have been notified with your location.
            </p>
            <button
              type="button"
              onClick={closeAll}
              className="px-6 py-3 rounded-xl bg-white text-emergency-700 font-semibold hover:bg-red-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
