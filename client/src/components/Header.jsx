function Header({ onAddWebsite, onExportWebsites }) {
  return (
    <header className="header">
      <div className="header-intro">
        <span className="product-mark" aria-hidden="true">FT</span>
        <div>
          <span className="header-eyebrow">Operations workspace</span>
          <h1>Form Testing Dashboard</h1>
          <p>Monitor and manage WordPress form testing.</p>
        </div>
      </div>

      <nav className="header-nav" aria-label="Dashboard navigation">
        <span className="header-nav-item header-nav-item-active">Overview</span>
        <span className="header-nav-item">Website registry</span>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="secondary-button export-button"
          onClick={onExportWebsites}
        >
          <span aria-hidden="true">↓</span> Export
        </button>

        <button
          type="button"
          className="add-button"
          onClick={onAddWebsite}
        >
          <span aria-hidden="true">+</span> Add website
        </button>
      </div>
    </header>
  );
}

export default Header;
