const iconPaths = {
  total: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></>,
  working: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
  "not-working": <><circle cx="12" cy="12" r="9" /><path d="M12 7v5M12 16h.01" /></>,
  broken: <><path d="M12 3 2.8 19h18.4L12 3Z" /><path d="M12 9v4M12 16h.01" /></>,
  untested: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  leads: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.6-3.4 2.5-5 5.5-5s4.9 1.6 5.5 5M17 8h4M19 6v4" /></>,
  "none-leads": <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.6-3.4 2.5-5 5.5-5s4.9 1.6 5.5 5M17 17l4-4M17 13l4 4" /></>,
};

function StatCard({ title, count, type }) {
  return (
    <div className={`stat-card stat-${type}`}>
      <div className="stat-card-heading">
        <div className="stat-card-title">{title}</div>
        <span className="stat-card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {iconPaths[type] || iconPaths.total}
          </svg>
        </span>
      </div>
      <div className="stat-card-count">{count}</div>
    </div>
  );
}

export default StatCard;
