const KEYS = {
  USER: 'nextpulse_user',
  MEDICINES: 'nextpulse_medicines',
  CONTACTS: 'nextpulse_contacts',
  MOOD_LOG: 'nextpulse_mood_log',
  STEP_LOG: 'nextpulse_step_log',
  ONBOARDED: 'nextpulse_onboarded',
  PREFERENCES: 'nextpulse_preferences',
};

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUser() {
  return getItem(KEYS.USER, { name: 'Friend' });
}

export function setUser(user) {
  setItem(KEYS.USER, user);
}

export function getMedicines() {
  return getItem(KEYS.MEDICINES, []);
}

export function setMedicines(medicines) {
  setItem(KEYS.MEDICINES, medicines);
}

export function getContacts() {
  return getItem(KEYS.CONTACTS, []);
}

export function setContacts(contacts) {
  setItem(KEYS.CONTACTS, contacts);
}

export function getMoodLog() {
  return getItem(KEYS.MOOD_LOG, []);
}

export function setMoodLog(log) {
  setItem(KEYS.MOOD_LOG, log);
}

export function getStepLog() {
  return getItem(KEYS.STEP_LOG, []);
}

export function setStepLog(log) {
  setItem(KEYS.STEP_LOG, log);
}

export function isOnboarded() {
  return localStorage.getItem(KEYS.ONBOARDED) === 'true';
}

export function setOnboarded() {
  localStorage.setItem(KEYS.ONBOARDED, 'true');
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export { KEYS };
