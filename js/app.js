const sleepInput = document.getElementById("sleepTime");
const wakeInput = document.getElementById("wakeTime");
const button = document.getElementById("checkBtn");
const result = document.getElementById("result");
const reminderToggle = document.getElementById("reminderToggle");
const privacyToggle = document.getElementById("privacyModeToggle");
const resetBtn = document.getElementById("resetDataBtn");

function renderChart() {
  const history = loadSleepHistory();
  drawChart(history);
}

function renderWeeklyStats() {
  const stats = getWeeklyStats();
  const statsEl = document.getElementById("weeklyStats");

  if (!stats) {
    statsEl.innerHTML = "";
    return;
  }

    const bestText = stats.bestDay
    ? `${stats.bestDay.day} (${stats.bestDay.score})`
    : "-";

    const worstText = stats.worstDay
    ? `${stats.worstDay.day} (${stats.worstDay.score})`
    : "-";

    statsEl.innerHTML = `
    <strong>Statistik Mingguan</strong><br>
    Rata-rata tidur: ${stats.avgHours} jam<br>
    Rata-rata score: ${stats.avgScore}/100<br>
    Hari terbaik: ${bestText}<br>
    Hari terburuk: ${worstText}
    `;

}

// initial render
renderChart();
renderWeeklyStats();

button.addEventListener("click", () => {
  const sleepTime = sleepInput.value;
  const wakeTime = wakeInput.value;

  if (!sleepTime || !wakeTime) {
    result.innerHTML = "⛔ Masukkan waktu tidur dan bangun";
    return;
  }

    const duration = calculateSleepDuration(sleepTime, wakeTime);
    const status = getSleepStatus(duration.totalMinutes);
    const score = calculateSleepScore(duration.totalMinutes);

    result.innerHTML = `
    <strong>Durasi Tidur</strong><br>
    ${duration.hours} jam ${duration.minutes} menit<br>
    <strong>Status:</strong> ${status}<br>
    <strong>Sleep Score:</strong> ${score}/100
    `;


  const privacyEnabled =
    localStorage.getItem("doze_privacy_mode") === "true";

    if (!privacyEnabled) {
    saveSleepData({
        date: new Date().toISOString(),
        day: new Date().toLocaleDateString("id-ID", { weekday: "short" }),
        hours: duration.totalMinutes / 60,
        score: score
    });
    }

  renderChart();
  renderWeeklyStats();

    localStorage.setItem("doze_sleep_time", sleepTime);
    localStorage.setItem("doze_reminder_active", reminderToggle.checked);

    // DAILY REMINDER (AUTO)
    if (reminderToggle.checked) {
        scheduleDailyReminder(sleepTime);
    }


    // REMINDER 30 MENIT SEBELUM TIDUR
    if (reminderToggle.checked) {
        scheduleSleepReminder(sleepInput.value);
    }

});

// ===============================
// OFFLINE / ONLINE INDICATOR
// ===============================
const offlineBanner = document.getElementById("offlineBanner");

function updateOnlineStatus() {
  if (navigator.onLine) {
    offlineBanner.style.display = "none";
  } else {
    offlineBanner.style.display = "block";
  }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// cek status saat app load
updateOnlineStatus();

// ===============================
// AUTO RESUME DAILY REMINDER
// ===============================
const savedSleepTime = localStorage.getItem("doze_sleep_time");
const savedReminder = localStorage.getItem("doze_reminder_active");

if (savedReminder === "true" && savedSleepTime) {
  scheduleDailyReminder(savedSleepTime);
}

// ===============================
// EXPORT CSV
// ===============================
const exportBtn = document.getElementById("exportCsvBtn");

if (exportBtn) {
  exportBtn.addEventListener("click", exportToCSV);
}

function exportToCSV() {
  const history = loadSleepHistory();

  if (!history || history.length === 0) {
    alert("Belum ada data untuk diexport");
    return;
  }

  const headers = [
    "Tanggal",
    "Hari",
    "Jam Tidur (jam)",
    "Sleep Score"
  ];

  const rows = history.map(item => [
    item.date,
    item.day,
    item.hours,
    typeof item.score === "number" ? item.score : "N/A"
]);


  let csvContent = "";
  csvContent += headers.join(",") + "\n";

  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "doze_sleep_data.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
}

// ===============================
// PRIVACY MODE
// ===============================
if (privacyToggle) {
  // load status
  const savedPrivacy = localStorage.getItem("doze_privacy_mode");
  privacyToggle.checked = savedPrivacy === "true";

  privacyToggle.addEventListener("change", () => {
    localStorage.setItem(
      "doze_privacy_mode",
      privacyToggle.checked
    );
  });
}

// ===============================
// RESET ALL DATA
// ===============================
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const ok = confirm(
      "Semua data tidur akan dihapus. Lanjutkan?"
    );

    if (!ok) return;

    localStorage.removeItem("doze_sleep_history");

    // refresh UI
    renderChart();
    renderWeeklyStats();

    alert("Data berhasil dihapus");
  });
}

// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("SW failed", err));
}

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}