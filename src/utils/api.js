const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const TWILIO_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_FROM = import.meta.env.VITE_TWILIO_FROM_NUMBER;
const TWILIO_PROXY = import.meta.env.VITE_TWILIO_PROXY_URL;

const MEDICAL_DISCLAIMER =
  'This is not a medical diagnosis. Please consult a doctor for serious conditions.';

export { MEDICAL_DISCLAIMER };

export async function analyzeSymptomsText(symptoms) {
  const prompt = `You are a helpful health assistant. A user reports these symptoms: ${symptoms}.
Provide a JSON response with exactly these keys:
- "possibleCondition": string (general name, not definitive diagnosis)
- "selfCareSteps": array of 3-5 strings
- "remedySuggestion": string (detailed practical advice)
- "urgency": "low" | "medium" | "high"
Be cautious, empathetic, and always recommend professional care for serious symptoms.
Respond ONLY with valid JSON, no markdown.`;

  if (GEMINI_KEY) {
    return analyzeWithGemini(prompt, null);
  }
  if (OPENAI_KEY) {
    return analyzeWithOpenAI(prompt);
  }
  throw new Error(
    'No AI API key configured. Add VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY to your .env file.'
  );
}

export async function analyzeSymptomsImage(symptoms, imageBase64, mimeType) {
  const textPart = symptoms
    ? `The user also describes: ${symptoms}.`
    : 'Analyze the visible condition in this image.';

  const prompt = `${textPart}
Provide a JSON response with exactly these keys:
- "possibleCondition": string
- "selfCareSteps": array of 3-5 strings
- "remedySuggestion": string
- "urgency": "low" | "medium" | "high"
Be cautious about visual diagnosis limitations. Respond ONLY with valid JSON.`;

  if (GEMINI_KEY) {
    return analyzeWithGemini(prompt, { base64: imageBase64, mimeType });
  }
  if (OPENAI_KEY) {
    return analyzeWithOpenAIVision(prompt, imageBase64, mimeType);
  }
  throw new Error(
    'No AI API key configured. Add VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY to your .env file.'
  );
}

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash-preview-05-20'];

async function analyzeWithGemini(prompt, image) {
  const parts = [{ text: prompt }];
  if (image) {
    parts.unshift({
      inline_data: {
        mime_type: image.mimeType || 'image/jpeg',
        data: image.base64.replace(/^data:[^;]+;base64,/, ''),
      },
    });
  }

  const payload = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
  };

  const useHeaderKey = GEMINI_KEY.startsWith('AQ.');
  let lastError = '';

  for (const model of GEMINI_MODELS) {
    const url = useHeaderKey
      ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
      : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`;

    const headers = { 'Content-Type': 'application/json' };
    if (useHeaderKey) headers['x-goog-api-key'] = GEMINI_KEY;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response from Gemini');
      return parseAIJson(text);
    }

    lastError = await res.text();
    if (res.status === 404) continue;
    break;
  }

  throw new Error(
    `Gemini API error: ${lastError.slice(0, 280) || 'Check your API key at https://aistudio.google.com/apikey'}`
  );
}

async function analyzeWithOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a cautious health assistant. Respond only with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} - ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No response from OpenAI');
  return parseAIJson(text);
}

async function analyzeWithOpenAIVision(prompt, imageBase64, mimeType) {
  const url = imageBase64.startsWith('data:')
    ? imageBase64
    : `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url } },
          ],
        },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} - ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No response from OpenAI');
  return parseAIJson(text);
}

function parseAIJson(text) {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Could not parse AI response');
  }
}

const SPECIALTY_MAP = {
  fever: 'general practitioner',
  headache: 'neurologist',
  cough: 'pulmonologist',
  fatigue: 'general practitioner',
  'chest pain': 'cardiologist',
  rash: 'dermatologist',
  skin: 'dermatologist',
  swelling: 'dermatologist',
  bruise: 'general practitioner',
  stomach: 'gastroenterologist',
  anxiety: 'psychiatrist',
  depression: 'psychiatrist',
  default: 'doctor',
};

export function getSpecialtyForCondition(condition) {
  const lower = (condition || '').toLowerCase();
  for (const [key, specialty] of Object.entries(SPECIALTY_MAP)) {
    if (key !== 'default' && lower.includes(key)) return specialty;
  }
  return SPECIALTY_MAP.default;
}

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve(window.google.maps);
      return;
    }
    if (!MAPS_KEY) {
      reject(
        new Error(
          'Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.'
        )
      );
      return;
    }
    const existing = document.querySelector('script[data-nextpulse-maps]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.nextpulseMaps = 'true';
    script.onload = () => resolve(window.google.maps);
    script.onerror = () =>
      reject(
        new Error(
          'Failed to load Google Maps. Enable Maps JavaScript API + Places API, add billing, and allow http://localhost:* in API key restrictions.'
        )
      );
    document.head.appendChild(script);
  });
}

export async function findNearbyDoctors(lat, lng, specialty, sortBy = 'rating') {
  const maps = await loadGoogleMapsScript();
  const center = new maps.LatLng(lat, lng);
  const service = new maps.places.PlacesService(document.createElement('div'));

  const request = {
    location: center,
    radius: 10000,
    keyword: specialty,
    type: 'doctor',
  };

  const results = await new Promise((resolve, reject) => {
    service.nearbySearch(request, (places, status) => {
      if (status === maps.places.PlacesServiceStatus.OK) {
        resolve(places || []);
      } else if (status === maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else if (status === maps.places.PlacesServiceStatus.REQUEST_DENIED) {
        reject(
          new Error(
            'Places API denied. Enable Places API in Google Cloud and allow this site in your API key HTTP referrer restrictions.'
          )
        );
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    });
  });

  let places = results.map((p) => ({
    id: p.place_id,
    name: p.name,
    specialization: specialty,
    clinicName: p.vicinity || 'Clinic',
    rating: p.rating ?? 0,
    userRatingsTotal: p.user_ratings_total ?? 0,
    lat: p.geometry?.location?.lat(),
    lng: p.geometry?.location?.lng(),
    openNow: p.opening_hours?.open_now,
  }));

  places = places.map((p) => ({
    ...p,
    distance: haversineKm(lat, lng, p.lat, p.lng),
  }));

  if (sortBy === 'distance') {
    places.sort((a, b) => a.distance - b.distance);
  } else {
    places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return places.slice(0, 15);
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getDirectionsUrl(lat, lng, name) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name || '')}`;
}

export async function sendEmergencySMS(contacts, userName, lat, lng) {
  const message = `${userName} is in an emergency. Their last known location is ${lat}, ${lng}. Please respond immediately.`;

  if (!TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
    throw new Error(
      'Twilio not configured. Add VITE_TWILIO_ACCOUNT_SID, VITE_TWILIO_AUTH_TOKEN, and VITE_TWILIO_FROM_NUMBER to .env'
    );
  }

  const results = [];
  for (const contact of contacts) {
    const phone = contact.phone.replace(/\s/g, '');
    try {
      await sendSingleSMS(phone, message);
      results.push({ name: contact.name, success: true });
    } catch (err) {
      results.push({ name: contact.name, success: false, error: err.message });
    }
  }
  return results;
}

function getTwilioEndpoint() {
  if (TWILIO_PROXY && !TWILIO_PROXY.includes('localhost:5173')) {
    return TWILIO_PROXY;
  }
  if (import.meta.env.DEV) {
    return '/api/twilio/sms';
  }
  return TWILIO_PROXY || null;
}

async function sendSingleSMS(to, body) {
  const credentials = btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`);
  const proxyEndpoint = getTwilioEndpoint();

  if (proxyEndpoint) {
    const res = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body, from: TWILIO_FROM }),
    });
    if (!res.ok) {
      let errMsg = `SMS proxy error (${res.status})`;
      try {
        const err = await res.json();
        errMsg = err.message || err.error?.message || err.error || errMsg;
      } catch {
        errMsg = (await res.text()) || errMsg;
      }
      throw new Error(errMsg);
    }
    return res.json();
  }

  const params = new URLSearchParams();
  params.set('To', to);
  params.set('From', TWILIO_FROM);
  params.set('Body', body);

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.message || `Twilio error ${res.status}`;
    if (res.status === 0 || msg.includes('Failed to fetch')) {
      throw new Error(
        'SMS blocked by browser CORS. Set VITE_TWILIO_PROXY_URL to a serverless Twilio proxy.'
      );
    }
    throw new Error(msg);
  }

  return res.json();
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const messages = {
          1: 'Location permission denied. Enable location access in browser settings.',
          2: 'Location unavailable. Please try again.',
          3: 'Location request timed out.',
        };
        reject(new Error(messages[err.code] || err.message));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
}
