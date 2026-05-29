import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { getDailyFitnessTip, getStepMotivation } from '../data/fitnessTips';
import { getStepLog, setStepLog, todayKey } from '../utils/storage';

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function FitnessTips() {
  const [steps, setSteps] = useState('');
  const [log, setLog] = useState([]);
  const tip = getDailyFitnessTip();

  useEffect(() => {
    setLog(getStepLog());
    const today = getStepLog().find((e) => e.date === todayKey());
    if (today) setSteps(String(today.steps));
  }, []);

  const saveSteps = () => {
    const n = parseInt(steps, 10) || 0;
    const updated = [...log.filter((e) => e.date !== todayKey()), { date: todayKey(), steps: n }];
    setStepLog(updated);
    setLog(updated);
  };

  const chartData = useMemo(() => {
    const days = getLast7Days();
    const map = Object.fromEntries(log.map((e) => [e.date, e.steps]));
    return days.map((date) => ({
      day: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      steps: map[date] || 0,
    }));
  }, [log]);

  const motivation = getStepMotivation(parseInt(steps, 10) || 0);

  return (
    <div className="page-container">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">Fitness Tips</h1>
      <p className="text-slate-500 text-sm mb-6">Stay active and track your progress.</p>

      <div className="card mb-6 bg-gradient-to-r from-heal-50 to-pulse-50">
        <h2 className="font-semibold text-slate-800 mb-2">Today&apos;s Fitness Tip</h2>
        <p className="text-slate-600 leading-relaxed">{tip}</p>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold text-slate-800 mb-3">Daily Step Counter</h2>
        <div className="flex gap-3 mb-3">
          <input
            type="number"
            className="input-field flex-1"
            placeholder="Enter today's steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            min="0"
          />
          <button type="button" className="btn-primary shrink-0" onClick={saveSteps}>
            Save
          </button>
        </div>
        <p className="text-sm text-pulse-700 bg-pulse-50 rounded-xl px-4 py-3">{motivation}</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-4">Weekly Activity</h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="steps" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
