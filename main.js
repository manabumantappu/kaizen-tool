document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENT =====
  const timeBefore = document.getElementById("timeBefore");
  const timeAfter = document.getElementById("timeAfter");
  const timeSaved = document.getElementById("timeSaved");
  const timePercent = document.getElementById("timePercent");

  const costBefore = document.getElementById("costBefore");
  const costAfter = document.getElementById("costAfter");
  const costSaved = document.getElementById("costSaved");
  const costYear = document.getElementById("costYear");

  const photoBefore = document.getElementById("photoBefore");
  const photoAfter = document.getElementById("photoAfter");
  const previewBefore = document.getElementById("previewBefore");
  const previewAfter = document.getElementById("previewAfter");

  // ===== FOTO PREVIEW =====
  function previewImage(input, preview) {
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  previewImage(photoBefore, previewBefore);
  previewImage(photoAfter, previewAfter);

  // ===== KALKULASI =====
  function calculate() {
    const tb = parseFloat(timeBefore.value) || 0;
    const ta = parseFloat(timeAfter.value) || 0;
    const cb = parseFloat(costBefore.value) || 0;
    const ca = parseFloat(costAfter.value) || 0;

    const tSaved = tb - ta;
    const tPercent = tb > 0 ? ((tSaved / tb) * 100).toFixed(1) : 0;

    const cSaved = cb - ca;
    const cYear = cSaved * 12;

    timeSaved.textContent = tSaved;
    timePercent.textContent = tPercent;
    costSaved.textContent = cSaved.toLocaleString();
    costYear.textContent = cYear.toLocaleString();

    updateChart(tb, ta, cb, ca);
  }

  timeBefore.addEventListener("input", calculate);
  timeAfter.addEventListener("input", calculate);
  costBefore.addEventListener("input", calculate);
  costAfter.addEventListener("input", calculate);

  // ===== CHART =====
  const timeChartCtx = document.getElementById("timeChart");
  const costChartCtx = document.getElementById("costChart");

  let timeChart = new Chart(timeChartCtx, {
  type: "bar",
  data: {
    labels: ["Before", "After"],
    datasets: [{
      label: "Time (minutes)",
      data: [0, 0],
      backgroundColor: [
        "#e74c3c",  // Before - merah
        "#27ae60"   // After - hijau
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }
});

  let costChart = new Chart(costChartCtx, {
  type: "bar",
  data: {
    labels: ["Before", "After"],
    datasets: [{
      label: "Cost (Rp)",
      data: [0, 0],
      backgroundColor: [
        "#e74c3c",  // Before - merah
        "#27ae60"   // After - hijau
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }
});


  function updateChart(tb, ta, cb, ca) {
    timeChart.data.datasets[0].data = [tb, ta];
    costChart.data.datasets[0].data = [cb, ca];
    timeChart.update();
    costChart.update();
  }

});

// ===== GLOBAL BUTTON FUNCTIONS =====
window.generatePDF = function() {
  alert("PDF feature ready (integrate jsPDF logic here)");
};

window.generatePPT = function() {
  alert("PPT feature ready (integrate PptxGenJS logic here)");
};

window.saveKaizen = function() {
  alert("Data saved (connect to localStorage if needed)");
};
