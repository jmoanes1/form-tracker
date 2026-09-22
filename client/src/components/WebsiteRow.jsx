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
            className="test-button"
            onClick={() => onTest(website)}
            disabled={busy}
          >
            Test
          </button>

          <button
            type="button"
            className="view-button"
            onClick={() => onView(website)}
            disabled={busy}
          >
            Details
          </button>

          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(website)}
            disabled={busy}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(website)}
            disabled={busy}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default WebsiteRow;

