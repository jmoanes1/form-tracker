import { useState } from "react";

// The first account has no way in through the sign-in form, so when the
// server has no users the login screen switches to a "create admin" form
// instead. setupRequired comes from GET /api/auth/status.
function LoginPage({ onSubmit, onSetup, setupRequired = false }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (setupRequired) {
      // Checked here as well as on the server so the user gets an instant,
      // readable message instead of a round trip.
      if (password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setBusy(true);
    setError("");
    try {
      if (setupRequired) await onSetup({ username, password });
      else await onSubmit({ username, password });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="Form Testing Dashboard">
        <div className="login-brand">
          <span className="login-brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 3.8h7.2a2.8 2.8 0 0 1 2.8 2.8v10.8a2.8 2.8 0 0 1-2.8 2.8H7.8A2.8 2.8 0 0 1 5 17.4V4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M8.5 8h4.5M8.5 11.2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="16.5" cy="16.5" r="4.5" fill="#DDF8FF" /><path d="m14.4 16.5 1.35 1.35 2.75-2.85" stroke="#2563EB" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <span><strong>Form Testing</strong><small>Operations</small></span>
        </div>
        <div className="login-showcase-copy">
          <span className="login-kicker"><i aria-hidden="true" />Website operations</span>
          <h1>Keep every form<br />in view.</h1>
          <p>One focused workspace for website testing, issue tracking, and reliable follow-up.</p>
        </div>
        <div className="login-status-list" aria-label="Dashboard capabilities">
          <span><b>✓</b> Test status tracking</span>
          <span><b>✓</b> Website registry</span>
          <span><b>✓</b> Secure team access</span>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <span className="login-card-eyebrow">{setupRequired ? "First-time setup" : "Secure sign in"}</span>
          <h1>{setupRequired ? "Create your admin account" : "Welcome back"}</h1>
          <p>{setupRequired ? "This server has no accounts yet. Create the first admin account to continue." : "Sign in to access your testing workspace."}</p>
          {error && <div className="form-alert" role="alert">{error}</div>}
          <label className="form-field">
            <span className="form-label">Username</span>
            <span className="login-input-wrap">
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.8-3.6 3.2-5.5 7.5-5.5s6.7 1.9 7.5 5.5" /></svg>
              <input className="form-control" placeholder="Enter your username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" autoFocus disabled={busy} />
            </span>
          </label>
          <label className="form-field">
            <span className="form-label">Password</span>
            <span className="login-input-wrap">
              <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
              <input className="form-control" type="password" placeholder={setupRequired ? "At least 8 characters" : "Enter your password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={setupRequired ? "new-password" : "current-password"} disabled={busy} />
            </span>
          </label>
          {setupRequired && (
            <label className="form-field">
              <span className="form-label">Confirm password</span>
              <span className="login-input-wrap">
                <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                <input className="form-control" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" disabled={busy} />
              </span>
            </label>
          )}
          <button className="primary-button" type="submit" disabled={busy}>{busy ? (setupRequired ? "Creating account..." : "Signing in...") : (setupRequired ? "Create admin account" : "Sign in to dashboard")}</button>
          <p className="login-security-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5.5 6v5c0 4.1 2.7 7.9 6.5 10 3.8-2.1 6.5-5.9 6.5-10V6L12 3Z" /><path d="m9.2 12 1.8 1.8 3.8-4" /></svg>Your session is protected.</p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
