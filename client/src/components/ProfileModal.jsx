import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import Modal from "./Modal";
import { createAccount, deleteAccount, getUsers } from "../services/api";

function ProfileModal({ profile, onClose, onSave, onChangePassword, onLogout }) {
  const isAdmin = String(profile.role || "").toLowerCase() === "admin";
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(isAdmin);

  const [usersError, setUsersError] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deleting, setDeleting] = useState("");
  const [accountToRemove, setAccountToRemove] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    setUsersLoading(true);
    setUsersError("");
    getUsers()
      .then((result) => setUsers(result.data || []))
      .catch((requestError) => setUsersError(requestError.message))
      .finally(() => setUsersLoading(false));
  }, [isAdmin]);

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 1024 * 1024) {
      setError("Choose an image under 1 MB in PNG, JPEG, WebP, or GIF format.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setAvatarUrl(String(reader.result)); setError(""); };
    reader.readAsDataURL(file);
  }

  async function save() {
    setBusy(true); setError("");
    try { await onSave({ avatarUrl }); onClose(); }
    catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  }

  async function handleCreateAccount(event) {
    event.preventDefault();
    setCreating(true); setCreateError("");
    try {
      const result = await createAccount({ username: newUsername.trim(), password: newPassword, role: newRole });
      setUsers((current) => [...current, result.data]);
      setNewUsername(""); setNewPassword(""); setNewRole("staff");
    } catch (requestError) { setCreateError(requestError.message); }
    finally { setCreating(false); }
  }

  async function handleDeleteAccount() {
    if (!accountToRemove) return;
    const username = accountToRemove.username;
    setDeleting(username); setUsersError("");
    try {
      await deleteAccount(username);
      setUsers((current) => current.filter((user) => user.username !== username));
      setAccountToRemove(null);
    } catch (requestError) { setUsersError(requestError.message); }
    finally { setDeleting(""); }
  }

  const initials = (profile.username || "?").slice(0, 1).toUpperCase();
  const roleLabel = isAdmin ? "Administrator" : "Staff";
  return <>
    <Modal title="Profile" onClose={onClose} closeDisabled={busy}>
    <div className="profile-editor">
      <div className="profile-avatar profile-avatar-large">{avatarUrl ? <img src={avatarUrl} alt="Profile preview" /> : initials}</div>
      <div><strong>{profile.username}</strong><p className="form-hint">{roleLabel} account</p></div>
    </div>
    {error && <div className="form-alert" role="alert">{error}</div>}
    <label className="form-field"><span className="form-label">Profile picture</span><input className="form-control" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFile} disabled={busy} /></label>
    <div className="form-actions">
      {avatarUrl && <button type="button" className="secondary-button" onClick={() => setAvatarUrl("")} disabled={busy}>Remove photo</button>}
      <button type="button" className="primary-button" onClick={save} disabled={busy}>{busy ? "Saving..." : "Save profile"}</button>
    </div>
    {isAdmin && (
      <div className="accounts-section">
        <h3 className="accounts-heading">Team accounts</h3>
        <p className="form-hint">Create staff or admin accounts. Staff can use the dashboard; only admins can manage accounts.</p>
        <form className="account-form" onSubmit={handleCreateAccount}>
          {createError && <div className="form-alert" role="alert">{createError}</div>}
          <div className="account-form-grid">
            <label className="form-field"><span className="form-label">Username</span><input className="form-control" value={newUsername} onChange={(event) => setNewUsername(event.target.value)} placeholder="Staff name" disabled={creating} /></label>
            <label className="form-field"><span className="form-label">Password</span><input className="form-control" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Min. 8 characters" disabled={creating} /></label>
            <label className="form-field"><span className="form-label">Role</span>
              <select className="form-control" value={newRole} onChange={(event) => setNewRole(event.target.value)} disabled={creating}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <button className="primary-button" type="submit" disabled={creating}>{creating ? "Creating..." : "Create account"}</button>
        </form>
        {usersLoading && <p className="form-hint">Loading accounts...</p>}
        {usersError && <div className="form-alert" role="alert">{usersError}</div>}
        {!usersLoading && users.length > 0 && (
          <ul className="accounts-list">
            {users.map((user) => (
              <li key={user.username} className="account-row">
                <span className="account-name">{user.username}</span>
                <span className={`role-badge role-${user.role}`}>{user.role}</span>
                {user.username !== profile.username
                  ? <button type="button" className="link-button danger-link" onClick={() => setAccountToRemove(user)} disabled={Boolean(deleting)}>Remove</button>
                  : <span className="form-hint">You</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
    <div className="profile-menu-actions">
      <button type="button" className="header-account-button" onClick={() => { onClose(); onChangePassword(); }}>Change password</button>
      <button type="button" className="header-account-button profile-signout" onClick={() => { onClose(); onLogout(); }}>Sign out</button>
    </div>
    </Modal>
    {accountToRemove && <ConfirmModal
      title="Remove account?"
      message="This will permanently remove this account and end its access to the dashboard."
      details={accountToRemove.username}
      confirmLabel="Remove account"
      busyLabel="Removing..."
      busy={deleting === accountToRemove.username}
      onConfirm={handleDeleteAccount}
      onCancel={() => setAccountToRemove(null)}
    />}
  </>;
}

export default ProfileModal;
