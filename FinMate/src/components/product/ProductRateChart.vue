<template>
  <div class="chart-card" id="chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <span class="legend-pill">{{ unitLabel }}</span>
    </div>
    <div class="chart-container">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed, toRaw } from 'vue';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);
const zeroLine = {
  id: 'zeroLine',
  afterDraw(chart, _args, opts) {
    if (opts === false) return; // 옵션이 false면 비활성화
    const y = chart.scales.y?.getPixelForValue(0);
    const x = chart.scales.x;
    if (!x || y == null) return;
    if (y < chart.scales.y.top || y > chart.scales.y.bottom) return;

    const ctx = chart.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x.left, y);
    ctx.lineTo(x.right, y);
    ctx.lineWidth = opts?.width ?? 1;
    ctx.setLineDash(opts?.dash ?? [4, 4]);
    ctx.strokeStyle = opts?.color ?? 'rgba(100,116,139,0.6)'; // slate-500
    ctx.stroke();
    ctx.restore();
  },
};
Chart.register(zeroLine);

const props = defineProps({
  productRate: { type: Object, required: true }, // {returnRate1m,3m,6m,12m,24m,36m,60m}
  title: { type: String, default: '수익률 추이' }, // 예금/적금이면 '이율 추이'
  showZeroLine: { type: Boolean, default: false },
});

const unitLabel = '단위: %';
const canvasRef = ref(null);
let chart; // 반드시 재생성 전 destroy

const months = [1, 3, 6, 12, 24, 36, 60];
const labels = months.map((m) => (m < 12 ? `${m}개월` : `${m / 12}년`));

const toNumOrNull = (v) => {
  if (v == null || v === '') return null; // undefined/null/'' → null
  const n = Number(v);
  return Number.isFinite(n) ? n : null; // NaN 등 → null
};

const values = computed(() => {
  const rate = toRaw(props.productRate) ?? {}; // 굳이 안 써도 되지만 안전하게 raw로 읽기
  return months.map((m) => toNumOrNull(rate[`returnRate${m}m`]));
});

const hasNum = (v) => Number.isFinite(v);

const filtered = computed(() => {
  const vals = values.value; // 기존 values (null 정규화된 배열)
  const arr = labels.map((lab, i) => ({ lab, val: vals[i] }));
  const kept = arr.filter((x) => hasNum(x.val));
  return {
    labels: kept.map((x) => x.lab),
    values: kept.map((x) => x.val),
  };
});

const dataLabels = computed(() => filtered.value.labels);
const dataValues = computed(() => filtered.value.values);
const hasData = computed(() => dataValues.value.length > 0);

function yBounds(arr, includeZero = false) {
  const nums = arr.filter((v) => Number.isFinite(v));
  if (!nums.length)
    return includeZero ? { min: -1, max: 1 } : { min: 0, max: 1 };
  const min = Math.min(...nums),
    max = Math.max(...nums);
  const pad = Math.max((max - min) * 0.15, 0.2);
  let lo = Math.floor(min - pad);
  let hi = Math.ceil(max + pad);
  if (includeZero) {
    lo = Math.min(lo, 0);
    hi = Math.max(hi, 0);
  }
  return { min: lo, max: hi };
}
const bgFill = (ctx) => {
  const { ctx: c, chartArea } = ctx.chart;
  if (!chartArea) return 'rgba(16,185,129,0.12)';
  const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, 'rgba(16,185,129,.35)');
  g.addColorStop(1, 'rgba(16,185,129,.05)');
  return g;
};

function render() {
  const ctx = canvasRef.value.getContext('2d');
  const { min, max } = yBounds(dataValues.value, props.showZeroLine); // ← includeZero

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dataLabels.value,
      datasets: [
        {
          data: dataValues.value,
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.25,
          fill: true,
          borderColor: 'rgba(16,185,129,1)',
          backgroundColor: bgFill,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      events: hasData.value ? undefined : [],
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${c.parsed.y?.toFixed(2)}%` } },
        zeroLine: props.showZeroLine
          ? { color: 'rgba(100,116,139,0.6)', width: 1, dash: [4, 4] }
          : false, // ← 여기
      },
      scales: {
        x: { grid: { display: false } },
        y: { min, max, ticks: { callback: (v) => `${v}%` } },
      },
    },
  });
  requestAnimationFrame(() => chart?.update());
}

function update() {
  if (!chart) return render();
  chart.data.labels = dataLabels.value;
  chart.data.datasets[0].data = dataValues.value;

  const { min, max } = yBounds(dataValues.value, props.showZeroLine); // ← includeZero
  chart.options.scales.y.min = min;
  chart.options.scales.y.max = max;

  // 플러그인 on/off 갱신
  chart.options.plugins.zeroLine = props.showZeroLine
    ? { color: 'rgba(100,116,139,0.6)', width: 1, dash: [4, 4] }
    : false;

  chart.update();
}

onMounted(render);
onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
watch(dataValues, update);
</script>

<style scoped>
.chart-card {
  width: 62.5rem;
  max-width: 62.5rem;
  margin: 1rem auto;
  padding: 2.5rem;
  border-radius: var(--card-radius);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  background-color: var(--color-white);
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.chart-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}
.legend-pill {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  font-size: 0.8rem;
  color: #374151;
}
.chart-container {
  height: 260px;
}
</style>
