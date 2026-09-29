import { SORT_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS } from "../utils/websiteList";

// Type filter, status filter and sorting.
// All three work together with the search box.
function FilterBar({
  type,
  status,
  sortBy,
  onTypeChange,
  onStatusChange,
  onSortChange,
  typeLocked = false,
  disabled = false,
}) {
  return (
    <div className="filter-bar">
      <label className="filter-item">
        <span className="filter-label">Type</span>

        <select
          className="form-control"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          disabled={disabled || typeLocked}
        >
          <option value="">All Types</option>

          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-item">
        <span className="filter-label">Status</span>

        <select
          className="form-control"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          disabled={disabled}
        >
          <option value="">All Status</option>

          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-item">
        <span className="filter-label">Sort by</span>

        <select
          className="form-control"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          disabled={disabled}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FilterBar;
