import { useEffect } from "react";

// Small notification that appears in the corner of the screen.
// Usage:
//   <Toast message={toast?.message} type={toast?.type} onDismiss={hideToast} />
//
// `type` is either "success" or "error". Pass an empty message to hide it.
function Toast({ message, type = "success", onDismiss, duration = 3500 }) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = setTimeout(onDismiss, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [message, duration, onDismiss]);

  if (!message) {
    return null;
  }

  const isError = type === "error";

  return (
    <div
      className={`toast toast-${isError ? "error" : "success"}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast-icon">{isError ? "✕" : "✓"}</span>

      <span className="toast-message">{message}</span>

      <button
        type="button"
        className="toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
