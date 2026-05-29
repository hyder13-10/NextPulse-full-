export const FITNESS_TIPS = [
  'Start your day with 5 minutes of dynamic stretching to wake up your muscles.',
  'Take the stairs instead of the elevator when possible—it adds up over time.',
  'Try a 15-minute bodyweight circuit: squats, push-ups, and planks.',
  'Walk during phone calls to sneak in extra steps without extra time.',
  'Consistency beats intensity—20 minutes daily beats one brutal weekend workout.',
  'Pair protein with carbs within 30 minutes after exercise for recovery.',
  'Use a standing desk or take standing breaks every 30 minutes.',
  'Try yoga or tai chi for flexibility and stress relief in one session.',
  'Track your progress weekly, not daily, to see meaningful trends.',
  'Hydrate before you feel thirsty—especially during workouts.',
  'Warm up for 5 minutes before any vigorous activity to prevent injury.',
  'Rest days are training days too—muscles grow during recovery.',
  'Find an activity you enjoy—you are more likely to stick with it.',
  'Set a step goal and increase it by 500 steps each week until you hit 8,000+.',
];

export function getDailyFitnessTip() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return FITNESS_TIPS[dayOfYear % FITNESS_TIPS.length];
}

export function getStepMotivation(steps) {
  const n = Number(steps) || 0;
  if (n < 3000) {
    return "Every step counts! You're building momentum—try a short walk around the block.";
  }
  if (n < 5000) {
    return "Nice progress! You're halfway to a solid active day—keep moving!";
  }
  if (n < 8000) {
    return "Great job! You're in the active zone. A few more steps and you'll hit 8,000!";
  }
  return "Outstanding! You've crushed your step goal today. Your heart thanks you!";
}
