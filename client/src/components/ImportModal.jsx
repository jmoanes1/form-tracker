import { useState } from "react";

import Modal from "./Modal";
import { createWebsite } from "../services/api";
import { buildImportPlan } from "../utils/csv";

// CSV import window. It reads the file in the browser, validates every row
// and then sends the valid rows to the API one by one.
function ImportModal({ existingWebsites, onClose, onFinished }) {
  const [fileName, setFileName] = useState("");
  const [plan, setPlan] = useState(null);
  const [summary, setSummary] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    setError("");
    setPlan(null);
    setSummary(null);

    const reader = new FileReader();

    reader.onload = () => {
      const result = buildImportPlan(
        String(reader.result || ""),
        existingWebsites
      );

      if (result.summary.total === 0) {
        setError(
          "No rows were found. The file needs a header line such as: website,type"
        );

        return;
      }

      setFileName(file.name);
      setPlan(result);
    };

    reader.onerror = () => {
      setError("The file could not be read. Please try again.");
    };

    reader.readAsText(file);
  }

  async function handleImport() {
    if (!plan) {
      return;
    }

    setImporting(true);
    setError("");

    const result = { ...plan.summary };

    for (const website of plan.websites) {
      try {
        await createWebsite(website);

        result.imported += 1;
      } catch (requestError) {
        // 409 means the backend already has this website.
        if (requestError.status === 409) {
          result.duplicates += 1;
        } else {
          result.failed += 1;
        }
      }
    }

    setSummary(result);
    setPlan(null);
    setImporting(false);

    if (onFinished) {
      onFinished(result);
    }
  }

  return (
    <Modal title="Import Websites" onClose={onClose} closeDisabled={importing}>
      <div className="website-form">
        {error && (
          <div className="form-alert" role="alert">
            {error}
          </div>
        )}

        {summary ? (
          <div className="import-summary">
            <h3>Import Complete</h3>

            <ul>
              <li>
                Imported: <strong>{summary.imported}</strong>
              </li>
              <li>
                Skipped: <strong>{summary.skipped}</strong>
              </li>
              <li>
                Invalid URLs: <strong>{summary.invalidUrls}</strong>
              </li>
              <li>
                Duplicate URLs: <strong>{summary.duplicates}</strong>
              </li>

              {summary.failed > 0 && (
                <li>
                  Failed: <strong>{summary.failed}</strong>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <>
            <div className="form-field">
              <label className="form-label" htmlFor="import-file">
                CSV file
              </label>

              <input
                id="import-file"
                className="form-control"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                disabled={importing}
              />

              <p className="form-hint">
                The first line must be a header:
                <br />
                website,type,tester,notes
                <br />
                Type must be leads or none_leads.
              </p>
            </div>

            {plan && (
              <div className="import-preview">
                <p>
                  <strong>{fileName}</strong>
                </p>

                <p>
                  Ready to import: {plan.websites.length} of{" "}
                  {plan.summary.total} rows
                </p>

                <ul>
                  <li>Already valid and new: {plan.websites.length}</li>
                  <li>Invalid URLs: {plan.summary.invalidUrls}</li>
                  <li>Duplicate URLs: {plan.summary.duplicates}</li>
                  <li>Skipped rows: {plan.summary.skipped}</li>
                </ul>
              </div>
            )}
          </>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={importing}
          >
            Close
          </button>

          {!summary && (
            <button
              type="button"
              className="primary-button"
              onClick={handleImport}
              disabled={!plan || importing || plan.websites.length === 0}
            >
              {importing ? "Importing..." : "Import Websites"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ImportModal;
