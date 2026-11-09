// ═══════════════════════════════════════════════════════════════════════════
//  TVSMNEPA READ-ONLY ATTENDANCE PORTAL CLIENT
//  Works seamlessly with:
//    1. Backend Proxy Mode (`npm start` in prblms/two -> /api/* keeps API key secret)
//    2. Direct Session Mode (click "API Settings" when using VS Code Live Server)
// ═══════════════════════════════════════════════════════════════════════════

const ALL_CLASSES_VALUE = "__OVERVIEW__";
const STORAGE_URL_KEY = "tvsm_direct_api_url";
const STORAGE_API_KEY = "tvsm_direct_api_key";
const STORAGE_PASSCODE_KEY = "tvsm_portal_passcode";

const elements = {
  schoolNameLabel: document.querySelector("#school-name-label"),
  sessionBadge: document.querySelector("#session-badge"),
  homeLink: document.querySelector("#home-link"),
  headingEyebrow: document.querySelector("#heading-eyebrow"),
  pageTitle: document.querySelector("#page-title"),
  headingSubtitle: document.querySelector("#heading-subtitle"),
  dateLabel: document.querySelector("#date-label"),
  classSelect: document.querySelector("#class-select"),
  dateInput: document.querySelector("#attendance-date"),
  searchLabel: document.querySelector("#search-label"),
  searchInput: document.querySelector("#student-search"),
  totalCount: document.querySelector("#total-count"),
  totalNote: document.querySelector("#total-note"),
  presentCount: document.querySelector("#present-count"),
  presentNote: document.querySelector("#present-note"),
  absentCount: document.querySelector("#absent-count"),
  absentNote: document.querySelector("#absent-note"),
  unmarkedCount: document.querySelector("#unmarked-count"),
  rateNote: document.querySelector("#rate-note"),
  registerEyebrow: document.querySelector("#register-eyebrow"),
  registerTitle: document.querySelector("#register-title"),
  backOverviewBtn: document.querySelector("#back-overview-btn"),
  recordCount: document.querySelector("#record-count"),
  statusMessage: document.querySelector("#status-message"),
  statusText: document.querySelector("#status-text"),
  tableHead: document.querySelector("#table-head"),
  rows: document.querySelector("#attendance-rows"),
  updatedLabel: document.querySelector("#updated-label"),

  // Modals
  openSettingsBtn: document.querySelector("#open-settings-btn"),
  settingsModal: document.querySelector("#settings-modal"),
  settingsForm: document.querySelector("#settings-form"),
  closeSettingsBtn: document.querySelector("#close-settings-btn"),
  savePermanentBtn: document.querySelector("#save-permanent-btn"),
  settingsFeedback: document.querySelector("#settings-feedback"),
  directApiUrlInput: document.querySelector("#direct-api-url"),
  directApiKeyInput: document.querySelector("#direct-api-key"),

  passcodeModal: document.querySelector("#passcode-modal"),
  passcodeForm: document.querySelector("#passcode-form"),
  passcodeInput: document.querySelector("#portal-passcode-input"),
  passcodeError: document.querySelector("#passcode-error"),

  studentModal: document.querySelector("#student-modal"),
  closeStudentBtn: document.querySelector("#close-student-btn"),
  studentModalScholar: document.querySelector("#student-modal-scholar"),
  studentModalName: document.querySelector("#student-modal-name"),
  studentModalMeta: document.querySelector("#student-modal-meta"),
  studentModalStats: document.querySelector("#student-modal-stats"),
  studentHistoryRows: document.querySelector("#student-history-rows"),
};

const state = {
  useDirectMode: false,
  proxyAvailable: false,
  proxyConfigured: false,
  requiresPasscode: false,
  viewMode: "overview", // "overview" | "class"
  classesList: [],
  overviewRows: [],
  studentRows: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTodayIst() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function formatTime(isoStr) {
  if (!isoStr) return "--";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(text) {
  return String(text || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] || "")
    .join("")
    .toUpperCase();
}

function setStatus(message, statusState = "") {
  elements.statusText.textContent = message;
  elements.statusMessage.dataset.state = statusState;
}

function setSummary({
  total = "--",
  present = "--",
  absent = "--",
  unmarked = "--",
  percentage = null,
  scopeText = "active students",
}) {
  elements.totalCount.textContent = total;
  elements.totalNote.textContent = scopeText;
  elements.presentCount.textContent = present;
  elements.absentCount.textContent = absent;
  elements.unmarkedCount.textContent = unmarked;
  elements.rateNote.textContent =
    percentage !== null && percentage !== undefined
      ? `${percentage}% attendance rate`
      : "--% attendance rate";
}

function getDirectSettings() {
  return {
    baseUrl: (sessionStorage.getItem(STORAGE_URL_KEY) || "")
      .trim()
      .replace(/\/+$/, ""),
    apiKey: (sessionStorage.getItem(STORAGE_API_KEY) || "").trim(),
  };
}

// ─── API Client (Proxy or Direct Session Fallback) ────────────────────────────
async function apiGet(path) {
  const direct = getDirectSettings();
  const usingDirect = Boolean(direct.baseUrl && direct.apiKey);

  const url = usingDirect ? `${direct.baseUrl}${path}` : `/api${path}`;
  const headers = { Accept: "application/json" };

  if (usingDirect) {
    headers["X-API-Key"] = direct.apiKey;
  } else {
    const savedPasscode = sessionStorage.getItem(STORAGE_PASSCODE_KEY) || "";
    if (savedPasscode) {
      headers["X-Portal-Passcode"] = savedPasscode;
    }
  }

  const res = await fetch(url, { method: "GET", headers });
  let payload = null;
  try {
    payload = await res.json();
  } catch {
    throw new Error(`Unexpected response (${res.status})`);
  }

  if (res.status === 401 && payload?.code === "PASSCODE_REQUIRED") {
    elements.passcodeModal.showModal();
    throw new Error("Enter the private access code to view attendance.");
  }

  if (!res.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed (${res.status})`);
  }

  return payload?.data ?? payload;
}

// ─── Table Renderers ──────────────────────────────────────────────────────────
function setTableColumns(columns) {
  const tr = document.createElement("tr");
  columns.forEach((label) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    tr.append(th);
  });
  elements.tableHead.replaceChildren(tr);
}

function renderEmptyRow(colSpan, message) {
  elements.rows.replaceChildren();
  const tr = document.createElement("tr");
  tr.className = "empty-row";
  const td = document.createElement("td");
  td.colSpan = colSpan;
  td.textContent = message;
  tr.append(td);
  elements.rows.append(tr);
}

function renderOverviewTable() {
  setTableColumns([
    "CLASS",
    "CLASS TEACHER",
    "ENROLLED",
    "PRESENT",
    "ABSENT",
    "RATE",
    "REGISTER",
  ]);

  const q = elements.searchInput.value.trim().toLowerCase();
  const filtered = state.overviewRows.filter((cls) =>
    `${cls.fullName} ${cls.classTeacher || ""} ${cls.group || ""}`
      .toLowerCase()
      .includes(q),
  );

  elements.recordCount.textContent = `${filtered.length} class${filtered.length === 1 ? "" : "es"}`;

  if (filtered.length === 0) {
    renderEmptyRow(
      7,
      q ? "No classes match your search." : "No active classes found.",
    );
    return;
  }

  elements.rows.replaceChildren();
  filtered.forEach((cls) => {
    const tr = document.createElement("tr");
    tr.className = "clickable-row";
    tr.addEventListener("click", () => {
      elements.classSelect.value = String(cls.classId);
      loadSelectedView();
    });

    // Class cell
    const nameTd = document.createElement("td");
    const wrap = document.createElement("div");
    wrap.className = "student-name";
    const avatar = document.createElement("span");
    avatar.className = "student-avatar";
    avatar.textContent = String(cls.name || "C").slice(0, 3).toUpperCase();
    const meta = document.createElement("div");
    meta.className = "student-meta";
    const title = document.createElement("span");
    title.textContent = cls.fullName;
    const sub = document.createElement("span");
    sub.className = "student-sub";
    sub.textContent = cls.group || "";
    meta.append(title, sub);
    wrap.append(avatar, meta);
    nameTd.append(wrap);

    const teacherTd = document.createElement("td");
    teacherTd.textContent = cls.classTeacher || "—";

    const totalTd = document.createElement("td");
    totalTd.textContent = String(cls.totalStudents ?? 0);

    const presentTd = document.createElement("td");
    presentTd.textContent = String(cls.present ?? 0);

    const absentTd = document.createElement("td");
    absentTd.textContent = String(cls.absent ?? 0);

    const rateTd = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = `status-pill status-${cls.status || "pending"}`;
    pill.textContent =
      cls.status === "pending" || cls.status === "empty"
        ? cls.status
        : `${cls.percentage}%`;
    rateTd.append(pill);

    const actionTd = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "row-link-btn";
    btn.textContent = "Open Register →";
    actionTd.append(btn);

    tr.append(nameTd, teacherTd, totalTd, presentTd, absentTd, rateTd, actionTd);
    elements.rows.append(tr);
  });
}

function renderClassStudentTable() {
  setTableColumns(["STUDENT", "SCHOLAR NO", "STATUS", "MARKED AT", "HISTORY"]);

  const q = elements.searchInput.value.trim().toLowerCase();
  const filtered = state.studentRows.filter((st) =>
    `${st.name} ${st.scholarNumber} ${st.fatherName || ""}`
      .toLowerCase()
      .includes(q),
  );

  elements.recordCount.textContent = `${filtered.length} student${filtered.length === 1 ? "" : "s"}`;

  if (filtered.length === 0) {
    renderEmptyRow(
      5,
      q
        ? "No students match your search."
        : "No active students enrolled in this class.",
    );
    return;
  }

  elements.rows.replaceChildren();
  filtered.forEach((st) => {
    const tr = document.createElement("tr");
    tr.className = "clickable-row";
    tr.addEventListener("click", () => openStudentHistory(st.scholarNumber));

    const nameTd = document.createElement("td");
    const wrap = document.createElement("div");
    wrap.className = "student-name";
    const avatar = document.createElement("span");
    avatar.className = "student-avatar";
    avatar.textContent = getInitials(st.name);
    const meta = document.createElement("div");
    meta.className = "student-meta";
    const title = document.createElement("span");
    title.textContent = st.name;
    const sub = document.createElement("span");
    sub.className = "student-sub";
    sub.textContent = st.fatherName ? `F/N: ${st.fatherName}` : "";
    meta.append(title, sub);
    wrap.append(avatar, meta);
    nameTd.append(wrap);

    const scholarTd = document.createElement("td");
    scholarTd.textContent = st.scholarNumber || "--";

    const statusTd = document.createElement("td");
    const statusNorm = String(st.status || "Unmarked").toLowerCase();
    const pill = document.createElement("span");
    pill.className = `status-pill status-${statusNorm}`;
    pill.textContent = st.status || "Unmarked";
    statusTd.append(pill);

    const timeTd = document.createElement("td");
    timeTd.textContent = formatTime(st.markedAt);

    const historyTd = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "row-link-btn";
    btn.textContent = "History";
    historyTd.append(btn);

    tr.append(nameTd, scholarTd, statusTd, timeTd, historyTd);
    elements.rows.append(tr);
  });
}

function renderActiveTable() {
  if (state.viewMode === "overview") {
    renderOverviewTable();
  } else {
    renderClassStudentTable();
  }
}

// ─── Data Loaders ─────────────────────────────────────────────────────────────
async function loadSelectedView() {
  const selected = elements.classSelect.value || ALL_CLASSES_VALUE;
  const date = elements.dateInput.value;
  if (!date) return;

  setStatus("Syncing attendance data...", "loading");
  elements.classSelect.disabled = true;

  try {
    if (selected === ALL_CLASSES_VALUE) {
      state.viewMode = "overview";
      elements.backOverviewBtn.classList.add("hidden");
      elements.searchLabel.textContent = "FIND A CLASS";
      elements.searchInput.placeholder = "Search class or teacher name";

      const overview = await apiGet(
        `/overview?date=${encodeURIComponent(date)}`,
      );

      if (overview.schoolName) {
        elements.schoolNameLabel.textContent = overview.schoolName;
      }
      if (overview.session?.name) {
        elements.sessionBadge.textContent = `SESSION ${overview.session.name} • READ-ONLY`;
      }

      elements.registerEyebrow.textContent = "ALL CLASSES";
      elements.registerTitle.textContent = "School-Wide Daily Overview";

      const s = overview.summary || {};
      setSummary({
        total: s.totalStudents ?? 0,
        present: s.present ?? 0,
        absent: s.absent ?? 0,
        unmarked: s.unmarked ?? 0,
        percentage: s.attendancePercentage ?? 0,
        scopeText: `${s.markedClasses ?? 0}/${s.totalClasses ?? 0} classes marked`,
      });

      state.overviewRows = Array.isArray(overview.classes)
        ? overview.classes
        : [];
      renderOverviewTable();

      if (overview.isHoliday && overview.holiday?.name) {
        setStatus(
          `Holiday: ${overview.holiday.name} (${overview.holiday.type || "Holiday"})`,
        );
      } else if (overview.isNonWorkingDay) {
        setStatus(`${overview.dayName} is a non-working day.`);
      } else {
        setStatus(
          "Showing live read-only overview. Click any class to inspect its student register.",
        );
      }
    } else {
      state.viewMode = "class";
      elements.backOverviewBtn.classList.remove("hidden");
      elements.searchLabel.textContent = "FIND A STUDENT";
      elements.searchInput.placeholder = "Search student name or scholar no";

      const detail = await apiGet(
        `/classes/${encodeURIComponent(selected)}/attendance?date=${encodeURIComponent(date)}`,
      );

      const cls = detail.class || {};
      const s = detail.summary || {};

      elements.registerEyebrow.textContent = cls.classTeacher
        ? `CLASS REGISTER • TEACHER: ${cls.classTeacher.toUpperCase()}`
        : "CLASS REGISTER";
      elements.registerTitle.textContent = cls.fullName || "Student List";

      setSummary({
        total: s.totalStudents ?? 0,
        present: s.present ?? 0,
        absent: s.absent ?? 0,
        unmarked: s.unmarked ?? 0,
        percentage: s.attendancePercentage ?? 0,
        scopeText: `students in ${cls.fullName || "class"}`,
      });

      state.studentRows = Array.isArray(detail.students) ? detail.students : [];
      renderClassStudentTable();

      if (detail.isHoliday && detail.holiday?.name) {
        setStatus(`Holiday: ${detail.holiday.name}`);
      } else {
        setStatus(
          `Showing ${cls.fullName || "class"} attendance. Click any student to view their attendance history.`,
        );
      }
    }

    elements.updatedLabel.textContent = `Synced ${new Date().toLocaleTimeString(
      [],
      { hour: "numeric", minute: "2-digit" },
    )}`;
  } catch (err) {
    state.overviewRows = [];
    state.studentRows = [];
    setSummary({});
    renderEmptyRow(
      state.viewMode === "overview" ? 7 : 5,
      "Unable to load attendance records.",
    );
    setStatus(err.message, "error");
    elements.updatedLabel.textContent = "Connection needed";
  } finally {
    elements.classSelect.disabled = false;
  }
}

async function loadClassesAndBoot() {
  setStatus("Loading school classes...", "loading");

  try {
    const data = await apiGet("/classes");
    const classes = Array.isArray(data) ? data : data?.classes || [];
    state.classesList = classes;

    if (data?.session?.name) {
      elements.sessionBadge.textContent = `SESSION ${data.session.name} • READ-ONLY`;
    }

    elements.classSelect.replaceChildren();

    const overviewOption = document.createElement("option");
    overviewOption.value = ALL_CLASSES_VALUE;
    overviewOption.textContent = "All Classes — School Overview";
    elements.classSelect.append(overviewOption);

    classes.forEach((cls) => {
      const opt = document.createElement("option");
      opt.value = String(cls._id || cls.classId || cls.id);
      const label = cls.fullName || `${cls.name} - ${cls.section || ""}`.trim();
      opt.textContent =
        cls.totalStudents !== undefined
          ? `${label} (${cls.totalStudents})`
          : label;
      elements.classSelect.append(opt);
    });

    elements.classSelect.disabled = false;
    await loadSelectedView();
  } catch (err) {
    elements.classSelect.innerHTML =
      '<option value="">Connection required</option>';
    elements.classSelect.disabled = true;
    setStatus(err.message, "error");
  }
}

// ─── Student History Modal ────────────────────────────────────────────────────
async function openStudentHistory(scholarNumber) {
  if (!scholarNumber) return;

  elements.studentModalScholar.textContent = `SCHOLAR NO • ${scholarNumber}`;
  elements.studentModalName.textContent = "Loading student history...";
  elements.studentModalMeta.textContent = "";
  elements.studentModalStats.replaceChildren();
  elements.studentHistoryRows.innerHTML =
    '<tr><td colspan="3">Loading...</td></tr>';
  elements.studentModal.showModal();

  try {
    const data = await apiGet(
      `/students/${encodeURIComponent(scholarNumber)}/attendance`,
    );
    const st = data.student || {};
    const sum = data.summary || {};
    const history = Array.isArray(data.history) ? data.history : [];

    elements.studentModalName.textContent = st.name || scholarNumber;
    elements.studentModalMeta.textContent = [
      st.class?.fullName ? `Class: ${st.class.fullName}` : null,
      st.fatherName ? `Father: ${st.fatherName}` : null,
      st.session?.name ? `Session: ${st.session.name}` : null,
    ]
      .filter(Boolean)
      .join("  •  ");

    const statItems = [
      ["MARKED DAYS", sum.totalDaysMarked ?? 0],
      ["PRESENT", sum.present ?? 0],
      ["ABSENT", sum.absent ?? 0],
      ["RATE", `${sum.attendancePercentage ?? 0}%`],
    ];

    elements.studentModalStats.replaceChildren();
    statItems.forEach(([label, val]) => {
      const box = document.createElement("div");
      box.className = "mini-stat-box";
      const sp = document.createElement("span");
      sp.textContent = label;
      const stg = document.createElement("strong");
      stg.textContent = String(val);
      box.append(sp, stg);
      elements.studentModalStats.append(box);
    });

    elements.studentHistoryRows.replaceChildren();
    if (history.length === 0) {
      elements.studentHistoryRows.innerHTML =
        '<tr class="empty-row"><td colspan="3">No attendance history recorded yet.</td></tr>';
      return;
    }

    history.slice(0, 60).forEach((item) => {
      const tr = document.createElement("tr");
      const dTd = document.createElement("td");
      dTd.textContent = item.date;
      const sTd = document.createElement("td");
      const pill = document.createElement("span");
      pill.className = `status-pill status-${String(item.status).toLowerCase()}`;
      pill.textContent = item.status;
      sTd.append(pill);
      const tTd = document.createElement("td");
      tTd.textContent = formatTime(item.markedAt);
      tr.append(dTd, sTd, tTd);
      elements.studentHistoryRows.append(tr);
    });
  } catch (err) {
    elements.studentModalName.textContent = "Unable to load history";
    elements.studentModalMeta.textContent = err.message;
    elements.studentHistoryRows.replaceChildren();
  }
}

// ─── Initialization & Event Listeners ─────────────────────────────────────────
function updateDateStamp() {
  if (!elements.dateInput.value) return;
  const selectedDate = new Date(`${elements.dateInput.value}T12:00:00`);
  elements.dateLabel.textContent = selectedDate
    .toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

async function initPortal() {
  elements.dateInput.value = getTodayIst();
  updateDateStamp();

  // Check if Express proxy server (`node server.js`) is running
  try {
    const res = await fetch("/api/config", {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      state.proxyAvailable = Boolean(json?.data?.proxyAvailable);
      state.proxyConfigured = Boolean(json?.data?.configured);
      state.requiresPasscode = Boolean(json?.data?.requiresPasscode);
    }
  } catch {
    state.proxyAvailable = false;
  }

  const direct = getDirectSettings();
  if (!state.proxyConfigured && (!direct.baseUrl || !direct.apiKey)) {
    elements.classSelect.innerHTML =
      '<option value="">Configure API to start</option>';
    setStatus(
      state.proxyAvailable
        ? "Set TVSM_API_BASE_URL & TVSM_API_KEY in prblms/two/.env (or click 'API Settings' above)."
        : "Run `npm start` in prblms/two, or click 'API Settings' to connect your TVSMNEPA API key.",
      "error",
    );
    return;
  }

  if (
    state.proxyAvailable &&
    state.requiresPasscode &&
    !sessionStorage.getItem(STORAGE_PASSCODE_KEY)
  ) {
    elements.passcodeModal.showModal();
    return;
  }

  await loadClassesAndBoot();
}

// Filter & navigation events
elements.classSelect.addEventListener("change", loadSelectedView);
elements.dateInput.addEventListener("change", () => {
  updateDateStamp();
  loadSelectedView();
});
elements.searchInput.addEventListener("input", renderActiveTable);

elements.backOverviewBtn.addEventListener("click", () => {
  elements.classSelect.value = ALL_CLASSES_VALUE;
  elements.searchInput.value = "";
  loadSelectedView();
});

elements.homeLink.addEventListener("click", (e) => {
  e.preventDefault();
  if (!elements.classSelect.disabled) {
    elements.classSelect.value = ALL_CLASSES_VALUE;
    elements.searchInput.value = "";
    loadSelectedView();
  }
});

// Settings dialog events
elements.openSettingsBtn.addEventListener("click", () => {
  const direct = getDirectSettings();
  elements.directApiUrlInput.value =
    direct.baseUrl || "http://localhost:5000/api/v1/external";
  elements.directApiKeyInput.value = direct.apiKey || "";
  elements.settingsModal.showModal();
});

elements.closeSettingsBtn.addEventListener("click", () => {
  elements.settingsModal.close();
});

elements.settingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = elements.directApiUrlInput.value.trim().replace(/\/+$/, "");
  const key = elements.directApiKeyInput.value.trim();
  if (url && key) {
    sessionStorage.setItem(STORAGE_URL_KEY, url);
    sessionStorage.setItem(STORAGE_API_KEY, key);
  }
  elements.settingsModal.close();
  await loadClassesAndBoot();
});

elements.savePermanentBtn.addEventListener("click", async () => {
  const baseUrl = elements.directApiUrlInput.value.trim().replace(/\/+$/, "");
  const apiKey = elements.directApiKeyInput.value.trim();
  elements.settingsFeedback.textContent = "";

  if (!baseUrl || !apiKey) {
    elements.settingsFeedback.textContent = "Enter both the API URL and API key.";
    return;
  }

  elements.savePermanentBtn.disabled = true;
  elements.settingsFeedback.textContent = "Saving securely to the local .env file...";

  try {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ baseUrl, apiKey }),
    });
    const result = await response.json();
    if (!response.ok || !result?.data?.persisted) {
      throw new Error(result.message || `Save failed (${response.status})`);
    }

    sessionStorage.removeItem(STORAGE_URL_KEY);
    sessionStorage.removeItem(STORAGE_API_KEY);
    elements.settingsModal.close();
    setStatus("API settings saved permanently to the local .env file.");
    await loadClassesAndBoot();
  } catch (error) {
    elements.settingsFeedback.textContent =
      `${error.message} Open the portal with npm start to save permanently.`;
  } finally {
    elements.savePermanentBtn.disabled = false;
  }
});

// Passcode dialog events
elements.passcodeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const code = elements.passcodeInput.value.trim();
  if (!code) return;
  elements.passcodeError.classList.add("hidden");

  try {
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: code }),
    });
    const json = await res.json();
    if (!res.ok || !json.valid) {
      throw new Error(json.message || "Invalid access code.");
    }
    sessionStorage.setItem(STORAGE_PASSCODE_KEY, code);
    elements.passcodeInput.value = "";
    elements.passcodeModal.close();
    await loadClassesAndBoot();
  } catch (err) {
    elements.passcodeError.textContent = err.message;
    elements.passcodeError.classList.remove("hidden");
  }
});

// Student modal close
elements.closeStudentBtn.addEventListener("click", () => {
  elements.studentModal.close();
});

initPortal();
