function Header({
  onAddWebsite,
  onExportWebsites,
  username,
  avatarUrl,
  onProfile,
  title = "Form Testing Dashboard",
  description = "Monitor and manage WordPress form testing.",
}) {
  return (
    <header className="header">
      <div className="header-intro">
        <span className="product-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 3.8h7.2a2.8 2.8 0 0 1 2.8 2.8v10.8a2.8 2.8 0 0 1-2.8 2.8H7.8A2.8 2.8 0 0 1 5 17.4V4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8.5 8h4.5M8.5 11.2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="16.5" cy="16.5" r="4.5" fill="#DDF8FF" />
            <path d="m14.4 16.5 1.35 1.35 2.75-2.85" stroke="#2563EB" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <span className="header-eyebrow"><i aria-hidden="true" />Operations workspace</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="header-context"><span>Form testing</span><b>/</b><span>Website management</span></div>

      <div className="header-actions">
        <button
          type="button"
          className="secondary-button export-button"
          onClick={onExportWebsites}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 16v2.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> Export
        </button>

        <button
          type="button"
          className="add-button"
          onClick={onAddWebsite}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> Add website
        </button>
        <button type="button" className="profile-trigger" onClick={onProfile} aria-label="Open profile">
          <span className="profile-avatar">{avatarUrl ? <img src={avatarUrl} alt="" /> : username?.slice(0, 1).toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
