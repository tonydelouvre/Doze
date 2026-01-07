function calculateSleepDuration(sleepTime, wakeTime) {
  let start = timeToMinutes(sleepTime);
  let end = timeToMinutes(wakeTime);

  if (end <= start) {
    end += 1440; // lewat tengah malam
  }

  const totalMinutes = end - start;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes, totalMinutes };
}

function getSleepStatus(totalMinutes) {
  const hours = totalMinutes / 60;

  if (hours < 6) return "Kurang Tidur 😴";
  if (hours <= 8) return "Tidur Ideal 😌";
  return "Kebanyakan Tidur 💤";
}

// ===============================
// SLEEP SCORE (0 - 100)
// ===============================
function calculateSleepScore(totalMinutes) {
  const idealMinutes = 8 * 60;
  const diff = Math.abs(totalMinutes - idealMinutes);

  // setiap 30 menit beda = -5 poin
  const penalty = Math.floor(diff / 30) * 5;

  let score = 100 - penalty;

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return score;
}
