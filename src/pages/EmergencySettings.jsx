import { useState, useEffect } from 'react';
import { getContacts, setContacts, getUser, setUser } from '../utils/storage';

const MAX_CONTACTS = 3;

export default function EmergencySettings() {
  const [contacts, setContactsState] = useState([]);
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setContactsState(getContacts());
    setUserName(getUser().name || '');
  }, []);

  const saveUserName = () => {
    setUser({ name: userName.trim() || 'Friend' });
    setMessage('Name updated.');
    setTimeout(() => setMessage(''), 2000);
  };

  const addContact = (e) => {
    e.preventDefault();
    if (contacts.length >= MAX_CONTACTS) {
      setMessage(`Maximum ${MAX_CONTACTS} contacts allowed.`);
      return;
    }
    if (!name.trim() || !phone.trim()) return;

    const updated = [...contacts, { name: name.trim(), phone: phone.trim() }];
    setContacts(updated);
    setContactsState(updated);
    setName('');
    setPhone('');
    setMessage('Contact saved.');
    setTimeout(() => setMessage(''), 2000);
  };

  const removeContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
    setContactsState(updated);
  };

  return (
    <div className="page-container">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">Emergency SOS Settings</h1>
      <p className="text-slate-500 text-sm mb-6">
        Configure up to {MAX_CONTACTS} contacts who receive SMS alerts when you press SOS.
      </p>

      <div className="card mb-6 border-l-4 border-l-emergency-500">
        <p className="text-sm text-slate-600">
          When you press the red <strong>SOS</strong> button, all saved contacts receive an SMS with
          your name and GPS coordinates. Ensure Twilio is configured in your <code className="text-xs bg-slate-100 px-1 rounded">.env</code> file.
        </p>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold text-slate-800 mb-3">Your name (used in alerts)</h2>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
          />
          <button type="button" className="btn-primary shrink-0" onClick={saveUserName}>
            Save
          </button>
        </div>
      </div>

      <form onSubmit={addContact} className="card mb-6 space-y-4">
        <h2 className="font-semibold text-slate-800">
          Add Emergency Contact ({contacts.length}/{MAX_CONTACTS})
        </h2>
        <input
          className="input-field"
          placeholder="Contact name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={contacts.length >= MAX_CONTACTS}
        />
        <input
          className="input-field"
          type="tel"
          placeholder="+1 555 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={contacts.length >= MAX_CONTACTS}
        />
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={contacts.length >= MAX_CONTACTS}
        >
          Add Contact
        </button>
      </form>

      {message && (
        <p className="text-sm text-heal-600 bg-heal-50 rounded-lg px-3 py-2 mb-4">{message}</p>
      )}

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-center text-slate-500 py-4">No emergency contacts yet.</p>
        ) : (
          contacts.map((c, i) => (
            <div key={i} className="card flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">{c.name}</p>
                <p className="text-sm text-slate-500">{c.phone}</p>
              </div>
              <button
                type="button"
                className="text-red-500 text-sm hover:text-red-700"
                onClick={() => removeContact(i)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
