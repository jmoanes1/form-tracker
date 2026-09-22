// Search box above the website table.
// It searches the website URL, the tester and the notes.
function SearchBar({ value, onChange, disabled = false }) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>

      <input
        type="search"
        className="search-input"
        placeholder="Search websites..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label="Search websites"
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange("")}
          disabled={disabled}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;

