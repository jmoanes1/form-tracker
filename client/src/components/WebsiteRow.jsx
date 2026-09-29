import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";
import { formatDate } from "../utils/format";

// One row of the website table.
function WebsiteRow({
  website,
  selected,
  busy,
  onToggleSelect,
  onTest,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <tr className={selected ? "row-selected" : ""}>
      <td className="cell-select">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(website.id)}
          disabled={busy}
          aria-label={`Select ${website.website}`}
        />
      </td>

      <td className="cell-title">{website.title || "—"}</td>

      <td className="cell-website">
        <a
          href={website.website}
          target="_blank"
          rel="noopener noreferrer"
          title={website.website}
        >
          {website.website}
          <span className="external-icon" aria-hidden="true">
            ↗
          </span>
        </a>
      </td>

      <td>
        <TypeBadge type={website.type} />
      </td>

      <td>
        <StatusBadge status={website.status} />
      </td>

      <td>
        {website.tester || "—"}
      </td>

      <td>
        {formatDate(website.lastTested)}
      </td>

      <td className="cell-notes" title={website.notes || "No notes"}>
        {website.notes || "—"}
      </td>

      <td>
        <div className="actions">
          <button
            type="button"
            className="icon-button test-button"
            onClick={() => onTest(website)}
            disabled={busy}
            title="Test"
            aria-label={`Test ${website.website}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 3h6" />
              <path d="M10 3v5.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8.5V3" />
              <path d="M7.5 14h9" />
            </svg>
          </button>

          <button
            type="button"
            className="icon-button view-button"
            onClick={() => onView(website)}
            disabled={busy}
            title="Details"
            aria-label={`View details of ${website.website}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>

          <button
            type="button"
            className="icon-button edit-button"
            onClick={() => onEdit(website)}
            disabled={busy}
            title="Edit"
            aria-label={`Edit ${website.website}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>

          <button
            type="button"
            className="icon-button delete-button"
            onClick={() => onDelete(website)}
            disabled={busy}
            title="Delete"
            aria-label={`Delete ${website.website}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default WebsiteRow;
