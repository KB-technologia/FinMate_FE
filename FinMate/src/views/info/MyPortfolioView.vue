<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import Sidebar from '@/components/info/Sidebar.vue';
import RightPanel from '@/components/info/RightPanel.vue';

const showModal = ref(false); //반응형 Modal 구현 (디폴트 값 : false)
const portfolio = ref(null); // 사용자 포트폴리오 데이터 저장
const chartInstance = ref(null); //차트 인스턴스 저장, 렌더링 시 초기화 (포트폴리오 작성하면 바로 반영)
const chartCanvasRef = ref(null); // 차트가 그려질 canvas 요소에 대한 DOM 참조

function renderChart() {
  const ctx = chartCanvasRef.value?.getContext('2d');
  chartInstance.value?.destroy(); //포트폴리오 변경 시마다 차트를 초기화

  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      datasets: [
        {
          data: [
            portfolio.value.cashRatio,
            portfolio.value.bondRatio,
            portfolio.value.equityRatio,
            portfolio.value.otherRatio,
          ],
          backgroundColor: ['#3CC3DF', '#FFAE4C', '#8979FF', '#FF928A'],
          hoverOffset: 4,
        },
      ],
    },
  });
}

onMounted(() => {
  axios.get(`/api/member/portfolio?userId=1`).then((res) => {
    //TODO : 임시 테스트 ID값
    const data = res.data;
    if (data == null) {
      console.log('유저의 데이터가 없습니다');
    } else {
      portfolio.value = data;
    }
  });
});

watch(
  portfolio,
  async (val) => {
    if (val) {
      await nextTick();
      renderChart();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  chartInstance.value?.destroy();
});
</script>

<template>
  <TopNavigationBar />
  <div class="myportfolio-container">
    <Sidebar />
    <RightPanel class="right-panel">
      <div v-if="portfolio" class="right-panel-container">
        <h2 class="portfolio-title">
          {{ portfolio.userName || '홍길동' }} 님의 재무 포트폴리오
        </h2>
        <div class="chart-info-row">
          <div class="chart-wrapper">
            <canvas ref="chartCanvasRef"></canvas>
          </div>
          <div class="info-boxes">
            <div class="info-box">
              <span class="label">총 자산</span>
              <div>{{ portfolio.totalAssets.toLocaleString() }} 원</div>
            </div>
            <div class="info-box">
              <span class="label">연 소득</span>
              <div>{{ portfolio.annualIncome.toLocaleString() }} 원</div>
            </div>
            <div class="legend">
              <div><span class="legend-color cash"></span> 현금/예금</div>
              <div><span class="legend-color bond"></span> 채권</div>
              <div><span class="legend-color equity"></span> 주식/펀드</div>
              <div><span class="legend-color other"></span> 기타</div>
            </div>
          </div>
        </div>
      </div>
      <!--portfolio 데이터가 없을 시 보여지는 화면-->
      <div v-else class="right-panel-container empty-portfolio">
        <h2 class="portfolio-title">홍길동님의 재무 포트폴리오</h2>
        <p class="empty-msg">먼저 포트폴리오를 작성해주세요!</p>
        <button class="create-btn" @click="showModal = true">
          포트폴리오 작성하기
        </button>
        <!-- TODO: Modal 컴포넌트 연결 후 showModal 사용 -->
      </div>
    </RightPanel>
  </div>
</template>

<style scoped>
.myportfolio-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  align-items: flex-start;
}
.right-panel {
  background-color: #ffeab4;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.right-panel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.portfolio-title {
  font-size: 2.1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
}

.chart-info-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 7rem;
}

.chart-wrapper {
  width: 500px;
  height: 500px;
}

canvas {
  width: 100%;
  height: auto;
}

.info-boxes {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  text-align: center;
}

.info-box {
  background-color: #fffbe6;
  border: 2px solid #333;
  border-radius: 20px;
  padding: 1.5rem;
  width: 230px;
}

.legend {
  background-color: #fffbe6;
  border: 2px solid black;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
  padding: 1.5rem;
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

.empty-portfolio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
.empty-msg {
  font-size: 1.1rem;
  margin: 1.5rem 0 1rem 0;
  text-align: center;
}
.create-btn {
  background: #636362;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
}
.create-btn:hover {
  background: #ffb95e;
}
</style>
