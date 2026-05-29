import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MOODS, MOOD_CONTENT } from '../data/wellnessContent';
import { getMoodLog, setMoodLog, todayKey } from '../utils/storage';

const MOOD_COLORS = {
  Happy: '#22c55e',
  Stressed: '#f59e0b',
  Anxious: '#8b5cf6',
  Sad: '#3b82f6',
  Tired: '#64748b',
};

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function MentalWellness() {
  const [mood, setMood] = useState(null);
  const [log, setLog] = useState([]);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathActive, setBreathActive] = useState(false);

  useEffect(() => {
    setLog(getMoodLog());
    const today = getMoodLog().find((e) => e.date === todayKey());
    if (today) setMood(today.mood);
  }, []);

  const selectMood = (m) => {
    setMood(m);
    const updated = [...log.filter((e) => e.date !== todayKey()), { date: todayKey(), mood: m }];
    setMoodLog(updated);
    setLog(updated);
  };

  const content = mood ? MOOD_CONTENT[mood] : null;

  useEffect(() => {
    if (!breathActive || !content) return;

    const { inhale, hold, exhale } = content.breath;
    let phase = 'inhale';
    setBreathPhase('inhale');

    const runCycle = () => {
      setBreathPhase('inhale');
      const t1 = setTimeout(() => {
        if (hold > 0) {
          setBreathPhase('hold');
          const t2 = setTimeout(() => {
            setBreathPhase('exhale');
            const t3 = setTimeout(runCycle, exhale * 1000);
            return () => clearTimeout(t3);
          }, hold * 1000);
          return () => clearTimeout(t2);
        }
        setBreathPhase('exhale');
        setTimeout(runCycle, exhale * 1000);
      }, inhale * 1000);
      return () => clearTimeout(t1);
    };

    const cleanup = runCycle();
    return cleanup;
  }, [breathActive, mood, content]);

  const MOOD_SCORE = { Happy: 5, Stressed: 2, Anxious: 2, Sad: 1, Tired: 3 };

  const chartData = useMemo(() => {
    const days = getLast7Days();
    const map = Object.fromEntries(log.map((e) => [e.date, e.mood]));
    return days.map((date) => {
      const m = map[date];
      return {
        day: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
        score: m ? MOOD_SCORE[m] || 3 : 0,
        moodLabel: m || '—',
        fill: MOOD_COLORS[m] || '#e2e8f0',
      };
    });
  }, [log]);

  return (
    <div className="page-container">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">Mental Wellness</h1>
      <p className="text-slate-500 text-sm mb-6">Track your mood and practice mindful breathing.</p>

      <div className="card mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">How are you feeling today?</h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => selectMood(m)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mood === m
                  ? 'ring-2 ring-offset-2 scale-105'
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}
              style={{
                backgroundColor: mood === m ? MOOD_COLORS[m] + '22' : undefined,
                ringColor: mood === m ? MOOD_COLORS[m] : undefined,
                color: mood === m ? MOOD_COLORS[m] : '#475569',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {content && (
        <div className="space-y-4 animate-slide-up">
          <div className="card border-l-4" style={{ borderLeftColor: MOOD_COLORS[mood] }}>
            <h3 className="font-semibold text-slate-800 mb-2">Wellness tip</h3>
            <p className="text-slate-600 text-sm">{content.tip}</p>
          </div>

          <div className="card bg-gradient-to-br from-violet-50 to-pulse-50">
            <p className="text-violet-800 font-medium italic text-center">&ldquo;{content.affirmation}&rdquo;</p>
          </div>

          <div className="card text-center">
            <h3 className="font-semibold text-slate-800 mb-1">Guided Breathing</h3>
            <p className="text-xs text-slate-500 mb-6">{content.breath.label}</p>
            <div className="flex justify-center mb-6">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br from-pulse-300 to-heal-400 flex items-center justify-center text-white font-semibold shadow-inner ${
                  breathActive ? 'animate-breathe' : ''
                }`}
              >
                {breathActive ? breathPhase : 'Ready'}
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setBreathActive(!breathActive)}
            >
              {breathActive ? 'Stop Exercise' : 'Start Breathing'}
            </button>
          </div>
        </div>
      )}

      <div className="card mt-6">
        <h2 className="font-semibold text-slate-800 mb-4">Weekly Mood History</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis hide />
              <Tooltip
                formatter={(value, _name, props) => [
                  props.payload.moodLabel === '—' ? 'No entry' : props.payload.moodLabel,
                  'Mood',
                ]}
              />
              <Bar dataKey="score" name="Mood">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {MOODS.map((m) => (
            <span key={m} className="text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: MOOD_COLORS[m] }} />
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
