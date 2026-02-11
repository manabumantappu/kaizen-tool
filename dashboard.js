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

  const targetTime = 20;        // 🎯 target menit
  const targetCost = 300000;    // 🎯 target rupiah

  if (timeChart) timeChart.destroy();
  if (costChart) costChart.destroy();

  const timeColor = totalTime >= targetTime ? "#27ae60" : "#e74c3c";
  const costColor = totalCost >= targetCost ? "#27ae60" : "#e74c3c";

  // ===== TIME CHART =====
  timeChart = new Chart(document.getElementById("timeChart"), {
    type: "bar",
    data: {
      labels: ["Total Hemat Waktu"],
      datasets: [
        {
          label: "Hemat Waktu (Menit)",
          data: [totalTime],
          backgroundColor: timeColor
        },
        {
          type: "line",
          label: "Target",
          data: [targetTime],
          borderColor: "#e74c3c",
          borderWidth: 2,
          borderDash: [6,6],
          pointRadius: 0
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Total Saving Waktu"
        },
        legend: {
          display: true
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          font: { weight: 'bold' },
          color: '#000'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    },
    plugins: [ChartDataLabels]
  });

  // ===== COST CHART =====
  costChart = new Chart(document.getElementById("costChart"), {
    type: "bar",
    data: {
      labels: ["Total Hemat Cost"],
      datasets: [
        {
          label: "Hemat Cost (Rp)",
          data: [totalCost],
          backgroundColor: costColor
        },
        {
          type: "line",
          label: "Target",
          data: [targetCost],
          borderColor: "#e74c3c",
          borderWidth: 2,
          borderDash: [6,6],
          pointRadius: 0
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Total Saving Cost"
        },
        legend: {
          display: true
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          font: { weight: 'bold' },
          formatter: value => "Rp " + value.toLocaleString("id-ID"),
          color: '#000'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    },
    plugins: [ChartDataLabels]
  });
}


  costChart = new Chart(document.getElementById("costChart"), {
    type: "bar",
    data: {
      labels: ["Total Hemat Cost"],
      datasets: [
        {
          label: "Hemat Cost (Rp)",
          data: [totalCost],
          backgroundColor: "#27ae60"
        },
        {
          type: "line",
          label: "Target",
          data: [targetCost],
          borderColor: "#e74c3c",
          borderWidth: 2,
          borderDash: [6,6],
          pointRadius: 0
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Total Saving Cost"
        },
        legend: {
          display: true
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
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

window.importKaizenJSON = function(event) {

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (!Array.isArray(importedData)) {
        alert("Format JSON tidak valid!");
        return;
      }

      localStorage.setItem("kaizenList", JSON.stringify(importedData));

      alert("Data berhasil di-restore!");
      location.reload();

    } catch (err) {
      alert("Gagal membaca file JSON.");
    }
  };

  reader.readAsText(file);
};
