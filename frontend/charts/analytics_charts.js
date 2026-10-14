/**
 * Responsive Canvas Analytics & Progress Charts
 * Author: Jane Rose | Asst. Professor | CSE
 */

export class AnalyticsCharts {
  static drawProgressRing(canvasId, percentage, label = "Syllabus Completed") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 160;
    const height = canvas.height = 160;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 60;
    const lineWidth = 12;

    ctx.clearRect(0, 0, width, height);

    // Track circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * (percentage / 100));
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    
    // Gradient stroke
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#38bdf8");
    grad.addColorStop(1, "#10b981");
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Text in center
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY - 6);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("Mastered", centerX, centerY + 16);
  }

  static drawTrendChart(canvasId, data = [68, 72, 75, 82, 85, 91]) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 320;
    const height = canvas.height = 150;
    const padding = 24;

    ctx.clearRect(0, 0, width, height);

    const labels = ["2019", "2020", "2021", "2022", "2023", "2024"];
    const maxVal = 100;
    const stepX = (width - padding * 2) / (data.length - 1);

    // Draw grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height - padding * 2) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw Line
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((val / maxVal) * (height - padding * 2));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Area fill below line
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, 0, 0, height);
    areaGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
    areaGrad.addColorStop(1, "rgba(56, 189, 248, 0.0)");
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Points & Labels
    data.forEach((val, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((val / maxVal) * (height - padding * 2));

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[i], x, height - 6);
    });
  }

  static drawUnitBarChart(canvasId, units = [
    { name: "Discrete Math", score: 85 },
    { name: "Architecture", score: 72 },
    { name: "DBMS & SQL", score: 92 },
    { name: "OS & Systems", score: 68 },
    { name: "Theory of Comp", score: 80 },
    { name: "AI & ML", score: 95 }
  ]) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 320;
    const height = canvas.height = 180;
    const barHeight = 16;
    const gap = 12;

    ctx.clearRect(0, 0, width, height);

    units.forEach((u, i) => {
      const y = 14 + i * (barHeight + gap);
      const maxBarWidth = width - 130;
      const curWidth = (u.score / 100) * maxBarWidth;

      // Label
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(u.name, 10, y + 12);

      // Background bar
      ctx.fillStyle = "rgba(148, 163, 184, 0.15)";
      ctx.beginPath();
      ctx.roundRect(110, y, maxBarWidth, barHeight, 4);
      ctx.fill();

      // Progress bar
      const grad = ctx.createLinearGradient(110, y, 110 + curWidth, y);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(1, u.score >= 80 ? "#10b981" : (u.score >= 70 ? "#facc15" : "#f43f5e"));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(110, y, curWidth, barHeight, 4);
      ctx.fill();

      // Percentage text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px JetBrains Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${u.score}%`, width - 10, y + 12);
    });
  }
}
