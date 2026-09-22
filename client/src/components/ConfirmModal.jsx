import Modal from "./Modal";

// Reusable "are you sure?" window.
// Used before deleting one website or several selected websites.
function ConfirmModal({
  title,
  message,
  details,
  confirmLabel = "Delete",
  busyLabel = "Working...",
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} onClose={onCancel} closeDisabled={busy}>
      <div className="confirm-body">
        <p className="confirm-message">{message}</p>

        {details && (
          <p className="confirm-details">{details}</p>
        )}

        <p className="confirm-warning">
          This action cannot be undone.
        </p>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? busyLabel : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
