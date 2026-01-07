const STORAGE_KEY = "doze_sleep_history";

function saveSleepData(data) {
  const history = loadSleepHistory();
  history.push(data);

  // simpan max 7 data terakhir
  if (history.length > 7) {
    history.shift();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadSleepHistory() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function getWeeklyStats() {
  const history = loadSleepHistory();
  if (history.length === 0) return null;

  let totalHours = 0;
  let totalScore = 0;
  let scoreCount = 0;

  let bestDay = null;
  let worstDay = null;

  history.forEach(item => {
    totalHours += item.hours;

    // hanya proses item yang punya score
    if (typeof item.score === "number") {
      totalScore += item.score;
      scoreCount++;

      if (!bestDay || item.score > bestDay.score) {
        bestDay = item;
      }

      if (!worstDay || item.score < worstDay.score) {
        worstDay = item;
      }
    }
  });

  return {
    avgHours: (totalHours / history.length).toFixed(1),
    avgScore: scoreCount ? Math.round(totalScore / scoreCount) : "-",
    bestDay,
    worstDay
  };
}

