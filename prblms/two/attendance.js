// Set these routes and fields to match the attendance API contract.
const API_BASE_URL = "";
const CLASSES_PATH = "/classes";
const ATTENDANCE_PATH = (classId, date) =>
  `/classes/${encodeURIComponent(classId)}/attendance?date=${encodeURIComponent(date)}`;

const elements = {
  classSelect: document.querySelector("#class-select"),
  dateInput: document.querySelector("#attendance-date"),
  searchInput: document.querySelector("#student-search"),
  rows: document.querySelector("#attendance-rows"),
  statusMessage: document.querySelector("#status-message"),
  statusText: document.querySelector("#status-text"),
  recordCount: document.querySelector("#record-count"),
  dateLabel: document.querySelector("#date-label"),
  updatedLabel: document.querySelector("#updated-label"),
  counts: {
    total: document.querySelector("#total-count"),
    present: document.querySelector("#present-count"),
    absent: document.querySelector("#absent-count"),
    late: document.querySelector("#late-count"),
  },
};

let attendanceRecords = [];

function setStatus(message, state = "") {
  elements.statusText.textContent = message;
  elements.statusMessage.dataset.state = state;
}

function setSummary(records) {
  const counts = records.reduce((result, record) => {
    result[record.status] = (result[record.status] || 0) + 1;
    return result;
  }, {});

  elements.counts.total.textContent = records.length;
  elements.counts.present.textContent = counts.present || 0;
  elements.counts.absent.textContent = counts.absent || 0;
  elements.counts.late.textContent = counts.late || 0;
}

function normalizeStatus(status) {
  const normalized = String(status || "unmarked")
    .trim()
    .toLowerCase();
  if (["present", "absent", "late"].includes(normalized)) return normalized;
  return "unmarked";
}

function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text || "--";
  return cell;
}

function renderRows() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const filteredRecords = attendanceRecords.filter((record) =>
    `${record.studentName} ${record.studentId}`.toLowerCase().includes(query),
  );

  elements.rows.replaceChildren();
  elements.recordCount.textContent = `${filteredRecords.length} student${filteredRecords.length === 1 ? "" : "s"}`;

  if (filteredRecords.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = createCell(
      query
        ? "No students match your search."
        : "No attendance records for this class and date.",
    );
    cell.colSpan = 4;
    row.append(cell);
    elements.rows.append(row);
    return;
  }

  filteredRecords.forEach((record) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const name = document.createElement("span");
    const avatar = document.createElement("span");
    const statusCell = document.createElement("td");
    const status = document.createElement("span");

    name.className = "student-name";
    avatar.className = "student-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = record.studentName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase();
    name.append(avatar, document.createTextNode(record.studentName));
    nameCell.append(name);

    status.className = `status-pill status-${record.status}`;
    status.textContent = record.status;
    statusCell.append(status);

    row.append(
      nameCell,
      createCell(record.studentId),
      statusCell,
      createCell(record.checkIn),
    );
    elements.rows.append(row);
  });
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

function getArray(data, key) {
  const value = Array.isArray(data) ? data : data?.[key];
  if (!Array.isArray(value)) {
    throw new Error(`Expected an array of ${key}.`);
  }
  return value;
}

async function loadAttendance() {
  const classId = elements.classSelect.value;
  const date = elements.dateInput.value;
  if (!classId || !date) return;

  setStatus("Loading attendance records...", "loading");
  elements.classSelect.disabled = true;

  try {
    const response = await fetchJson(ATTENDANCE_PATH(classId, date));
    attendanceRecords = getArray(response, "attendance").map((record) => ({
      studentName: String(
        record.studentName ?? record.name ?? "Unknown student",
      ),
      studentId: String(record.studentId ?? record.id ?? "--"),
      status: normalizeStatus(record.status),
      checkIn: String(record.checkIn ?? record.checkInTime ?? "--"),
    }));

    setSummary(attendanceRecords);
    renderRows();
    setStatus("Attendance records are up to date.");
    elements.updatedLabel.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  } catch (error) {
    attendanceRecords = [];
    setSummary(attendanceRecords);
    renderRows();
    setStatus(
      `${error.message}. Check the API URL and response format.`,
      "error",
    );
    elements.updatedLabel.textContent = "Could not load data";
  } finally {
    elements.classSelect.disabled = false;
  }
}

async function loadClasses() {
  if (!API_BASE_URL) {
    elements.classSelect.innerHTML =
      '<option value="">API URL not configured</option>';
    setStatus(
      "Set API_BASE_URL in attendance.js to connect your API.",
      "error",
    );
    return;
  }

  setStatus("Loading classes...", "loading");

  try {
    const response = await fetchJson(CLASSES_PATH);
    const classes = getArray(response, "classes");
    elements.classSelect.replaceChildren();

    classes.forEach((classItem) => {
      const option = document.createElement("option");
      option.value = String(classItem.id ?? classItem.classId ?? "");
      option.textContent = String(
        classItem.name ?? classItem.className ?? "Unnamed class",
      );
      elements.classSelect.append(option);
    });

    elements.classSelect.disabled = classes.length === 0;
    if (classes.length === 0) {
      setStatus("No classes were returned by the API.", "error");
      return;
    }

    setStatus("Choose a class to view its attendance.");
    await loadAttendance();
  } catch (error) {
    elements.classSelect.innerHTML =
      '<option value="">Could not load classes</option>';
    elements.classSelect.disabled = true;
    setStatus(
      `${error.message}. Check the API URL and response format.`,
      "error",
    );
  }
}

function updateDateLabel() {
  const selectedDate = new Date(`${elements.dateInput.value}T12:00:00`);
  elements.dateLabel.textContent = selectedDate
    .toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

elements.dateInput.value = new Date().toLocaleDateString("en-CA");
updateDateLabel();
elements.classSelect.addEventListener("change", loadAttendance);
elements.dateInput.addEventListener("change", () => {
  updateDateLabel();
  loadAttendance();
});
elements.searchInput.addEventListener("input", renderRows);

loadClasses();
