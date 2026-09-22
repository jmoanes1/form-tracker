import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import TypeBadge from "./TypeBadge";
import { formatDate, formatDateTime } from "../utils/format";

// Detailed view of one website, including its testing history.
function WebsiteDetailModal({ website, onClose, onTest, onEdit }) {
  // Newest test first.
  const history = [...(website.testHistory || [])].sort(
    (a, b) => new Date(b.testedAt).getTime() - new Date(a.testedAt).getTime()
  );

  return (
    <Modal title="Website Details" onClose={onClose}>
      <div className="detail">
        <a
          className="detail-url"
          href={website.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          {website.website} ↗
        </a>

        <dl className="detail-list">
          <div className="detail-item">
            <dt>Type</dt>
            <dd>
              <TypeBadge type={website.type} />
            </dd>
          </div>

          <div className="detail-item">
            <dt>Current Status</dt>
            <dd>
              <StatusBadge status={website.status} />
            </dd>
          </div>

          <div className="detail-item">
            <dt>Tester</dt>
            <dd>{website.tester || "—"}</dd>
          </div>

          <div className="detail-item">
            <dt>Last Tested</dt>
            <dd>{formatDate(website.lastTested)}</dd>
          </div>

          <div className="detail-item">
            <dt>Added</dt>
            <dd>{formatDate(website.createdAt)}</dd>
          </div>

          <div className="detail-item detail-item-wide">
            <dt>Notes</dt>
            <dd>{website.notes || "—"}</dd>
          </div>
        </dl>

        <h3 className="detail-heading">Testing History</h3>

        {history.length === 0 ? (
          <p className="detail-empty">No tests recorded yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tester</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {history.map((entry, index) => (
                  <tr key={`${entry.testedAt}-${index}`}>
                    <td>{formatDateTime(entry.testedAt)}</td>
                    <td>{entry.tester || "—"}</td>
                    <td>
                      <StatusBadge status={entry.status} />
                    </td>
                    <td
                      className="cell-notes"
                      title={entry.notes || "No notes"}
                    >
                      {entry.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => onEdit(website)}
          >
            Edit
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => onTest(website)}
          >
            Test Website
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default WebsiteDetailModal;
