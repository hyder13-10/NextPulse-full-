export const DAILY_HEALTH_TIPS = [
  'Drink at least 8 glasses of water today to stay hydrated and support your organs.',
  'Take a 10-minute walk after meals to aid digestion and boost circulation.',
  'Aim for 7–9 hours of sleep tonight—recovery is when your body heals best.',
  'Include a serving of leafy greens in at least one meal for vitamins and fiber.',
  'Practice the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.',
  'Stretch your neck and shoulders for 2 minutes if you sit at a desk often.',
  'Limit added sugar today—swap soda for water or herbal tea.',
  'Wash your hands for 20 seconds before meals to reduce infection risk.',
  'Take three deep breaths when stressed—slow exhales calm your nervous system.',
  'Eat a rainbow of fruits and vegetables for diverse antioxidants.',
  'Stand up and move for 5 minutes every hour if you work sedentary jobs.',
  'Protect your skin with SPF 30+ when outdoors, even on cloudy days.',
  'Keep a consistent meal schedule to support stable blood sugar.',
  'Limit screen time 1 hour before bed for better sleep quality.',
  'Check in with a friend or family member—a strong social bond supports mental health.',
];

export function getDailyHealthTip() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return DAILY_HEALTH_TIPS[dayOfYear % DAILY_HEALTH_TIPS.length];
}
