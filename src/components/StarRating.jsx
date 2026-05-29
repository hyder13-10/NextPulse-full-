export default function StarRating({ rating }) {
  const stars = [];
  const full = Math.floor(rating || 0);
  const hasHalf = (rating || 0) - full >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <span key={i} className="text-amber-400">
          ★
        </span>
      );
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} className="text-amber-400">
          ★
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="text-slate-200">
          ★
        </span>
      );
    }
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-sm">
      {stars}
      {rating > 0 && <span className="text-slate-500 ml-1">({rating.toFixed(1)})</span>}
    </span>
  );
}
