<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PortfolioPastChart from '@/components/info/portfolio/PortfolioPastChart.vue';
import Datepicker from '@/components/info/portfolio/ChooseDate.vue';
import PortfolioAnalyzChart from '@/components/info/portfolio/PortfolioAnalyzChart.vue';
import CloseButton from '@/components/allshared/CloseButton.vue';

Chart.register(ChartDataLabels);

const pastPortfolioData = ref(null);
const selectedDate = ref(null);
const chartCanvasRefNow = ref(null);
const chartInstanceNow = null;

const emit = defineEmits(['close']);
const props = defineProps({ initialData: Object });

onMounted(() => {
  if (props.initialData) {
    renderCurrentChart(props.initialData);
  }
});

function handlePastData(data) {
  pastPortfolioData.value = data;
}
function onCancel() {
  emit('close');
}

function renderCurrentChart(data) {
  nextTick(() => {
    if (!chartCanvasRefNow.value) return;
    chartInstanceNow?.destroy();

    chartInstanceNow = new Chart(chartCanvasRefNow.value, {
      type: 'doughnut',
      data: {
        labels: ['현금', '예금', '적금', '채권', '펀드', '주식', '기타'],
        datasets: [
          {
            data: [
              data.cash,
              data.deposit,
              data.savings,
              data.bond,
              data.fund,
              data.stock,
              data.other,
            ],
            backgroundColor: [
              '#9ECAD6',
              '#748DAE',
              '#F5CBCB',
              '#FFEAEA',
              '#A3DC9A',
              '#DEE791',
              '#DCD0A8',
            ],
          },
        ],
      },
      options: {
        cutout: '20%',
        plugins: {
          datalabels: {
            color: 'var(--color-black)',
            font: { weight: 'bold', size: 15 },
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce(
                (acc, val) => acc + val,
                0
              );
              const percent = ((value / total) * 100).toFixed(1);
              if (percent < 5) return '';
              const label = ctx.chart.data.labels[ctx.dataIndex];
              return `${label}\n${percent}%`;
            },
          },
          legend: { display: false },
        },
      },
    });
  });
}
</script>
<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-bar">
            <h2 class="modal-title">과거.. 나의 자산 현황은?</h2>
            <CloseButton @click="onCancel" />
          </div>
          <Datepicker
            v-model="selectedDate"
            placeholder="포트폴리오 조회"
            class="date-picker"
          />
        </div>
        <div class="compare-chart-area">
          <div class="chart-box">
            <h3>현재 재무 포트폴리오</h3>
            <canvas ref="chartCanvasRefNow" class="now-chart"></canvas>
          </div>
          <div class="chart-box">
            <h3>과거 재무 포트폴리오</h3>
            <PortfolioPastChart
              :selectedDate="selectedDate"
              @pastLoaded="handlePastData"
              class="now-chart"
            />
          </div>
        </div>
        <div v-if="pastPortfolioData !== null" class="analyze-area">
          <h1 class="analyze-title">포트폴리오 비교 분석</h1>
          <portfolio-analyz-chart
            :currentData="props.initialData"
            :pastData="pastPortfolioData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: var(--color-white);
  border-radius: 40px;
  width: 90vw;
  height: 90vh;
  overflow: hidden;
}
.modal-content {
  height: 100%;
  overflow-y: auto;
  padding: 2.5rem 2rem 4rem 2.5rem;
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  flex: 1;
  margin-left: 2.5rem;
}

.date-picker {
  margin-top: 1rem;
}

.datepicker-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.compare-chart-area {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.chart-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
  width: 100%;
  max-width: 550px;
  margin-left: 5rem;
  margin-right: 5rem;
}

.now-chart {
  width: 50%;
}

.analyze-area {
  margin-top: 5rem;
  padding: 2rem;
  border: 2px solid black;
  border-radius: 10px;
}

.analyze-title {
  margin-top: 2rem;
  margin-bottom: 4rem;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  width: 100%;
}
</style>
