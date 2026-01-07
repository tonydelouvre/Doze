let reminderTimeout = null;

// ===============================
// REQUEST PERMISSION
// ===============================
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Browser tidak mendukung notifikasi");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    Notification.requestPermission();
  }

  return Notification.permission === "granted";
}

// ===============================
// SCHEDULE REMINDER (30 MENIT SEBELUM)
// ===============================
function scheduleSleepReminder(targetTime) {
  if (!requestNotificationPermission()) return;

  const now = new Date();
  const [h, m] = targetTime.split(":").map(Number);

  const target = new Date();
  target.setHours(h, m, 0, 0);

  // kalau jam tidur sudah lewat → besok
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  // ⏰ 30 menit sebelum tidur
  target.setMinutes(target.getMinutes() - 30);

  const delay = target - now;

  // safety check
  if (delay <= 0) return;

  clearTimeout(reminderTimeout);

  reminderTimeout = setTimeout(() => {
    new Notification("Doze 😴", {
      body: "30 menit lagi waktu tidur. Mulai tenang ya 🌙",
      icon: "/assets/icon-192.png",
      silent: false
    });
  }, delay);
}

// ===============================
// DAILY REMINDER LOOP
// ===============================
function scheduleDailyReminder(targetTime) {
  // schedule hari ini
  scheduleSleepReminder(targetTime);

  // hitung delay sampai BESOK jam yang sama
  const now = new Date();
  const [h, m] = targetTime.split(":").map(Number);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(h, m, 0, 0);
  tomorrow.setMinutes(tomorrow.getMinutes() - 30);

  const delayToTomorrow = tomorrow - now;

  if (delayToTomorrow <= 0) return;

  setTimeout(() => {
    // loop: schedule ulang untuk besok
    scheduleDailyReminder(targetTime);
  }, delayToTomorrow);
}
