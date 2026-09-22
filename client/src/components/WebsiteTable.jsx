import WebsiteRow from "./WebsiteRow";

// Table with all the websites of the current page.
function WebsiteTable({
  websites,
  selectedIds,
  busy,
  allSelected,
  emptyTitle,
  emptyMessage,
  onToggleSelect,
  onToggleSelectAll,
  onTest,
  onView,
  onEdit,
  onDelete,
}) {
  if (websites.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="cell-select">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                disabled={busy}
                aria-label="Select all websites on this page"
              />
            </th>

            <th>Website</th>
            <th>Type</th>
            <th>Status</th>
            <th>Tester</th>
            <th>Last Tested</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {websites.map((website) => (
            <WebsiteRow
              key={website.id}
              website={website}
              selected={selectedIds.includes(website.id)}
              busy={busy}
              onToggleSelect={onToggleSelect}
              onTest={onTest}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WebsiteTable;
