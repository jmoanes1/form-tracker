const navigation = [
  { href: "/", label: "Dashboard", icon: "dashboard", group: "Overview" },
  { href: "/websites", label: "All Websites", icon: "globe", group: "Websites" },
  { href: "/websites/leads", label: "Leads Websites", icon: "spark", group: "Websites" },
  { href: "/websites/non-leads", label: "None Leads", icon: "folder", group: "Websites" },
];

function NavIcon({ name }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.9 12h16.2M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5C9.8 18.1 8.7 15.3 8.7 12S9.8 5.9 12 3.5Z" /></>,
    spark: <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 13 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />,
    folder: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2.5h6.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />,
  };

  return <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function BrandLogo() {
  return (
    <svg className="sidebar-brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="brand-surface" x1="7" y1="5" x2="41" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="brand-check" x1="16" y1="19" x2="32" y2="33" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DDF8FF" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#brand-surface)" />
      <path d="M15 13.5h13.2a4.3 4.3 0 0 1 4.3 4.3v13.6a3.1 3.1 0 0 1-3.1 3.1H18.1a3.1 3.1 0 0 1-3.1-3.1V16.5a3 3 0 0 1 3-3Z" fill="#1D4ED8" fillOpacity=".34" />
      <path d="M19 19h9M19 23h6" stroke="#DBEAFE" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="28.5" cy="28.5" r="8.5" fill="url(#brand-check)" />
      <path d="m24.6 28.5 2.45 2.45 5-5.15" stroke="#2563EB" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38.5 13.2v4M36.5 15.2h4" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Sidebar() {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const groups = [...new Set(navigation.map((item) => item.group))];

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <a className="sidebar-brand" href="/" aria-label="Form Testing Dashboard home">
        <BrandLogo />
        <span className="sidebar-brand-copy"><strong>Form Testing</strong><small>Operations</small></span>
      </a>
      <nav className="sidebar-nav">
        {groups.map((group) => (
          <div className="sidebar-group" key={group}>
            <p className="sidebar-label">{group}</p>
            {navigation.filter((item) => item.group === group).map((item) => {
              const active = currentPath === item.href;

              return (
                <a key={item.href} className={active ? "sidebar-link sidebar-link-active" : "sidebar-link"} href={item.href} aria-current={active ? "page" : undefined}>
                  <NavIcon name={item.icon} />
                  <span>{item.label}</span>
                  {active && <span className="sidebar-active-dot" aria-hidden="true" />}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer"><span className="sidebar-footer-dot" />Secure workspace</div>
    </aside>
  );
}

export default Sidebar;
