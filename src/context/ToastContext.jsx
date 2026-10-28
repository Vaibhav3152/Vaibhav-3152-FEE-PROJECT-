import { createContext, useContext, useState, useRef, useCallback, useMemo } from "react";

// CONTEXT API (2 of 3): toast notifications.
// Any component can call showToast("message", "success") and a small
// popup shows up in the corner, then disappears by itself.
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const removeToast = useCallback((id) => {
    setToasts((oldToasts) => oldToasts.filter((toast) => toast.id !== id));
  }, []);

  // type can be "info", "success" or "error"
  const showToast = useCallback(
    (message, type = "info") => {
      const id = nextId.current;
      nextId.current = nextId.current + 1;
      setToasts((oldToasts) => [...oldToasts, { id, message, type }]);
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={"toast toast--" + toast.type}>
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              aria-label="Dismiss notification"
              onClick={() => removeToast(toast.id)}
            >
              &#10005;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
