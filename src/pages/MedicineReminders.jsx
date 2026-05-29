import { useState, useEffect, useCallback } from 'react';
import { getMedicines, setMedicines, todayKey } from '../utils/storage';

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];

export default function MedicineReminders() {
  const [medicines, setMedicinesState] = useState([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);
  const [time, setTime] = useState('08:00');
  const [takenToday, setTakenToday] = useState({});
  const [alertMsg, setAlertMsg] = useState('');

  const load = useCallback(() => {
    setMedicinesState(getMedicines());
    const taken = JSON.parse(localStorage.getItem('nextpulse_taken_' + todayKey()) || '{}');
    setTakenToday(taken);
  }, []);

  useEffect(() => {
    load();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [load]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const taken = JSON.parse(localStorage.getItem('nextpulse_taken_' + todayKey()) || '{}');

      medicines.forEach((med) => {
        if (med.time === current && !taken[med.id]) {
          const msg = `Time to take ${med.name} (${med.dosage})`;
          setAlertMsg(msg);
          if (Notification.permission === 'granted') {
            new Notification('NextPulse Reminder', { body: msg, icon: '/favicon.svg' });
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [medicines]);

  const addMedicine = (e) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    const med = {
      id: crypto.randomUUID(),
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      time,
    };
    const updated = [...medicines, med];
    setMedicines(updated);
    setMedicinesState(updated);
    setName('');
    setDosage('');
    setTime('08:00');
  };

  const markTaken = (id) => {
    const taken = { ...takenToday, [id]: true };
    setTakenToday(taken);
    localStorage.setItem('nextpulse_taken_' + todayKey(), JSON.stringify(taken));
  };

  const removeMedicine = (id) => {
    const updated = medicines.filter((m) => m.id !== id);
    setMedicines(updated);
    setMedicinesState(updated);
  };

  return (
    <div className="page-container">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">Medicine Reminders</h1>
      <p className="text-slate-500 text-sm mb-6">Never miss a dose with scheduled alerts.</p>

      {alertMsg && (
        <div className="mb-4 rounded-xl bg-heal-100 border border-heal-300 text-heal-800 px-4 py-3 text-sm flex justify-between animate-slide-up">
          <span>🔔 {alertMsg}</span>
          <button type="button" onClick={() => setAlertMsg('')} className="text-heal-600">
            ✕
          </button>
        </div>
      )}

      <form onSubmit={addMedicine} className="card mb-6 space-y-4">
        <h2 className="font-semibold text-slate-800">Add Medicine</h2>
        <input
          className="input-field"
          placeholder="Medicine name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="Dosage (e.g. 500mg)"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
        />
        <select className="input-field" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          {FREQUENCIES.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <input
          type="time"
          className="input-field"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary w-full">
          Add Reminder
        </button>
      </form>

      <div className="space-y-3">
        {medicines.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No medicines added yet.</p>
        ) : (
          medicines.map((med) => {
            const taken = takenToday[med.id];
            return (
              <div
                key={med.id}
                className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${taken ? 'strike-taken' : ''}`}
              >
                <div>
                  <h3 className="font-semibold text-slate-800">{med.name}</h3>
                  <p className="text-sm text-slate-500">
                    {med.dosage} · {med.frequency} · {med.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!taken && (
                    <button type="button" className="btn-primary text-sm" onClick={() => markTaken(med.id)}>
                      Mark as Taken
                    </button>
                  )}
                  {taken && <span className="text-heal-600 text-sm font-medium py-2">✓ Taken today</span>}
                  <button
                    type="button"
                    className="text-sm text-slate-400 hover:text-red-500 px-2"
                    onClick={() => removeMedicine(med.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
