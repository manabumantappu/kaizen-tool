document.addEventListener("DOMContentLoaded", () => {

  const data = JSON.parse(localStorage.getItem("kaizenList")) || [];

  const tbody = document.querySelector("#kaizenTable tbody");
  const filterMonth = document.getElementById("filterMonth");
  const filterYear  = document.getElementById("filterYear");

  const totalKaizenEl = document.getElementById("totalKaizen");
  const totalTimeEl   = document.getElementById("totalTime");
  const totalCostEl   = document.getElementById("totalCost");

  let timeChart = null;
  let costChart = null;

  // ===== INIT YEAR FILTER =====
  const years = [...new Set(data.map(k => new Date(k.date).getFullYear()))];

  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    filterYear.appendChild(opt);
  });

  // ===== RENDER FUNCTION =====
  function render() {

    const m = filterMonth.value;
    const y = filterYear.value;

    const filtered = data
      .map((k, idx) => ({ ...k, _idx: idx }))
      .filter(k => {
        if (!k.date) return false;
        const d = new Date(k.date);
        return (m === "all" || d.getMonth() + 1 == m) &&
               (y === "all" || d.getFullYear() == y);
      });

    tbody.innerHTML = "";

    let totalTime = 0;
    let totalCost = 0;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9">Tidak ada data</td></tr>`;
    }

    filtered.forEach((k, i) => {

      const timeSaved = (k.timeBefore || 0) - (k.timeAfter || 0);
      const costSaved = (k.costBefore || 0) - (k.costAfter || 0);

      totalTime += timeSaved;
      totalCost += costSaved;

      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${formatDate(k.date)}</td>
          <td>${k.section || "-"}</td>
          <td>${k.title || "-"}</td>
          <td>${k.timeBefore || 0} → ${k.timeAfter || 0}</td>
          <td>${timeSaved}</td>
          <td>Rp ${fmt(k.costBefore)} → Rp ${fmt(k.costAfter)}</td>
          <td>Rp ${fmt(costSaved)}</td>
          <td>
            <button onclick="showPhoto(${k._idx})">📷</button>
            <button onclick="hapus(${k._idx})">🗑️</button>
          </td>
        </tr>
      `;
    });

    totalKaizenEl.innerText = filtered.length;
    totalTimeEl.innerText   = totalTime;
    totalCostEl.innerText   = fmt(totalCost);

    drawChart(totalTime, totalCost);
  }

  // ===== CHART =====
  function drawChart(totalTime, totalCost) {

    if (timeChart) timeChart.destroy();
    if (costChart) costChart.destroy();

    timeChart = new Chart(document.getElementById("timeChart"), {
      type: "bar",
      data: {
        labels: ["Total Hemat Waktu"],
        datasets: [{
          data: [totalTime],
          backgroundColor: "#27ae60"
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    costChart = new Chart(document.getElementById("costChart"), {
      type: "bar",
      data: {
        labels: ["Total Hemat Cost"],
        datasets: [{
          data: [totalCost],
          backgroundColor: "#27ae60"
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // ===== ACTION =====
  window.showPhoto = i => {
    const item = data[i];
    document.getElementById("modalBefore").src = item.photoBefore || "";
    document.getElementById("modalAfter").src  = item.photoAfter  || "";
    document.getElementById("photoModal").style.display = "flex";
  };

  window.closeModal = () => {
    document.getElementById("photoModal").style.display = "none";
  };

  window.hapus = i => {
    if (confirm("Hapus Kaizen?")) {
      data.splice(i, 1);
      localStorage.setItem("kaizenList", JSON.stringify(data));
      render();
    }
  };

  // ===== UTIL =====
  function fmt(n) {
    return (Number(n) || 0).toLocaleString("id-ID");
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString("id-ID");
  }

  filterMonth.onchange = render;
  filterYear.onchange  = render;

  render();
});

window.exportKaizenJSON = function () {
  const data = localStorage.getItem("kaizenList") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "kaizen-backup.json";
  a.click();
};
