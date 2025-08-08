<script setup>
import { onMounted, ref, nextTick, watch } from 'vue';
import PortfolioModal from './PortfolioModal.vue';
import { Chart } from 'chart.js/auto';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartColumnStacked, SquarePen, Info } from 'lucide-vue-next';
import PortfolioCompareModal from './PortfolioCompareModal.vue';
import ToastContainer from '@/components/allshared/ToastContainer.vue';

ChartJS.register(ArcElement, Tooltip, ChartDataLabels);

const props = defineProps({ portfolio: Object });
const emit = defineEmits(['requestRefresh']);

const showCompareModal = ref(false);
const showModifyModal = ref(false);

const chartInstance = ref(null);
const chartCanvasRef = ref(null);
const toastRef = ref();

onMounted(() => {
  toastRef.value?.addToast('마이데이터가 정상적으로 로딩되었어요!', 'success');
});

function handleSave() {
  emit('requestRefresh');
  showModifyModal.value = false;
}

function renderChart() {
  const ctx = chartCanvasRef.value?.getContext('2d');
  chartInstance.value?.destroy();

  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['현금', '예금', '적금', '채권', '펀드', '주식', '기타'],
      datasets: [
        {
          data: [
            props.portfolio.cash,
            props.portfolio.deposit,
            props.portfolio.savings,
            props.portfolio.bond,
            props.portfolio.fund,
            props.portfolio.stock,
            props.portfolio.other,
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
          hoverOffset: 7,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: 'var(--color-black)',
          font: { weight: 'bold', size: 16 },
          formatter: (value, ctx) => {
            const data = ctx.chart.data.datasets[0].data;
            const total = data.reduce((acc, val) => acc + val, 0);
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
}

watch(
  () => props.portfolio,
  async () => {
    await nextTick();
    renderChart();
  },
  { immediate: true }
);
</script>

<template>
  <ToastContainer ref="toastRef" />
  <div class="right-panel-container">
    <h2 class="portfolio-title">My Portfolio</h2>
    <div class="chart-info-row">
      <div class="chart-wrapper">
        <canvas ref="chartCanvasRef"></canvas>
        <p class="chart-info">
          <Info size="3%" /> 5%미만의 자산은 표시되지 않습니다.
        </p>
        <p class="chart-info">
          <Info size="3%" /> 현금, 기타자산은 사용자의 입력을 통해 계산됩니다.
        </p>
      </div>
      <div class="info-boxes">
        <div class="portfolio-buttons">
          <button class="compare-btn" @click="showCompareModal = true">
            <ChartColumnStacked size="25" /> 과거 포트폴리오 비교하기
          </button>
          <button class="modify-btn" @click="showModifyModal = true">
            <SquarePen size="25" /> 포트폴리오 수정하기
          </button>
        </div>
        <div class="asset-group">
          <div class="totalassets-box">
            <div class="total-assets-card">
              <div class="info-totalassets">총 자산</div>
            </div>
            <div class="totalassets-label">
              {{ props.portfolio.totalAssets.toLocaleString() }} 원
            </div>
          </div>
          <div class="asset-cards-row">
            <div class="asset-card">
              <div class="asset-card-header">
                <div class="asset-title">현금 및 기타</div>
              </div>
              <div class="asset-row">
                <span class="asset-label"
                  >현금 : {{ props.portfolio.cash.toLocaleString() }} 원</span
                >
              </div>
              <div class="asset-row">
                <span class="asset-label"
                  >기타 : {{ props.portfolio.other.toLocaleString() }} 원</span
                >
              </div>
            </div>
            <div class="asset-card">
              <div class="asset-card-header">
                <div class="asset-title">안전자산</div>
              </div>
              <div class="asset-row">
                <span class="asset-label"
                  >예금 :
                  {{ props.portfolio.deposit.toLocaleString() }} 원</span
                >
              </div>
              <div class="asset-row">
                <span class="asset-label"
                  >적금 :
                  {{ props.portfolio.savings.toLocaleString() }} 원</span
                >
              </div>
              <div class="asset-row">
                <span class="asset-label"
                  >채권 : {{ props.portfolio.bond.toLocaleString() }} 원</span
                >
              </div>
            </div>
            <div class="asset-card">
              <div class="asset-card-header">
                <div class="asset-title">위험자산</div>
              </div>
              <div class="asset-row">
                <span class="asset-label"
                  >펀드 : {{ props.portfolio.fund.toLocaleString() }} 원</span
                >
              </div>
              <div class="asset-row">
                <span class="asset-label"
                  >주식 : {{ props.portfolio.stock.toLocaleString() }} 원</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PortfolioModal
    v-if="showModifyModal"
    :mode="'edit'"
    :initialData="props.portfolio"
    @close="showModifyModal = false"
    @save="handleSave"
  />
  <PortfolioCompareModal
    v-if="showCompareModal"
    :initialData="props.portfolio"
    @close="showCompareModal = false"
  />
</template>
<style scoped>
.right-panel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.portfolio-title {
  font-size: 3rem;
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin-bottom: 1rem;
}

.chart-info-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 65vh;
}

canvas {
  width: 100%;
  height: auto;
}

.chart-wrapper {
  width: 40%;
}

.chart-info {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: var(--color-chart-info);
}

.info-boxes {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  width: 60%;
}

.portfolio-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 65%;
  align-items: flex-end;
}

.asset-cards-row {
  display: flex;
  flex-direction: row;
  gap: 1.3rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.asset-group {
  border: none;
  background-color: var(--color-right-panel);
  border-radius: 30px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}

.asset-row {
  margin-bottom: 0.6rem;
  padding: 0.4rem;
}

.asset-title {
  padding-top: 1rem;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  font-weight: var(--font-weight-bold);
  border-radius: 12px 12px 0 0;
  background-color: var(--color-primary-yellow);
}

.asset-card {
  background-color: var(--color-white);
  border-radius: 12px;
  text-align: center;
  width: 12.5rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-bold);
  padding-bottom: 0.4rem;
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}

.info-totalassets {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: var(--color-totalassets);
  border-radius: 8px 8px 0px 0px;
  color: var(--color-white);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
}

.total-assets-card {
  width: 100%;
  text-align: center;
}

.totalassets-label {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: var(--font-weight-bold);
}

.totalassets-box {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: 10px;
  align-items: center;
  width: 20vw;
  margin-top: 0.5rem;
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}

.modify-btn,
.compare-btn {
  border: none;
  background-color: var(--color-primary-bluegray);
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  color: var(--color-white);
  font-size: 1.2rem;
  padding: 1rem;
  width: 60%;
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}

.modify-btn:hover,
.compare-btn:hover {
  opacity: 0.8;
}
</style>
