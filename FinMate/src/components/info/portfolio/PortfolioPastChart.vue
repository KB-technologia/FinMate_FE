<script setup>
import { ref, watch, nextTick } from "vue";
import { useToast } from "@/composables/useToast";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getHistoryPortfolio } from "@/api/portfolio/portfolio";
import { format } from "date-fns";

Chart.register(ChartDataLabels);

const props = defineProps({
  selectedDate: Date,
});

const { toast } = useToast();

const emit = defineEmits(["pastLoaded"]);

const portfolio = ref(null);
const chartCanvasRef = ref(null);
let chartInstance = null;

watch(
  () => props.selectedDate,
  async (date) => {
    const formatted = format(date, "yyyy-MM-dd");
    try {
      const res = await getHistoryPortfolio(formatted);
      portfolio.value = res.data;
      emit("pastLoaded", res.data);
      await nextTick();
      renderChart();
    } catch (err) {
      portfolio.value = null;
      chartInstance?.destroy();
      emit("pastLoaded", null);

      if (err.response?.status === 404) {
        toast("해당 날짜의 포트폴리오가 없습니다.", "warning");
      } else {
        toast(
          "요청 중 오류가 발생했습니다.\n 잠시 후 다시 시도해주세요.",
          "warning"
        );
      }
    }
  }
);

function renderChart() {
  nextTick(() => {
    if (!chartCanvasRef.value || !portfolio.value) return;
    chartInstance?.destroy();
    chartInstance = new Chart(chartCanvasRef.value, {
      type: "doughnut",
      data: {
        labels: ["현금", "예금", "적금", "채권", "펀드", "주식", "기타"],
        datasets: [
          {
            data: [
              portfolio.value.cash,
              portfolio.value.deposit,
              portfolio.value.savings,
              portfolio.value.bond,
              portfolio.value.fund,
              portfolio.value.stock,
              portfolio.value.other,
            ],
            backgroundColor: [
              "#9ECAD6",
              "#748DAE",
              "#F5CBCB",
              "#FFEAEA",
              "#A3DC9A",
              "#DEE791",
              "#DCD0A8",
            ],
          },
        ],
      },
      options: {
        cutout: "20%",
        plugins: {
          datalabels: {
            color: "var(--color-black)",
            font: { weight: "bold", size: 15 },
            formatter: (value, ctx) => {
              const data = ctx.chart.data.datasets[0].data;
              const total = data.reduce((acc, val) => acc + val, 0);
              const percent = ((value / total) * 100).toFixed(1);
              if (percent < 5) return "";

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
  <canvas ref="chartCanvasRef" class="now-chart"></canvas>
</template>
<style scoped></style>
