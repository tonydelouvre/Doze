const canvas = document.getElementById("sleepChart");
const ctx = canvas.getContext("2d");

function getBarColor(hours) {
  if (hours < 6) return "#ef4444";      // merah
  if (hours <= 8) return "#22c55e";     // hijau
  return "#3b82f6";                     // biru
}

function drawChart(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (data.length === 0) return;

  const padding = 30;
  const chartHeight = canvas.height - padding * 2;
  const chartWidth = canvas.width - padding * 2;
  const maxHours = 10;

  // axis
  ctx.strokeStyle = "#334155";
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // garis target 8 jam
  const targetY =
    canvas.height - padding - (8 / maxHours) * chartHeight;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#94a3b8";
  ctx.beginPath();
  ctx.moveTo(padding, targetY);
  ctx.lineTo(canvas.width - padding, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText("Target 8 jam", padding + 4, targetY - 4);

  const barGap = 10;
  const barWidth =
    (chartWidth - barGap * (data.length - 1)) / data.length;

  data.forEach((item, index) => {
    const hours = Number(item.hours.toFixed(1));
    const barHeight = (hours / maxHours) * chartHeight;

    const x = padding + index * (barWidth + barGap);
    const y = canvas.height - padding - barHeight;

    // bar
    ctx.fillStyle = getBarColor(hours);
    ctx.fillRect(x, y, barWidth, barHeight);

    // label jam
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "10px sans-serif";
    ctx.fillText(`${hours}j`, x + 4, y - 4);

    // label hari
    ctx.fillStyle = "#94a3b8";
    const dayLabel = item.day || "-";
    ctx.fillText(dayLabel, x + 2, canvas.height - 10);
  });
}