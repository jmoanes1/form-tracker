// Small label that shows whether a website is a leads website.
function TypeBadge({ type }) {
  const isLeads = type === "leads";

  return (
    <span className={`type-badge ${isLeads ? "type-leads" : "type-none-leads"}`}>
      {isLeads ? "Leads" : "None Leads"}
    </span>
  );
}

export default TypeBadge;
