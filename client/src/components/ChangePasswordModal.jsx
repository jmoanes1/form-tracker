import { useState } from "react";
import Modal from "./Modal";

function ChangePasswordModal({ onClose, onSave }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (password.length < 8) return setError("New password must contain at least 8 characters.");
    setBusy(true); setError("");
    try { await onSave({ currentPassword, password }); onClose(); }
    catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }
  return <Modal title="Change password" onClose={onClose} closeDisabled={busy}>
    <form className="website-form" onSubmit={submit}>
      {error && <div className="form-alert">{error}</div>}
      <label className="form-field"><span className="form-label">Current password</span><input className="form-control" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoFocus disabled={busy} /></label>
      <label className="form-field"><span className="form-label">New password</span><input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} /></label>
      <div className="form-actions"><button type="button" className="secondary-button" onClick={onClose} disabled={busy}>Cancel</button><button className="primary-button" type="submit" disabled={busy}>{busy ? "Saving..." : "Update password"}</button></div>
    </form>
  </Modal>;
}

export default ChangePasswordModal;
