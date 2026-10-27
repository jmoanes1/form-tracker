# Form Testing Dashboard

A full-stack web application for managing websites and manually testing their WordPress forms in one convenient dashboard.

The **Form Testing Dashboard** helps developers, digital marketers, and website administrators keep track of websites that need to be tested. Instead of maintaining a spreadsheet or recording test results manually, you can organize websites, open them directly from the dashboard, test their forms, and save the results for future reference.

Each website has a testing status, assigned tester, notes, and a history of previous tests. The dashboard also provides statistics, charts, search, filters, sorting, pagination, bulk actions, and CSV import to make managing multiple websites easier.

The application is built with React, Node.js, and Express. It uses a JSON file to store website records, so there is no need to configure a database to get started.

## Features

### 1. Website Management

Manage all your websites from a single dashboard.

- **Add websites:** Register a website using a modal form with fields for its URL, website type, tester, and notes.
- **Edit website details:** Update the website URL, type, assigned tester, notes, or current testing status.
- **Delete websites:** Remove individual records through a confirmation modal to help prevent accidental deletion.
- **Prevent duplicate entries:** The application normalizes website URLs before checking for duplicates. For example, `https://example.com`, `http://example.com`, and `https://www.example.com/` are treated as the same website.
- **Organize website types:** Classify websites as `leads` or `none_leads` to make them easier to manage and analyze.

### 2. Form Testing Workflow

Test website forms and record the results directly from the dashboard.

Each website has a dedicated **Test Website** modal that provides the information needed to perform and document a test.

- **Open Website:** Open the selected website in a browser tab so you can test its form.
- **Record test results:** Choose one of four statuses:
  - `untested` — The form has not been tested yet.
  - `working` — The form works as expected.
  - `not_working` — The form is not functioning correctly.
  - `broken` — The form is broken or cannot be used.
- **Record the tester:** Save the name of the person who performed the test.
- **Add testing notes:** Describe the result, problems encountered, or anything that needs further investigation.
- **Update the latest status:** Once a test is saved, the website's current status and last-tested date are updated.
- **Maintain testing history:** Every saved test is added to the website's history, allowing previous results to be reviewed later.

The testing history is particularly useful when a form has been fixed and needs to be tested again, or when a previously working form starts experiencing problems.

### 3. Dashboard Statistics and Charts

The dashboard provides a quick overview of all registered websites and their current testing status.

It includes statistics for:

- Total websites
- Working forms
- Forms that are not working
- Broken forms
- Untested websites
- Lead-generation websites
- Non-lead-generation websites

The dashboard also includes two lightweight CSS bar charts:

- **Form Testing Status:** Shows how websites are distributed across the four testing statuses.
- **Website Type:** Shows the distribution of lead-generation and non-lead-generation websites.

All statistics and chart values are calculated from the stored website records. When a website is added, edited, deleted, or tested, the dashboard can reflect the updated data without requiring manually maintained totals.

### 4. Search, Filtering, and Sorting

Finding a particular website becomes easier as the list grows.

**Search**

Search through website records using:

- Website URL
- Tester name
- Notes

**Filters**

Combine filters to narrow down the website list by:

- Website type (`leads` or `none_leads`)
- Testing status (`untested`, `working`, `not_working`, or `broken`)

**Sorting**

Organize the results using the following options:

- Website URL, A–Z
- Website URL, Z–A
- Newest first
- Oldest first
- Most recently tested
- Least recently tested
- Testing status

Search, filters, and sorting work together, making it easier to find specific websites without manually reviewing the entire list.

### 5. Pagination and Bulk Actions

The dashboard is designed to handle a growing list of website records without displaying everything on one page.

- **Pagination:** Display 25 websites per page.
- **Select multiple websites:** Choose individual records for bulk operations.
- **Bulk delete:** Delete selected websites.
- **Bulk status update:** Mark selected websites with a chosen testing status.

Bulk actions are useful when managing a large collection of websites or updating multiple records after a round of testing.

### 6. CSV Import

Import website records from a CSV file instead of adding them individually.

The import feature supports the following columns:

- `website`
- `type`
- `tester`
- `notes`

During import, the application validates the records and checks for duplicate URLs. After processing the file, it displays a summary containing:

- Number of successfully imported websites
- Number of skipped records
- Number of invalid URLs
- Number of duplicate URLs

This makes it easier to transfer an existing website list from a spreadsheet into the dashboard.

### 7. Testing History and Website Details

Each website has a details view where you can review its information and testing history.

The history records include the test result, tester, notes, and date of the test. Previous entries are retained when a new test is saved, providing a record of how the form has performed over time.

The current website status always represents the latest saved result, while the testing history preserves earlier results.

### 8. User Experience and Error Handling

The application includes several features to make everyday use more straightforward.

- Toast notifications for successful actions and errors
- Loading indicators while requests are being processed
- Disabled buttons during ongoing requests to help prevent repeated submissions
- Clear validation messages for missing or invalid information
- Confirmation dialogs for destructive actions
- Empty states when no websites match the current search or filters
- Responsive layouts for different screen sizes
- Friendly error messages instead of exposing server stack traces in the interface

These features help make the dashboard easier to use and provide clearer feedback when something goes wrong.

## Technology Stack

The application uses a React frontend and an Express backend, with JSON file storage for persistence.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 | Builds the dashboard and reusable interface components |
| Build Tool | Vite | Provides the development server and production build |
| Backend | Node.js | Runs the server-side application |
| API Framework | Express 5 | Handles API routes, validation, and website operations |
| Styling | Plain CSS | Controls the layout, colors, charts, modals, and responsive design |
| Data Storage | JSON file | Stores website records and testing history |
| Data Validation | Custom JavaScript utilities | Validates website details and incoming data |
| Charts | CSS | Displays dashboard statistics without a charting library |
| Notifications | Custom React components | Displays success and error messages |

The project does not use a database, ORM, CSS framework, charting package, or notification library. The core functionality is implemented using the technologies listed above.

## Project Structure

The project is divided into two main applications: `client` for the frontend and `server` for the backend.

```text
form-testing-dashboard/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BarChart.jsx
│   │   │   ├── BulkActions.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ImportModal.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── TypeBadge.jsx
│   │   │   ├── WebsiteDetailModal.jsx
│   │   │   ├── WebsiteForm.jsx
│   │   │   ├── WebsiteRow.jsx
│   │   │   ├── WebsiteTable.jsx
│   │   │   └── WebsiteTestModal.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── csv.js
│   │   │   ├── format.js
│   │   │   ├── validation.js
│   │   │   └── websiteList.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── data/
│   │   └── websites.json
│   ├── routes/
│   │   ├── dashboard.js
│   │   └── websites.js
│   ├── utils/
│   │   ├── dataStore.js
│   │   └── validation.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

### Frontend (`client/`)

The frontend contains the dashboard interface and its reusable components.

- `components/` contains the website table, forms, modals, filters, charts, notifications, and other interface elements.
- `pages/Dashboard.jsx` brings the main dashboard together, including statistics, website records, and the controls for managing them.
- `services/api.js` handles communication with the backend API.
- `utils/` contains reusable functions for CSV processing, formatting, validation, and website list operations.
- `App.jsx` and `main.jsx` initialize the React application.
- `index.css` contains the application's styles.
- `vite.config.js` configures Vite and the development proxy.

### Backend (`server/`)

The backend handles website records, validation, and API requests.

- `routes/websites.js` manages website operations such as creating, retrieving, updating, and deleting records.
- `routes/dashboard.js` provides dashboard statistics calculated from stored data.
- `utils/dataStore.js` handles reading and writing the JSON data file.
- `utils/validation.js` validates incoming website information.
- `data/websites.json` stores website records and their testing history.
- `server.js` configures and starts the Express server.

## Getting Started

Follow these steps to install and run the application locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — preferably an active LTS release compatible with your dependencies.
- npm — included with Node.js.
- A modern web browser.

You can verify your installation by running:

```bash
node -v
npm -v
```

### 1. Install the Dependencies

Open a terminal in the project root directory.

Install the backend dependencies:

```bash
cd server
npm install
```

Then install the frontend dependencies:

```bash
cd ../client
npm install
```

Return to the project root when both installations are complete:

```bash
cd ..
```

### 2. Start the Application

If the project root contains the `scripts/dev.js` script and a root `package.json` with the corresponding development command, start both applications with:

```bash
npm run dev
```

The application should be available at:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

Open the frontend URL in your browser to use the dashboard.

Press `Ctrl+C` in the terminal to stop the running development processes.

**Note:** The root-level command requires the root scripts and configuration to be present. If they are not included in your project, you can start the frontend and backend separately.

### 3. Run the Frontend and Backend Separately

Open two terminal windows.

**Terminal 1 — Backend**

```bash
cd server
npm run dev
```

This starts the Express API using Node.js watch mode, assuming the `dev` script is configured in `server/package.json`.

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

Vite starts the frontend development server. Open http://localhost:5173 in your browser.

### 4. Configure the API URL

By default, the frontend sends API requests through its own origin using paths such as `/api/websites`. The Vite development server proxies these requests to the backend at `http://127.0.0.1:5000`.

This setup allows the frontend to communicate with the API without hardcoding the backend address throughout the application.

If you need to configure a different API address, create a `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend service must be configured to read `VITE_API_URL` for this setting to take effect. Restart the Vite development server after changing environment variables.

## API Documentation

The Express backend exposes a REST API for managing websites and retrieving dashboard statistics.

**Base URL**

```text
http://localhost:5000/api
```

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Checks whether the API is running |
| GET | `/websites` | Retrieves the website list |
| GET | `/websites/:id` | Retrieves a specific website |
| POST | `/websites` | Creates a website with an initial `untested` status |
| PUT | `/websites/:id` | Updates a website and records applicable status changes in its history |
| DELETE | `/websites/:id` | Deletes a website |
| GET | `/dashboard` | Retrieves dashboard statistics calculated from stored records |

### Example Success Response

A successful API request returns a response containing a success flag, a message, and the requested data.

```json
{
  "success": true,
  "message": "Website updated successfully.",
  "data": {}
}
```

The contents of `data` depend on the endpoint and operation.

### Example Error Response

When a website cannot be found or a request fails validation, the API returns a descriptive error message.

```json
{
  "success": false,
  "message": "Website not found."
}
```

### HTTP Status Codes

| Status Code | Meaning |
|---|---|
| `200 OK` | The request completed successfully |
| `201 Created` | A website was created successfully |
| `400 Bad Request` | The request contains invalid or missing information |
| `404 Not Found` | The requested website or endpoint does not exist |
| `409 Conflict` | The website URL already exists |
| `500 Internal Server Error` | An unexpected server or file-storage error occurred |

### Validation Rules

The backend validates incoming website data before saving it.

| Field | Requirement |
|---|---|
| `website` | Required; must be a valid, fully qualified `http://` or `https://` URL |
| `type` | Required; must be `leads` or `none_leads` |
| `status` | Must be `untested`, `working`, `not_working`, or `broken` when supplied |
| `tester` | Optional text |
| `notes` | Optional text |
| `lastTested` | Optional ISO-formatted date or `null` |

New websites always begin with an `untested` status, regardless of the status supplied in the creation request.

## Data Storage

The application uses a JSON file instead of a database. Website records are stored in:

```text
server/data/websites.json
```

Each record contains the website's identifying information, current testing status, and testing history.

### Example Website Record

```json
[
  {
    "id": "f5696ce3-6457-4722-8e5b-f4788de8c9cd",
    "website": "https://example.com",
    "type": "leads",
    "status": "untested",
    "notes": "",
    "tester": "John",
    "lastTested": null,
    "createdAt": "2026-09-22T05:49:32.635Z",
    "testHistory": [
      {
        "status": "working",
        "tester": "John",
        "notes": "Form submitted successfully.",
        "testedAt": "2026-09-22T10:00:00.000Z"
      }
    ]
  }
]
```

The values in this example illustrate the expected data structure.

### How Testing History Works

The application follows a few rules to keep website records consistent:

- `status` represents the latest saved testing result.
- `lastTested` remains `null` until a test has been performed.
- Each saved test result is appended to `testHistory`.
- History entries retain the result, tester, notes, and test date.
- `createdAt` records when the website was initially added.
- Older records are upgraded with safe defaults when they are read, including an empty `testHistory` array when the field is missing.

This structure allows the dashboard to show the latest result while retaining earlier test records.

**Storage consideration:** JSON file storage is convenient for local development and small projects. It is not designed to provide the same concurrency, scalability, or data-integrity guarantees as a database.

## Importing Websites from CSV

The CSV import feature lets you add multiple websites in one operation.

### Supported CSV Format

The file must contain a header row with the supported column names.

```csv
website,type,tester,notes
https://example1.com,leads,John,
https://example2.com,none_leads,Mike,"Form is hidden behind a cookie banner"
```

Each row represents one website.

- `website` contains the website URL.
- `type` identifies the website as `leads` or `none_leads`.
- `tester` identifies the assigned tester.
- `notes` contains optional information about the website.

The application validates the imported records and checks for duplicate website URLs before adding them.

### Example Import Summary

```text
Import Complete

Imported: 95
Skipped: 5
Invalid URLs: 3
Duplicate URLs: 2
```

These numbers are illustrative. The actual summary depends on the CSV file being imported.

## Development Commands

### Frontend

Run these commands from the `client/` directory.

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run lint
```

Runs ESLint to check the frontend code, assuming the lint script is configured.

```bash
npm run build
```

Creates an optimized production build in `client/dist/`.

```bash
npm run preview
```

Serves the production build locally for testing. API proxy behavior depends on the Vite configuration.

### Backend

Run these commands from the `server/` directory.

```bash
npm run dev
```

Starts the Express server in development mode using Node.js watch mode, if configured.

```bash
npm start
```

Starts the backend using the production start script.

## Where to Make Changes

Use this reference when you need to update a particular part of the application.

| Task | File |
|---|---|
| Dashboard statistics, charts, and main layout | `client/src/pages/Dashboard.jsx` |
| Add or edit website form | `client/src/components/WebsiteForm.jsx` |
| Website testing modal | `client/src/components/WebsiteTestModal.jsx` |
| Search, filtering, sorting, and pagination logic | `client/src/utils/websiteList.js` |
| CSV import and parsing | `client/src/utils/csv.js` |
| Frontend validation | `client/src/utils/validation.js` |
| Backend validation | `server/utils/validation.js` |
| JSON file reading and writing | `server/utils/dataStore.js` |
| Website API routes | `server/routes/websites.js` |
| Dashboard statistics API | `server/routes/dashboard.js` |
| API requests from the frontend | `client/src/services/api.js` |
| Application-wide styling | `client/src/index.css` |
| Vite configuration and development proxy | `client/vite.config.js` |

## Building for Production

### 1. Build the Frontend

From the `client/` directory, run:

```bash
npm run build
```

Vite generates the production files in:

```text
client/dist/
```

These files can be hosted on a static hosting service or served through a web server.

### 2. Start the Backend

Deploy the Express application to an environment that supports Node.js.

Run the production start command:

```bash
cd server
npm start
```

The server must have access to the JSON data directory and permission to read and write the data file.

### 3. Configure Frontend and Backend Communication

In production, the frontend must be able to reach the public API.

There are two common approaches:

- **Reverse proxy:** Configure the web server to forward `/api` requests to the Express backend. This keeps the frontend API paths consistent.
- **Public API URL:** Configure `VITE_API_URL` with the deployed API address and rebuild the frontend. The frontend service must support this environment variable.

Make sure the deployed backend and frontend use the same expected API routes.

### 4. Choose Suitable Hosting

The frontend can be hosted on a static hosting platform, while the backend requires a Node.js-compatible environment.

For example, you could use a static hosting provider for the React build and a Node.js hosting provider for the Express API.

Before deploying, confirm that the hosting provider supports persistent writable storage for the JSON file. Some hosting environments use ephemeral filesystems, meaning file changes may be lost when an instance restarts or is redeployed.

## Current Limitations

The application is designed for straightforward website management and manual form testing. There are some limitations to consider as the project grows.

- **JSON file storage:** Suitable for a small collection of websites, but less appropriate for large datasets or multiple concurrent users.
- **No authentication:** Anyone who can reach the API may be able to modify or delete records unless access is restricted externally.
- **Concurrent writes:** Synchronous file operations are used, and writes are not protected by a transaction or dedicated locking mechanism.
- **Browser-side list processing:** Search, filtering, sorting, and pagination operate on the list already loaded by the frontend.
- **Bulk actions:** Operations are sent as individual requests rather than a single bulk API request.
- **Basic URL normalization:** The duplicate check ignores the protocol, `www.` prefix, trailing slash, and URL hash while keeping the path. It is not a complete canonicalization system.
- **Backup handling:** A `websites.backup.json` file may retain the previous data version, but this should not be treated as a complete backup and recovery strategy.
- **Manual testing only:** The application records results entered by the tester. It does not automatically submit WordPress forms, inspect server responses, or verify email delivery.
- **No user roles:** The application does not distinguish administrators, testers, or other user types.

For a larger deployment, potential improvements include a database such as PostgreSQL, user authentication, role-based permissions, safer data updates, automated backups, and server-side pagination.

## Future Improvements

The project can be extended as testing requirements become more complex.

Possible additions include:

- PostgreSQL integration for more reliable data management
- User accounts and role-based access control
- Server-side search, filtering, sorting, and pagination
- Dedicated bulk API endpoints
- Automated backup and restore functionality
- Scheduled reminders for websites that have not been tested recently
- Test result attachments, screenshots, and error logs
- More detailed reporting and export options
- Automated checks for form availability and submission responses

These are potential enhancements rather than features currently included in the application.

## Project Purpose

The Form Testing Dashboard was created to make manual website form testing more organized and easier to track. It brings website management, testing results, historical records, and dashboard reporting into one interface.

The project also demonstrates practical full-stack development skills, including React component design, REST API development with Express, input validation, file-based data persistence, CRUD operations, reusable CSS components, and data-driven dashboard statistics.

By keeping the interface simple and the workflow focused, the application provides a useful starting point for managing WordPress website testing in a real-world development or digital marketing environment.
