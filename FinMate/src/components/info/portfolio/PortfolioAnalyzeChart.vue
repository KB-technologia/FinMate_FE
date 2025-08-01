<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  currentData: Object,
  pastData: Object,
});

const chartCanvasRef = ref(null);
let chartInstance = null;

const labels = ['현금', '예금', '적금', '채권', '펀드', '주식', '기타'];

onMounted(() => {
  if (props.currentData && props.pastData) {
    renderBarChart();
  }
});

watch(
  () => props.pastData,
  () => {
    if (props.currentData && props.pastData) {
      renderBarChart();
    }
  },
  { immediate: true }
);

function renderBarChart() {
  if (!chartCanvasRef.value) return;

  const current = props.currentData;
  const past = props.pastData;

  const currentValues = [
    current.cash,
    current.deposit,
    current.savings,
    current.bond,
    current.fund,
    current.stock,
    current.other,
  ];
  const pastValues = [
    past.cash,
    past.deposit,
    past.savings,
    past.bond,
    past.fund,
    past.stock,
    past.other,
  ];

  chartInstance?.destroy();
  chartInstance = new Chart(chartCanvasRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '현재',
          data: currentValues,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: '과거',
          data: pastValues,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          display: false,
        },
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartCanvasRef" class="bar-chart"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.bar-chart {
  width: 100%;
  height: 400px;
}
</style>
