import { useEffect, useId, useRef } from "react";

// MODAL: a dialog that sits on top of the page.
// The parent decides when it is open (isOpen) and what happens on close.
// Accessibility: role="dialog", aria-modal, a label, and focus moves
// into the dialog when it opens. (No keyboard shortcuts on purpose,
// so it closes with the X button or by clicking outside.)
export default function Modal({ title, isOpen, onClose, children }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button type="button" className="modal__close" aria-label="Close dialog" onClick={onClose}>
            &#10005;
          </button>
        </div>

        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
