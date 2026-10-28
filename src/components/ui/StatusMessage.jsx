// the three "other states" every data screen needs besides showing data:
// loading, error (with a retry button), and empty.

export function LoadingMessage({ text = "Loading..." }) {
  return (
    <div className="status status--loading" role="status">
      <span className="spinner" aria-hidden="true"></span>
      {text}
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status status--error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyMessage({ text }) {
  return <div className="status status--empty">{text}</div>;
}
