import { useState } from "react";

import { STATUS_OPTIONS, TYPE_OPTIONS } from "../utils/websiteList";
import { isValidWebsiteUrl } from "../utils/validation";

const EMPTY_VALUES = {
  title: "",
  domainName: "",
  hostingName: "",
  website: "",
  type: "",
  status: "untested",
  tester: "",
  notes: "",
  username: "",
  password: "",
};

// Returns the error messages for the given values.
// An empty object means "everything is valid, you can submit".
function validate(values, showStatus) {
  const errors = {};

  if (!values.website.trim()) {
    errors.website = "Website URL is required.";
  } else if (!isValidWebsiteUrl(values.website)) {
    errors.website =
      "Enter a valid URL starting with http:// or https://.";
  }

  if (!values.type) {
    errors.type = "Website type is required.";
  }

  const hasValidStatus = STATUS_OPTIONS.some(
    (option) => option.value === values.status
  );

  if (showStatus && !hasValidStatus) {
    errors.status = "Status is required.";
  }

  return errors;
}

// Form used by the Add Website and Edit Website modals.
// `onSubmit` receives the cleaned values and is responsible for the request.
function WebsiteForm({
  initialValues,
  showStatus = false,
  submitting = false,
  error = "",
  submitLabel = "Save Website",
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => ({
    ...EMPTY_VALUES,
    ...initialValues,
    username: initialValues?.credentials?.username || "",
    // Passwords are deliberately never rendered back into the form.
    password: "",
  }));

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    // Remove the message of the field as soon as the user edits it.
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[name];

      return nextErrors;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values, showStatus);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = {
      title: values.title.trim(),
      domainName: values.domainName.trim(),
      hostingName: values.hostingName.trim(),
      website: values.website.trim(),
      type: values.type,
      tester: values.tester.trim(),
      notes: values.notes.trim(),
    };

    if (values.username.trim() || values.password) {
      payload.credentials = {
        username: values.username.trim(),
        ...(values.password ? { password: values.password } : {}),
      };
    }

    if (showStatus) {
      payload.status = values.status;
    }

    await onSubmit(payload);
  }

  return (
    <form className="website-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form-alert" role="alert">
          {error}
        </div>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="website-title">
          Website Title
        </label>

        <input
          id="website-title"
          name="title"
          type="text"
          className="form-control"
          placeholder="Example Company"
          value={values.title}
          onChange={handleChange}
          disabled={submitting}
          autoFocus
        />

        <p className="form-hint">A friendly name to identify this website.</p>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="domain-name">
          Domain Name
        </label>

        <input
          id="domain-name"
          name="domainName"
          type="text"
          className="form-control"
          placeholder="example.com"
          value={values.domainName}
          onChange={handleChange}
          disabled={submitting}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="hosting-name">
          Hosting Name
        </label>

        <input
          id="hosting-name"
          name="hostingName"
          type="text"
          className="form-control"
          placeholder="e.g. SiteGround, Kinsta, or AWS"
          value={values.hostingName}
          onChange={handleChange}
          disabled={submitting}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="website-url">
          Website URL <span className="required">*</span>
        </label>

        <input
          id="website-url"
          name="website"
          type="url"
          className={
            errors.website
              ? "form-control form-control-error"
              : "form-control"
          }
          placeholder="https://example.com"
          value={values.website}
          onChange={handleChange}
          disabled={submitting}
        />

        {errors.website && (
          <p className="form-error">{errors.website}</p>
        )}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="website-type">
          Website Type <span className="required">*</span>
        </label>

        <select
          id="website-type"
          name="type"
          className={
            errors.type
              ? "form-control form-control-error"
              : "form-control"
          }
          value={values.type}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value="">Select a type</option>

          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {errors.type && (
          <p className="form-error">{errors.type}</p>
        )}
      </div>

      <fieldset className="credential-fields">
        <legend>Website credentials</legend>
        <p className="form-hint">
          Optional credentials used to access this website. Leave the password
          blank when editing to keep the saved password unchanged.
        </p>

        <div className="form-field">
          <label className="form-label" htmlFor="website-username">
            Username or email
          </label>

          <input
            id="website-username"
            name="username"
            type="text"
            className="form-control"
            placeholder="name@example.com"
            value={values.username}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="username"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="website-password">
            Password
          </label>

          <input
            id="website-password"
            name="password"
            type="password"
            className="form-control"
            placeholder={initialValues?.credentials?.password ? "Saved password" : "Enter password"}
            value={values.password}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="new-password"
          />
        </div>
      </fieldset>

      {showStatus && (
        <div className="form-field">
          <label className="form-label" htmlFor="website-status">
            Status
          </label>

          <select
            id="website-status"
            name="status"
            className="form-control"
            value={values.status}
            onChange={handleChange}
            disabled={submitting}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="form-hint">
            Changing the status records a new entry in the testing history.
          </p>
        </div>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="website-tester">
          Tester
        </label>

        <input
          id="website-tester"
          name="tester"
          type="text"
          className="form-control"
          placeholder="John"
          value={values.tester}
          onChange={handleChange}
          disabled={submitting}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="website-notes">
          Notes
        </label>

        <textarea
          id="website-notes"
          name="notes"
          className="form-control"
          rows={3}
          placeholder="Anything useful to remember about this website."
          value={values.notes}
          onChange={handleChange}
          disabled={submitting}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default WebsiteForm;
