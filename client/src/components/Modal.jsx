import { useEffect } from "react";

// Reusable modal window.
// Usage:
//   <Modal title="Add Website" onClose={closeModal}>
//     ...content...
//   </Modal>
//
// `closeDisabled` is used while a save request is running, so the user
// cannot close the modal in the middle of an operation.
function Modal({ title, onClose, closeDisabled = false, children }) {
  // Close the modal with the Escape key.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !closeDisabled) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, closeDisabled]);

  // Stop the page behind the modal from scrolling while it is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Close only when the dark overlay itself is clicked.
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !closeDisabled) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
