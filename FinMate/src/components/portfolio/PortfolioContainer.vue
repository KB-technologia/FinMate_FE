<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Chart } from "chart.js/auto";
import PortfolioModal from "@/components/portfolio/PortfolioModal.vue";
import { getPortfolio } from "@/api/portfolio/portfolio.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const showWriteModal = ref(false);
const showModifyModal = ref(false);
const portfolio = ref(null);
const chartInstance = ref(null);
const chartCanvasRef = ref(null);

function renderChart() {
  const ctx = chartCanvasRef.value?.getContext("2d");
  chartInstance.value?.destroy();
  chartInstance.value = null;

  chartInstance.value = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["현금/예금", "채권", "주식/펀드", "기타"],
      datasets: [
        {
          data: [
            portfolio.value.cashRatio,
            portfolio.value.bondRatio,
            portfolio.value.equityRatio,
            portfolio.value.otherRatio,
          ],
          backgroundColor: ["#3CC3DF", "#FFAE4C", "#8979FF", "#FF928A"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: "var(--color-black)",
          font: {
            weight: "bold",
            size: 16,
          },
          formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            return `${label}\n${value.toFixed(1)}%`;
          },
        },
        legend: {
          display: false,
        },
      },
    },
  });
}

async function handleSave(updatedData) {
  try {
    portfolio.value = { ...updatedData };
    await nextTick();
    renderChart();
  } catch (e) {
    console.error("재조회 실패:", e);
  }
  showWriteModal.value = false;
  showModifyModal.value = false;
}

onMounted(async () => {
  const res = await getPortfolio(1); //TODO userID 테스트 용도
  const data = res.data;
  if (data == null) {
    console.log("유저의 데이터가 없습니다");
  } else {
    portfolio.value = data;
    await nextTick();
    renderChart(); //
  }
});
</script>
<template>
  <div v-if="portfolio" class="right-panel-container">
    <h2 class="portfolio-title">
      {{ portfolio.userName || "홍길동" }}님의 재무 포트폴리오
    </h2>
    <div class="chart-info-row">
      <div class="chart-wrapper">
        <canvas ref="chartCanvasRef"></canvas>
        <div class="legend">
          <div><span class="legend-color cash"></span> 현금/예금</div>
          <div><span class="legend-color bond"></span> 채권</div>
          <div><span class="legend-color equity"></span> 주식/펀드</div>
          <div><span class="legend-color other"></span> 기타</div>
        </div>
      </div>

      <div class="info-boxes">
        <div class="info-box">
          <div class="info-title">
            <span>
              <img
                src="@/assets/images/products/totalassets.png"
                alt="총 자산 이미지"
                class="info-image"
              />
            </span>
            <span class="label">총 자산</span>
          </div>
          <div class="label explanation">
            {{ portfolio.totalAssets.toLocaleString() }} 원
          </div>
        </div>
        <div class="info-box">
          <div class="info-title">
            <span
              ><img
                src="@/assets/images/products/annualincome.png"
                alt="연 소득 이미지"
                class="info-image"
            /></span>
            <span class="label">연 소득</span>
            <button class="edit-btn" @click="showModifyModal = true">
              <img
                src="@/assets/images/icons/editpencil.png"
                alt="수정 아이콘"
                class="edit-icon"
              />
            </button>
          </div>
          <div class="label explanation">
            {{ portfolio.annualIncome.toLocaleString() }} 원
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--portfolio 데이터가 없을 시 보여지는 화면-->
  <div v-else class="right-panel-container">
    <h2 class="portfolio-title">
      {{ portfolio?.userName || "홍길동" }}님의 재무 포트폴리오
    </h2>
    <div class="portfolio-img-container">
      <div class="blurred-chart-wrapper">
        <img
          src="@/assets/images/products/blurrychart.png"
          alt="흐린 차트"
          class="blurred-chart"
        />
        <img
          src="@/assets/images/icons/lock.png"
          alt="자물쇠"
          class="lock-icon"
        />
      </div>
      <div class="kiwi-box">
        <img
          src="@/assets/images/logos/infokiwi.png"
          alt="키위새"
          class="kiwi"
        />
        <img
          src="@/assets/images/products/portfolioinfo.png"
          alt="말풍선"
          class="speech-bubble"
        />
      </div>
    </div>
    <button class="create-btn" @click="showWriteModal = true">
      포트폴리오 작성하기
    </button>
  </div>
  <PortfolioModal
    v-if="showWriteModal"
    :mode="'write'"
    @close="showWriteModal = false"
    @save="handleSave"
  />
  <PortfolioModal
    v-if="showModifyModal"
    :mode="'edit'"
    :initialData="portfolio"
    @close="showModifyModal = false"
    @save="handleSave"
  />
</template>
<style scoped>
.right-panel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  height: 100%;
  overflow: hidden;
}

.portfolio-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.chart-info-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 65vw;
}

.chart-wrapper {
  position: relative;
  width: 29vw;
  height: 28vw;
}

canvas {
  width: 100%;
  height: auto;
}

.legend {
  position: absolute;
  bottom: 1rem;
  right: -9rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  align-items: flex-start;
}

.legend-color {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
}

.legend-color.cash {
  background: #3cc3df;
}
.legend-color.bond {
  background: #ffae4c;
}
.legend-color.equity {
  background: #8979ff;
}
.legend-color.other {
  background: #ff928a;
}

.info-boxes {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-box {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--color-black);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  width: 20vw;
  margin-top: 2rem;
}

.info-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 1rem;
}

.info-image {
  width: 80px;
  justify-content: flex-start;
}

.label {
  font-size: 2rem;
}

.label.explanation {
  font-size: 1.5rem;
  text-align: center;
}

.edit-btn {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 0.4rem;
}

.edit-btn:hover {
  background: #ffb95e;
}

.portfolio-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.blurred-chart-wrapper {
  position: relative;
  width: 40vw;
  max-width: 500px;
  max-height: 500px;
  right: 10%;
}

.blurred-chart {
  width: 120%;
  height: 120%;
}

.lock-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-30%, -40%);
  width: 30%;
}

.kiwi-box {
  position: relative;
  width: 30vw;
  max-width: 500px;
  height: 300px;
}

.kiwi {
  position: absolute;
  top: 0%;
  left: 10%;
  width: 100%;
  max-width: 450px;
}

.speech-bubble {
  position: absolute;
  bottom: 60%;
  left: 70%;
  width: 60%;
  max-width: 350px;
}

.create-btn {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(30%);
  background: var(--color-primary-bluegray);
  color: var(--color-white);
  border: none;
  border-radius: 20px;
  padding: 1.5rem 2.8rem;
  font-size: 1.2rem;
  cursor: pointer;
}
.create-btn:hover {
  background: #ffb95e;
}
</style>
