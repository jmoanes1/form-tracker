import { STATUS_OPTIONS } from "../utils/websiteList";

const LABELS = STATUS_OPTIONS.reduce((labels, option) => {
  labels[option.value] = option.label;

  return labels;
}, {});

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status}`}>
      {LABELS[status] || status}
    </span>
  );
}

export default StatusBadge;