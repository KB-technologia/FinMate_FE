<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  currentData: Object,
  pastData: Object,
});

const chartCanvasRef = ref(null);
let chartInstance = null;
const showExplanation = ref(false);

const explanations = ref([]);
const totalDiff = ref(0);

const labels = ['현금', '예금', '적금', '채권', '펀드', '주식', '기타'];
const keys = ['cash', 'deposit', 'savings', 'bond', 'fund', 'stock', 'other'];

onMounted(() => {
  if (props.currentData && props.pastData) {
    renderBarChart();
    calResult();
  }
});

watch(
  () => props.pastData,
  () => {
    if (props.currentData && props.pastData) {
      renderBarChart();
      calResult();
    }
  },
  { immediate: true }
);

function renderBarChart() {
  if (!chartCanvasRef.value) return;

  const currentValues = keys.map((k) => props.currentData[k]);
  const pastValues = keys.map((k) => props.pastData[k]);

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
      plugins: { datalabels: { display: false } },
    },
  });
}

function calResult() {
  explanations.value = keys.map((key, idx) => {
    const curr = props.currentData[key] ?? 0;
    const past = props.pastData[key] ?? 0;
    const diff = curr - past;

    return {
      label: labels[idx],
      current: curr,
      past,
      diff,
    };
  });

  totalDiff.value = explanations.value.reduce(
    (sum, item) => sum + item.diff,
    0
  );
}

function statusClass(diff) {
  if (diff > 0) return 'increase';
  if (diff < 0) return 'decrease';
  else return 'nochange';
}
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartCanvasRef" class="bar-chart"></canvas>
    <div class="button-container">
      <button @click="showExplanation = !showExplanation" class="info-button">
        {{ showExplanation ? '닫기' : '자세히 보기' }}
      </button>
    </div>
  </div>

  <div v-if="showExplanation" class="explanation-section">
    <div class="info-card" :class="statusClass(totalDiff)">
      <div v-if="totalDiff !== 0">
        총 자산이 {{ Math.abs(totalDiff).toLocaleString('ko-KR') }}원
      </div>
      <span v-if="totalDiff > 0">증가했어요</span>
      <span v-else-if="totalDiff < 0">감소했어요</span>
      <span v-else>오잉? 자산 변동이 없었어요</span>
    </div>

    <div class="explanation-list">
      <div
        v-for="(item, idx) in explanations"
        :key="idx"
        class="explanation-card"
        :class="statusClass(item.diff)"
      >
        <div class="explanation-content">
          <div class="asset-name">{{ item.label }}</div>
          <div class="asset-values">
            현재: {{ item.current.toLocaleString('ko-KR') }}원 <br />
            과거: {{ item.past.toLocaleString('ko-KR') }}원
          </div>
          <div class="asset-diff">
            <span v-if="item.diff !== 0">
              {{ Math.abs(item.diff).toLocaleString('ko-KR') }}원
            </span>
            <span v-if="item.diff > 0">증가</span>
            <span v-else-if="item.diff < 0">감소</span>
            <span v-else>과거와 같아요</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  align-items: center;
}
.bar-chart {
  width: 100%;
}
.button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
.info-button {
  border: none;
  border-radius: 15px;
  padding: 1rem 2rem;
  background-color: var(--color-info-button);
  color: var(--color-white);
  font-weight: bold;
}

.info-button:hover {
  opacity: 0.8;
}

.explanation-section {
  margin-top: 3rem;
}

.info-card {
  padding: 2rem 2rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}

.explanation-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.explanation-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(20% - 2rem);
  padding: 1.5rem;
  margin: 2.5rem;
  border-radius: 10px;
  text-align: center;
  font-size: 1rem;
}
.asset-name {
  font-weight: bold;
  font-size: 1.2rem;
}
.asset-values {
  font-size: 0.85rem;
  color: #464545;
}
.asset-diff {
  font-weight: bold;
  margin-top: 0.5rem;
}
.increase {
  border-left: 10px solid var(--infocard-increase);
  background-color: var(--infocard-increase-bg);
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}
.decrease {
  border-left: 10px solid var(--infocard-decrease);
  background-color: var(--infocard-decrease-bg);
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}
.nochange {
  border-left: 10px solid var(--infocard-nochange);
  background-color: var(--infocard-nochange-bg);
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}
</style>
