import { useEffect, useState } from "react";
import ChangePasswordModal from "./components/ChangePasswordModal";
import LoginPage from "./components/LoginPage";
import ProfileModal from "./components/ProfileModal";
import AppLayout from "./components/Layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import LeadsWebsites from "./pages/Websites/LeadsWebsites";
import NonLeadsWebsites from "./pages/Websites/NonLeadsWebsites";
import { changePassword, getAuthStatus, login, logout, setupAccount, updateProfile } from "./services/api";

function App() {
  const [auth, setAuth] = useState(null);
  const [changeOpen, setChangeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => { getAuthStatus().then((result) => setAuth(result.data)).catch(() => setAuth({ setupRequired: false, authenticated: false })); }, []);

  async function submitLogin(values) {
    const result = await login(values);
    setAuth({ setupRequired: false, authenticated: true, username: result.data.username, role: result.data.role, avatarUrl: result.data.avatarUrl || "" });
  }

  // First run on a fresh (or wiped) server: no account exists yet, so the
  // /auth/login route can never succeed. Create the first admin instead.
  async function submitSetup(values) {
    const result = await setupAccount(values);
    setAuth({ setupRequired: false, authenticated: true, username: result.data.username, role: result.data.role, avatarUrl: result.data.avatarUrl || "" });
  }

  function handleLogout() {
    // End the visible session first so the sign-in screen is never delayed by
    // a slow or unavailable API response. The server session is then cleared
    // in the background.
    setAuth((current) => ({ ...current, authenticated: false }));
    logout().catch(() => undefined);
  }

  if (!auth) return <main className="login-page"><div className="login-card">Loading secure workspace...</div></main>;
  if (!auth.authenticated) return <LoginPage setupRequired={auth.setupRequired} onSubmit={submitLogin} onSetup={submitSetup} />;
  const dashboardProps = { username: auth.username, avatarUrl: auth.avatarUrl, onProfile: () => setProfileOpen(true), onChangePassword: () => setChangeOpen(true), onLogout: handleLogout };
  const route = window.location.pathname.replace(/\/+$/, "") || "/";
  const page = route === "/websites/leads" ? <LeadsWebsites {...dashboardProps} /> : route === "/websites/non-leads" ? <NonLeadsWebsites {...dashboardProps} /> : route === "/websites" ? <Dashboard {...dashboardProps} pageTitle="All Websites" pageDescription="Manage and test every registered website." /> : <Dashboard {...dashboardProps} />;

  return <AppLayout>
    {page}
    {changeOpen && <ChangePasswordModal onClose={() => setChangeOpen(false)} onSave={changePassword} />}
    {profileOpen && <ProfileModal profile={auth} onClose={() => setProfileOpen(false)} onChangePassword={() => setChangeOpen(true)} onLogout={handleLogout} onSave={async (values) => { const result = await updateProfile(values); setAuth((current) => ({ ...current, ...result.data })); }} />}
  </AppLayout>;
}

export default App;
