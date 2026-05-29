import { useState } from 'react';
import { analyzeSymptomsText, analyzeSymptomsImage, MEDICAL_DISCLAIMER } from '../utils/api';
import { SYMPTOM_OPTIONS } from '../data/wellnessContent';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function SymptomChecker() {
  const [mode, setMode] = useState('text');
  const [symptoms, setSymptoms] = useState('');
  const [selected, setSelected] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const symptomText = () => {
    const parts = [...selected];
    if (symptoms.trim()) parts.push(symptoms.trim());
    return parts.join(', ') || symptoms.trim();
  };

  const toggleSymptom = (s) => {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      if (mode === 'text') {
        const text = symptomText();
        if (!text) {
          setError('Please enter or select at least one symptom.');
          setLoading(false);
          return;
        }
        const data = await analyzeSymptomsText(text);
        setResult(data);
      } else {
        if (!imageBase64) {
          setError('Please upload an image.');
          setLoading(false);
          return;
        }
        const data = await analyzeSymptomsImage(symptomText(), imageBase64, mimeType);
        setResult(data);
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">AI Symptom Checker</h1>
      <p className="text-slate-500 text-sm mb-6">Get guidance on symptoms via text or image.</p>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          className={`flex-1 py-2 rounded-xl font-medium transition-colors ${mode === 'text' ? 'bg-pulse-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
          onClick={() => setMode('text')}
        >
          Text Input
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-xl font-medium transition-colors ${mode === 'image' ? 'bg-pulse-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
          onClick={() => setMode('image')}
        >
          Image Upload
        </button>
      </div>

      <div className="card mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selected.includes(s)
                  ? 'bg-pulse-100 border-pulse-400 text-pulse-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-pulse-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder="Describe your symptoms in detail..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />

        {mode === 'image' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload a photo of the affected area
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="text-sm text-slate-600"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Uploaded condition"
                className="mt-3 rounded-xl max-h-48 object-cover border border-slate-200"
              />
            )}
          </div>
        )}

        <button type="button" className="btn-primary w-full" onClick={analyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      {loading && <LoadingSpinner message="AI is analyzing your symptoms..." />}

      {result && (
        <div className="card space-y-4 animate-slide-up">
          {imagePreview && mode === 'image' && (
            <img
              src={imagePreview}
              alt="Analyzed"
              className="rounded-xl max-h-40 object-cover border border-slate-200"
            />
          )}
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Possible condition
            </span>
            <h3 className="font-display text-xl font-semibold text-slate-800">
              {result.possibleCondition}
            </h3>
            {result.urgency && (
              <span
                className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                  result.urgency === 'high'
                    ? 'bg-red-100 text-red-700'
                    : result.urgency === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-heal-100 text-heal-700'
                }`}
              >
                Urgency: {result.urgency}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Remedy suggestion</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{result.remedySuggestion}</p>
          </div>
          {result.selfCareSteps?.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Self-care steps</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {result.selfCareSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 italic">
            {MEDICAL_DISCLAIMER}
          </p>
        </div>
      )}
    </div>
  );
}
