# Read-Only Attendance Portal (`prblms/two`)

Connected to the **TVSMNEPA School Attendance Management System** (`/api/v1/external`) to display live school, class, and student attendance data in **strictly read-only mode**.

## Setup & Run (Recommended Backend Proxy Mode)

Running `server.js` keeps your `TVSM_API_KEY` completely hidden on the backend server so visitors can never inspect it in browser DevTools.

1. Open a terminal in `prblms/two`:
   ```bash
   cd prblms/two
   npm install
   cp .env.example .env
   ```

2. Edit `prblms/two/.env`:
   ```env
   PORT=4000
   TVSM_API_BASE_URL=http://localhost:5000/api/v1/external
   TVSM_API_KEY=tvsm_ro_your_generated_key_from_tvsmnepa_settings
   PORTAL_ACCESS_CODE=
   ```
   - Generate `TVSM_API_KEY` inside **TVSMNEPA → Admin → Settings → External Read-Only API Keys → Generate Key**.
   - Optional: Set `PORTAL_ACCESS_CODE` (for example `school2026`) if you want visitors to enter a private access code before viewing attendance.

3. Start the portal:
   ```bash
   npm start
   ```
   Open **`http://localhost:4000`**.

## Quick Browser / Live Server Testing

If you open `attendance.html` directly with VS Code Live Server, click **API Settings** in the top-right corner and enter your `TVSMNEPA External API URL` + `tvsm_ro_...` key (saved only in `sessionStorage` for your current tab).
