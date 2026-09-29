import Sidebar from "../Sidebar";

// Shared shell for dashboard modules. Individual pages provide the main content.
function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}

export default AppLayout;
