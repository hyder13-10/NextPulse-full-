import { useState, useEffect } from 'react';
import {
  findNearbyDoctors,
  getCurrentPosition,
  getSpecialtyForCondition,
  getDirectionsUrl,
} from '../utils/api';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function DoctorFinder() {
  const [condition, setCondition] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getCurrentPosition()
      .then(setLocation)
      .catch((err) => setError(err.message));
  }, []);

  const search = async () => {
    if (!location) {
      setError('Location required. Enable GPS or refresh after granting permission.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const specialty = getSpecialtyForCondition(condition || 'doctor');
      const results = await findNearbyDoctors(
        location.lat,
        location.lng,
        specialty,
        sortBy
      );
      setDoctors(results);
      if (results.length === 0) {
        setError('No doctors found nearby. Try a different condition or wider area.');
      }
    } catch (err) {
      setError(err.message || 'Failed to find doctors.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const reSort = async (newSort) => {
    setSortBy(newSort);
    if (doctors.length && location) {
      setLoading(true);
      try {
        const specialty = getSpecialtyForCondition(condition || 'doctor');
        const results = await findNearbyDoctors(
          location.lat,
          location.lng,
          specialty,
          newSort
        );
        setDoctors(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">Nearby Doctor Finder</h1>
      <p className="text-slate-500 text-sm mb-6">
        Find specialists near you based on your symptoms or condition.
      </p>

      {location && (
        <p className="text-xs text-heal-600 bg-heal-50 rounded-lg px-3 py-2 mb-4">
          Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}

      <div className="card mb-6 space-y-4">
        <input
          className="input-field"
          placeholder="Condition or symptom (e.g. rash, chest pain)"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <button type="button" className="btn-primary w-full" onClick={search} disabled={loading}>
          Find Doctors
        </button>
      </div>

      {doctors.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`text-sm px-3 py-1.5 rounded-lg ${sortBy === 'rating' ? 'bg-pulse-600 text-white' : 'bg-white border border-slate-200'}`}
            onClick={() => reSort('rating')}
          >
            Sort by Rating
          </button>
          <button
            type="button"
            className={`text-sm px-3 py-1.5 rounded-lg ${sortBy === 'distance' ? 'bg-pulse-600 text-white' : 'bg-white border border-slate-200'}`}
            onClick={() => reSort('distance')}
          >
            Sort by Distance
          </button>
        </div>
      )}

      <ErrorAlert message={error} onDismiss={() => setError('')} />
      {loading && <LoadingSpinner message="Searching for nearby doctors..." />}

      <div className="space-y-3">
        {doctors.map((doc) => (
          <div key={doc.id} className="card animate-slide-up">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-slate-800">{doc.name}</h3>
                <p className="text-sm text-pulse-600 capitalize">{doc.specialization}</p>
              </div>
              <StarRating rating={doc.rating} />
            </div>
            <p className="text-sm text-slate-500 mb-2">{doc.clinicName}</p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
              <span>{doc.distance?.toFixed(1)} km away</span>
              {doc.openNow !== undefined && (
                <span className={doc.openNow ? 'text-heal-600' : 'text-amber-600'}>
                  {doc.openNow ? 'Open now' : 'May be closed'}
                </span>
              )}
            </div>
            <a
              href={getDirectionsUrl(doc.lat, doc.lng, doc.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-block text-sm text-center"
            >
              Get Directions
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
