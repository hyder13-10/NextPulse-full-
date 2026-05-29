export const MOODS = ['Happy', 'Stressed', 'Anxious', 'Sad', 'Tired'];

export const MOOD_CONTENT = {
  Happy: {
    tip: 'Channel this positive energy—share a kind message with someone or jot down three things you are grateful for.',
    affirmation: 'I radiate positivity and attract good energy into my life.',
    breath: { inhale: 4, hold: 2, exhale: 4, cycles: 4, label: 'Box breathing to savor calm' },
  },
  Stressed: {
    tip: 'Break your task into the smallest next step. You only need to handle one thing at a time right now.',
    affirmation: 'I am capable of handling challenges one breath at a time.',
    breath: { inhale: 4, hold: 4, exhale: 6, cycles: 5, label: 'Extended exhale to activate calm' },
  },
  Anxious: {
    tip: 'Ground yourself: name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste.',
    affirmation: 'This feeling is temporary. I am safe in this moment.',
    breath: { inhale: 4, hold: 7, exhale: 8, cycles: 4, label: '4-7-8 relaxation breath' },
  },
  Sad: {
    tip: 'Be gentle with yourself. A short walk, warm drink, or reaching out to someone you trust can help.',
    affirmation: 'It is okay to feel sad. I deserve compassion, especially from myself.',
    breath: { inhale: 5, hold: 0, exhale: 5, cycles: 6, label: 'Steady rhythmic breathing' },
  },
  Tired: {
    tip: 'Rest is productive. If possible, take a 20-minute power nap or go to bed 30 minutes earlier tonight.',
    affirmation: 'My body deserves rest. I honor my need to recharge.',
    breath: { inhale: 4, hold: 2, exhale: 6, cycles: 4, label: 'Gentle energizing breath' },
  },
};

export const SYMPTOM_OPTIONS = [
  'Fever',
  'Headache',
  'Cough',
  'Fatigue',
  'Chest pain',
  'Sore throat',
  'Nausea',
  'Rash',
  'Dizziness',
  'Body aches',
];
