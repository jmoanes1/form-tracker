const COLORS = {
  working: "#22a06b",
  "not-working": "#e89819",
  broken: "#df5a5a",
  untested: "#9aa6b8",
};

function DonutChart({ items, total }) {
  const segments = items.map((item, index) => ({
    ...item,
    percentage: total ? (item.value / total) * 100 : 0,
    offset: total
      ? items
          .slice(0, index)
          .reduce((sum, previous) => sum + (previous.value / total) * 100, 0)
      : 0,
  }));

  return (
    <div className="donut-chart">
      <div className="donut-visual" role="img" aria-label={`Testing status: ${total} websites`}>
        <svg viewBox="0 0 42 42" aria-hidden="true">
          <circle className="donut-track" cx="21" cy="21" r="15.9155" />
          {segments.map((item) => (
              <circle
                key={item.key}
                className="donut-segment"
                cx="21"
                cy="21"
                r="15.9155"
                stroke={COLORS[item.key]}
                strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
                strokeDashoffset={-item.offset}
              />
            ))}
        </svg>
        <div className="donut-center">
          <strong>{total}</strong>
          <span>websites</span>
        </div>
      </div>

      <ul className="donut-legend">
        {items.map((item) => (
          <li key={item.key}>
            <span className="legend-label">
              <i style={{ backgroundColor: COLORS[item.key] }} />
              {item.label}
            </span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonutChart;
