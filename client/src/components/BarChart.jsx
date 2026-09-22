// Simple CSS bar chart, no chart library needed.
// `items` looks like: [{ key: "working", label: "Working", value: 60 }]
function BarChart({ items }) {
  const maxValue = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul className="bar-chart">
      {items.map((item) => (
        <li key={item.key} className="bar-row">
          <span className="bar-label">{item.label}</span>

          <span className="bar-track">
            <span
              className={`bar-fill bar-${item.key}`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </span>

          <span className="bar-value">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default BarChart;
