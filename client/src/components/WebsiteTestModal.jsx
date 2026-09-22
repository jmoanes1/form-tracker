import { useState } from "react";

import Modal from "./Modal";
import { STATUS_OPTIONS } from "../utils/websiteList";

// Dedicated testing window.
// It opens the real website in a new tab and records the test result.
function WebsiteTestModal({ website, saving, error, onSave, onCancel }) {
  const [status, setStatus] = useState(website.status || "untested");
  const [tester, setTester] = useState(website.tester || "");
  const [notes, setNotes] = useState(website.notes || "");

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      status,
      tester: tester.trim(),
      notes: notes.trim(),
      // "untested" means it has not been tested, so there is no date.
      lastTested: status === "untested" ? null : new Date().toISOString(),
    });
  }

  return (
    <Modal title="Test Website" onClose={onCancel} closeDisabled={saving}>
      <form className="website-form" onSubmit={handleSubmit}>
        <div className="test-website">
          <p className="test-website-label">Website</p>

          <p className="test-website-url">{website.website}</p>

          <a
            className="primary-button open-website-button"
            href={website.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Website ↗
          </a>
        </div>

        {error && (
          <div className="form-alert" role="alert">
            {error}
          </div>
        )}

        <fieldset className="form-field fieldset-reset">
          <legend className="form-label">Form Testing Result</legend>

          <div className="radio-group">
            {STATUS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={
                  status === option.value
                    ? "radio-option radio-option-active"
                    : "radio-option"
                }
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={() => setStatus(option.value)}
                  disabled={saving}
                />

                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-field">
          <label className="form-label" htmlFor="test-tester">
            Tester
          </label>

          <input
            id="test-tester"
            className="form-control"
            type="text"
            placeholder="John"
            value={tester}
            onChange={(event) => setTester(event.target.value)}
            disabled={saving}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="test-notes">
            Notes
          </label>

          <textarea
            id="test-notes"
            className="form-control"
            rows={3}
            placeholder="What happened while testing the form?"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            disabled={saving}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Test Result"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default WebsiteTestModal;
