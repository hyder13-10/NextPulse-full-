export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm flex justify-between gap-3 animate-slide-up">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-red-600 hover:text-red-800 shrink-0">
          ✕
        </button>
      )}
    </div>
  );
}
