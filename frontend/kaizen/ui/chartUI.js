import { KaizenState } from "../state/kaizenState.js";

export function renderCharts(timeBefore, timeAfter, costBefore, costAfter) {
  if (KaizenState.timeChart) KaizenState.timeChart.destroy();
  if (KaizenState.costChart) KaizenState.costChart.destroy();

  KaizenState.timeChart = new Chart(timeChartEl, {
    type: "bar",
    data: {
      labels: ["Before", "After"],
      datasets: [{
        data: [timeBefore, timeAfter],
        backgroundColor: ["#e74c3c", "#27ae60"]
      }]
    }
  });

  KaizenState.costChart = new Chart(costChartEl, {
    type: "bar",
    data: {
      labels: ["Before", "After"],
      datasets: [{
        data: [costBefore, costAfter],
        backgroundColor: ["#2980b9", "#27ae60"]
      }]
    }
  });
}
