import { Link } from 'react-router-dom';
import { getUser } from '../utils/storage';
import { getDailyHealthTip } from '../data/healthTips';
import ApiStatus from '../components/ApiStatus';

const quickActions = [
  { to: '/medicines', label: 'Medicine Reminders', icon: '💊', color: 'from-pulse-400 to-pulse-600' },
  { to: '/fitness', label: 'Fitness Tips', icon: '🏃', color: 'from-heal-400 to-heal-600' },
  { to: '/symptoms', label: 'Symptom Checker', icon: '🩺', color: 'from-teal-400 to-teal-600' },
  { to: '/doctors', label: 'Find Doctors', icon: '📍', color: 'from-indigo-400 to-indigo-600' },
  { to: '/wellness', label: 'Mental Wellness', icon: '🧘', color: 'from-violet-400 to-violet-600' },
  { to: '/emergency', label: 'SOS Settings', icon: '🆘', color: 'from-red-400 to-red-600' },
];

export default function Dashboard() {
  const user = getUser();
  const tip = getDailyHealthTip();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-container">
      <ApiStatus />
      <div className="card bg-gradient-to-br from-pulse-500 to-heal-500 text-white mb-6 animate-slide-up">
        <p className="text-pulse-100 text-sm mb-1">{today}</p>
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Hello, {user.name || 'there'}!
        </h1>
        <p className="text-white/90 text-sm italic">Your health, one pulse ahead.</p>
      </div>

      <div className="card mb-6 border-l-4 border-l-heal-500 animate-slide-up">
        <h2 className="font-display font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <span>💡</span> Daily Health Tip
        </h2>
        <p className="text-slate-600 leading-relaxed">{tip}</p>
      </div>

      <h2 className="font-display font-semibold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="card group hover:scale-[1.02] transition-transform p-4 text-center"
          >
            <div
              className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md transition-shadow`}
            >
              {action.icon}
            </div>
            <span className="text-sm font-medium text-slate-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
