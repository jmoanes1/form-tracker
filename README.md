# Form Testing Dashboard

A full-stack dashboard for manually testing WordPress websites and their forms.

You keep a list of websites, open each one in a browser tab, test its form, and
record the result (`untested`, `working`, `not_working`, `broken`) in the
dashboard. All statistics, charts, filtering, sorting and history are calculated
from the stored data.

---

## Features

### Website management

- Add websites in a modal (URL, type, tester, notes) with validation
- Edit any website, including its status
- Delete a website through a custom confirmation modal
- Duplicate protection: `https://example.com`, `http://example.com` and
  `https://www.example.com/` are treated as the same website

### Form testing workflow

- Dedicated "Test Website" modal with an **Open Website** button
- Radio buttons for the test result, plus tester and notes
- Saving a test updates the status and `lastTested` and appends an entry to the
  testing history

### Dashboard

- Live counts: total, working, not working, broken, untested, leads, none leads
- Two CSS bar charts (form testing status and website type)
- Every count is calculated from the website array, so the cards update
  immediately after a change

### Working with many websites

- Search on website URL, tester and notes
- Type filter, status filter and sorting (A-Z, Z-A, newest, oldest, tested
  dates, status) - all of them work together
- Pagination, 25 websites per page
- Bulk actions: select websites and delete them or mark them with a status
- CSV import with a summary (imported, skipped, invalid URLs, duplicate URLs)

### Quality of life

- Toast notifications for every success and error
- Loading states and disabled buttons while a request is running
- Friendly error messages (no stack traces), empty states, responsive layout
- Testing history per website, shown on the details view

---

## Tech stack

| Layer    | Technology                                |
| -------- | ----------------------------------------- |
| Frontend | React 19 + Vite                           |
| Backend  | Node.js + Express 5                       |
| Styling  | Plain CSS (no Tailwind, no CSS framework) |
| Storage  | A JSON file (`server/data/websites.json`) |
| Database | None                                      |

No database, no ORM and no chart or notification library are used.

---

## Folder structure

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

---

## Installation

Two folders, two installs:

```bash
cd server
npm install
```

```bash
cd client
npm install
```

---

## Running the app

The easiest way is one command from the project root, which starts the API
and the client together (see `scripts/dev.js`):

```bash
npm run dev
```

* API -> <http://localhost:5000>
* App -> <http://localhost:5173>

Open <http://localhost:5173>. Press `Ctrl+C` to stop both.

To install everything at once from the project root:

```bash
npm run install:all
```

Or run them separately in two terminals:

Terminal 1 (backend):

```bash
cd server
npm run dev        # node --watch server.js -> http://localhost:5000
```

Terminal 2 (frontend):

```bash
cd client
npm run dev        # vite -> http://localhost:5173
```

Open <http://localhost:5173>.

The frontend always calls `/api/...` on its own origin; Vite proxies those
requests to `http://127.0.0.1:5000` (see `client/vite.config.js`). To point the
frontend at another API address, create `client/.env` with:

```text
VITE_API_URL=http://localhost:5000/api
```

---

## API endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint        | Description                                   |
| ------ | --------------- | --------------------------------------------- |
| GET    | `/health`       | Health check                                  |
| GET    | `/websites`     | All websites                                  |
| GET    | `/websites/:id` | One website                                   |
| POST   | `/websites`     | Create a website (always starts as untested)  |
| PUT    | `/websites/:id` | Update a website (status changes add history) |
| DELETE | `/websites/:id` | Delete a website                              |
| GET    | `/dashboard`    | Counts calculated from the data file          |

### Response format

Success:

```json
{
  "success": true,
  "message": "Website updated successfully.",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Website not found."
}
```

### Status codes

| Code | Meaning                                                 |
| ---- | ------------------------------------------------------- |
| 200  | OK                                                      |
| 201  | Website created                                         |
| 400  | Validation failed (missing field, bad URL, bad type...) |
| 404  | Website or endpoint not found                           |
| 409  | The website URL already exists                          |
| 500  | Server error (file read/write problem)                  |

### Validation rules

- `website`: required, must be a full `http://` or `https://` URL
- `type`: required, `leads` or `none_leads`
- `status`: `untested`, `working`, `not_working` or `broken`
- `tester` and `notes`: optional text
- `lastTested`: optional ISO date or `null`

---

## JSON data structure

`server/data/websites.json` is an array of website objects:

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

Rules:

- `status` always represents the **latest** test
- `lastTested` stays `null` while the status is `untested`
- every test result is appended to `testHistory`
- older records are upgraded when they are read (a missing `testHistory`
  becomes `[]`, missing fields get safe defaults)

### CSV import format

```csv
website,type,tester,notes
https://example1.com,leads,John,
https://example2.com,none_leads,Mike,"Form is hidden behind a cookie banner"
```

Import summary example:

```text
Import Complete
Imported: 95
Skipped: 5
Invalid URLs: 3
Duplicate URLs: 2
```

---

## Development

```bash
cd client
npm run dev      # start the dev server with hot reload
npm run lint     # check the code with ESLint
```

```bash
cd server
npm run dev      # start the API with --watch
npm start        # start the API once
```

### Where to change what

| I want to change...          | File                                          |
| ---------------------------- | --------------------------------------------- |
| Statistics, charts, table    | `client/src/pages/Dashboard.jsx`               |
| The website form             | `client/src/components/WebsiteForm.jsx`        |
| The test result window       | `client/src/components/WebsiteTestModal.jsx`   |
| Search, filter, sort, paging | `client/src/utils/websiteList.js`              |
| CSV import rules             | `client/src/utils/csv.js`                      |
| API validation               | `server/utils/validation.js`                   |
| All the styling              | `client/src/index.css`                         |

---

## Build

```bash
cd client
npm run build      # writes client/dist
npm run preview    # serves the production build (also proxies /api)
```

```bash
cd server
npm start          # serves the API on port 5000
```

---

## Deployment

1. Run `npm run build` in `client/` and upload `client/dist` to a static host
   (Netlify, Vercel, nginx, ...).
2. Run the Express app where Node.js is available (Render, Railway, a VPS, ...).
   Change `PORT` in `server/server.js` if 5000 is not available.
3. Because the frontend talks to `/api`, either:
   - let the web server proxy `/api` to the Node API (recommended), or
   - set `VITE_API_URL` to the public API URL and rebuild the client.
4. Make sure the data folder is writable, otherwise saving fails.

---

## Limitations

- JSON file storage: fine for a few hundred websites, not for many users or a
  lot of data
- No authentication, everybody who can reach the API can change the data
- Writes are synchronous and not protected against two requests at the same time
- Search, filtering, sorting and pagination happen in the browser on the
  already loaded list
- Bulk actions send one request per website
- URL normalization is intentionally simple (protocol, `www.`, trailing slash
  and hash are ignored, the path is kept)
- `server/data/websites.backup.json` only keeps the previous version of the
  data file
