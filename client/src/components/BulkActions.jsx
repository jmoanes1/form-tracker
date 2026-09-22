import { STATUS_OPTIONS } from "../utils/websiteList";

// Bar that appears when at least one website is selected.
function BulkActions({
  selectedCount,
  busy,
  onMarkStatus,
  onDeleteSelected,
  onClearSelection,
}) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bulk-actions">
      <span className="bulk-count">
        Selected: {selectedCount}
      </span>

      <div className="bulk-buttons">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className="secondary-button"
            onClick={() => onMarkStatus(option.value)}
            disabled={busy}
          >
            Mark {option.label}
          </button>
        ))}

        <button
          type="button"
          className="delete-button"
          onClick={onDeleteSelected}
          disabled={busy}
        >
          Delete Selected
        </button>

        <button
          type="button"
          className="link-button"
          onClick={onClearSelection}
          disabled={busy}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default BulkActions;
