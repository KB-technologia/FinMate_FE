<template>
  <div v-if="isLoggedIn" class="show-stats-container-notlogin">
    <!-- STAT SECTION -->
    <div class="stats">
      <div v-if="isLoadingStats" class="spinner-wrapper">
        <div class="loader"></div>
      </div>
      <div v-if="!isLoadingStats && isstats" class="stat-bar-wrapper">
        <div class="stat-row">
          <span class="stat-label"
            ><div class="tooltip-wrapper">
              <span class="icon"><Swords /></span>
              <span class="tooltip-text">모험 성향 점수</span>
            </div></span
          >
          <div class="stat-bar-outer">
            <div
              class="stat-bar-fill"
              :style="{
                width: (statData.adventureScore / 3) * 100 + '%',
                backgroundColor: '#4CAF50',
              }"
            ></div>
          </div>
          <span class="stat-value"
            >{{ statData.adventureScore.toFixed(1) }} / 3.0</span
          >
        </div>

        <div class="stat-row">
          <span class="stat-label">
            <div class="tooltip-wrapper">
              <span class="icon"><Coins /></span>
              <span class="tooltip-text">재정 체력</span>
            </div></span
          >
          <div class="stat-bar-outer">
            <div
              class="stat-bar-fill"
              :style="{
                width: (statData.financeScore / 3) * 100 + '%',
                backgroundColor: '#2196F3',
              }"
            ></div>
          </div>
          <span class="stat-value"
            >{{ statData.financeScore.toFixed(1) }} / 3.0</span
          >
        </div>

        <div class="char-stat">
          <div>
            <div class="tooltip-wrapper">
              <span class="icon"><Gauge /></span>
              <span class="tooltip-text">속도</span>
            </div>
            {{ getSpeedLabel(statData.speedTag) }}
          </div>
          <div>
            <div class="tooltip-wrapper">
              <span class="icon"><Brain /></span>
              <span class="tooltip-text">운/전략</span>
            </div>
            {{ getLuckStrategy(statData.strategyTag) }}
          </div>
          <div>
            <div class="tooltip-wrapper">
              <span class="icon"><Sparkle /></span>
              <span class="tooltip-text">가치관</span>
            </div>
            {{ getValue(statData.valueTag) }}
          </div>
        </div>

        <button class="detail-button" @click="goToStatsPage">
          자세히 보기
        </button>
      </div>
      <div v-if="!isLoadingStats && !isstats" class="no-stats">
        <div>
          <img
            class="animal-image-logo"
            src="@/assets/images/animals/penguin.png"
          />
        </div>
        <div class="no-login-content">
          <p class="nologin-text">
            추천 아이템을 받으려면 <br />투자 성향 테스트를 진행해주세요!
          </p>
          <button class="detail-button" @click="goToTest">
            테스트 시작하기
          </button>
        </div>
      </div>
    </div>

    <!-- PORTFOLIO SECTION -->
    <div
      class="portfolio"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div v-if="isLoadingPortfolio" class="spinner-wrapper">
        <div class="loader"></div>
      </div>
      <div
        v-else-if="isPortfolio"
        class="no-login-content portfolio-animated"
        :class="{ revealed: portfolioRevealed }"
      >
        <p class="nologin-text2">
          <UserRoundCheck class="UserRoundCheck" /><span class="highlight-text"
            >나의 자산 현황</span
          >
          : {{ portfolioData.totalAssets.toLocaleString() }}원
        </p>
        <div class="portfolio-info">
          <div class="portfolio-chart">
            <canvas ref="chartCanvasRef"></canvas>
          </div>
          <div class="portfolio-grid">
            <div class="portfolio-col">
              <p>주식: {{ portfolioData.stock.toLocaleString() }}원</p>
              <p>
                예적금:
                {{
                  (
                    portfolioData.deposit + portfolioData.savings
                  ).toLocaleString()
                }}원
              </p>
              <p>현금: {{ portfolioData.cash.toLocaleString() }}원</p>
            </div>

            <div class="portfolio-col">
              <p>채권: {{ portfolioData.bond.toLocaleString() }}원</p>
              <p>펀드: {{ portfolioData.fund.toLocaleString() }}원</p>
              <p>기타: {{ portfolioData.other.toLocaleString() }}원</p>
            </div>
          </div>
        </div>
        <button class="detail-button" @click="goToPortfolio">
          자세히 보기
        </button>
      </div>
      <div v-else class="no-portfolio">
        <div>
          <img
            class="animal-image-logo"
            src="@/assets/images/animals/capybara.png"
          />
        </div>
        <div class="no-login-content">
          <p class="nologin-text">
            더 정확한 추천을 위해 <br />포트폴리오를 생성해주세요!
          </p>
          <button class="detail-button" @click="goToPortfolio">
            포트폴리오 생성하기
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="show-stats-container">
    <div class="description">
      당신의 투자 성향은 어떤 동물일까요? 지금 회원가입을 통해 확인해보세요!
    </div>
    <div class="image-wrapper">
      <img
        v-for="(img, index) in currentImages"
        :key="index"
        :src="img"
        class="animal-image"
        :class="{ 'fade-in': animate }"
        alt="animal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useAuthStore } from '@/stores/auth/auth';
import { useRouter } from 'vue-router';
import { getPortfolio, getMemberStat } from '@/api/main/main.js';
import {
  Swords,
  Coins,
  Gauge,
  Brain,
  Sparkle,
  UserRoundCheck,
} from 'lucide-vue-next';
import { Chart } from 'chart.js/auto';

const chartCanvasRef = ref(null);
const chartInstance = ref(null);

const router = useRouter();
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const isstats = ref(false);
const isPortfolio = ref(false);
const isLoadingStats = ref(true);
const isLoadingPortfolio = ref(true);
const portfolioData = ref(null);
const statData = ref(null);
const portfolioRevealed = ref(false);
let hoverTimer = null;

const goToStatsPage = () => router.push('/my-stats');
const goToPortfolio = () => router.push('/my-portfolio');
const goToTest = () => router.push('/quizstart');

const handleMouseEnter = () => {
  hoverTimer = setTimeout(() => (portfolioRevealed.value = true), 0);
};
const handleMouseLeave = () => {
  clearTimeout(hoverTimer);
  portfolioRevealed.value = false;
};
const images = [
  new URL('@/assets/images/animals/cat.png', import.meta.url).href,
  new URL('@/assets/images/animals/capybara.png', import.meta.url).href,
  new URL('@/assets/images/animals/desertfox.png', import.meta.url).href,
  new URL('@/assets/images/animals/flyingsquirrel.png', import.meta.url).href,
  new URL('@/assets/images/animals/kiwibird.png', import.meta.url).href,
  new URL('@/assets/images/animals/koala.png', import.meta.url).href,
  new URL('@/assets/images/animals/panda.png', import.meta.url).href,
  new URL('@/assets/images/animals/penguin.png', import.meta.url).href,
  new URL('@/assets/images/animals/redpanda.png', import.meta.url).href,
  new URL('@/assets/images/animals/seaotter.png', import.meta.url).href,
];
const currentImages = ref([]);
const animate = ref(true);

function getRandomImages() {
  const shuffled = images.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
}
const getSpeedLabel = (speed) =>
  ({ FAST: '빠름', MEDIUM: '중간', SLOW: '느림', VERY_SLOW: '매우 느림' }[
    speed
  ] || speed);
const getLuckStrategy = (strategy) =>
  ({ LUCK: '운', STRATEGY: '전략' }[strategy] || strategy);
const getValue = (value) =>
  ({
    SURVIVAL: '생존형',
    STABILITY: '안정형',
    GROWTH: '성장형',
    HIGH_RETURN: '고수익형',
  }[value] || value);

onMounted(async () => {
  currentImages.value = getRandomImages();
  setInterval(() => {
    animate.value = false;
    setTimeout(() => {
      currentImages.value = getRandomImages();
      animate.value = true;
    }, 400);
  }, 2500);
  if (isLoggedIn.value) {
    try {
      const portfolio = await getPortfolio();
      isPortfolio.value = !!portfolio && Object.keys(portfolio).length > 0;
      portfolioData.value = portfolio.data;
      console.log(`포트폴리오 로그 : ${portfolio.data}`);
      if (isPortfolio.value) {
        await nextTick();
        renderPortfolioChart();
      }
    } catch (e) {
      if (e.status === 404) isPortfolio.value = false;
    } finally {
      isLoadingPortfolio.value = false;
    }
    try {
      const stat = await getMemberStat();
      isstats.value = !!stat && Object.keys(stat).length > 0;
      statData.value = stat.data;
      console.log(`스탯 로그 : ${stat.status.toLocaleString()}`);
    } catch (e) {
      if (e.status === 404) isstats.value = false;
    } finally {
      isLoadingStats.value = false;
    }
  }
});

watch(isPortfolio, async (v) => {
  if (v) {
    await nextTick();
    requestAnimationFrame(() => {
      renderPortfolioChart();
    });
  }
});

function renderPortfolioChart() {
  const canvas = chartCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }

  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['현금', '예금', '적금', '채권', '펀드', '주식', '기타'],
      datasets: [
        {
          data: [
            portfolioData.value.cash,
            portfolioData.value.deposit,
            portfolioData.value.savings,
            portfolioData.value.bond,
            portfolioData.value.fund,
            portfolioData.value.stock,
            portfolioData.value.other,
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
        legend: { display: false },
      },
    },
  });
}
</script>

<style scoped>
.show-stats-container {
  width: 70vw;
  height: 35vh;
  border: 0.2vh solid var(--color-light-gray);
  background-color: var(--color-light-yellow);
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
  border-radius: 2vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1vh;
  overflow: hidden;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-extrabold);
}

.stat-row {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-left: 1vw;
}

.stat-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1vw;
  font-size: 1rem;
  text-align: right;
  margin-right: 1vw;
}

.stat-bar-outer {
  flex: 1;
  height: 2.5vh;
  background-color: var(--color-white);
  border-radius: 2vh;
  overflow: hidden;
}

.stat-bar-fill {
  width: 50%;
  height: 100%;
  border-radius: 2vh;
  transition: width 0.5s ease;
}
.stat-value {
  width: 4vw;
  font-size: 0.9rem;
  text-align: left;
  margin-left: 0.5vw;
}

.stat-bar-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
}

.char-stat {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 2vh;
  padding-bottom: 2vh;
  gap: 1rem;
}

.detail-button {
  width: 15vw;
  height: 4vh;
  background-color: var(--color-white);
  border: 0.2vh solid var(--color-light-gray);
  border-radius: 2vh;
  font-weight: var(--font-weight-extrabold);
  cursor: pointer;
  transition: all 0.1s ease;
  margin: 0 auto;
}

.detail-button:hover {
  background-color: var(--color-main-button);
  border: none;
  color: var(--color-white);
  box-shadow: 0 0.2vh 0.2vw rgba(0, 0, 0, 0.3);
  transform: translateY(-0.5vh);
}

/* 비로그인시 */

.description {
  font-size: 2rem;
  text-align: center;
  padding: 1rem;
}

.image-wrapper {
  display: flex;
  gap: 2vw;
}

.animal-image {
  height: 12vh;
  width: auto;
  opacity: 0.4;
  transform: scale(0.9);
  transition: all 0.4s ease;
}

.animal-image.fade-in {
  opacity: 1;
  transform: scale(1);
}

/* 로그인시 */
.show-stats-container-notlogin {
  width: 70vw;
  height: 35vh;
  border: 0.2vh solid var(--color-light-gray);
  background-color: var(--color-light-yellow);
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
  border-radius: 2vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2vh;
  overflow: hidden;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-extrabold);
}
.stats {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 0.2vh solid var(--color-light-gray);
}

.no-stats {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.portfolio {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.no-portfolio {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.no-login-content {
  width: 100%;
  text-align: center;
}

.nologin-text {
  width: 15vw;
  height: 12vh;
  font-size: 1.2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
  position: relative;
  background: var(--color-main-button);
  border-radius: 2vh;
  padding: 1vh;
  font-weight: var(--font-weight-medium);
}
.nologin-text:after {
  content: '';
  position: absolute;
  left: 0;
  width: 0;
  height: 0;
  border: 1em solid transparent;
  border-right-color: var(--color-main-button);
  border-left: 0;
  border-bottom: 0;
  margin-top: -0.5em;
  margin-left: -0.8em;
}

.animal-image-logo {
  width: 12vw;
  transform: scaleX(-1);
}

.portfolio-grid {
  margin-left: auto;
  margin-right: 2rem;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 2rem;
  align-items: start;
  text-align: left;
  font-size: 1rem;
}

.portfolio-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.portfolio-chart {
  max-width: 210px;
  margin-left: 3rem;
}

.portfolio-animated {
  opacity: 0.4;
  filter: blur(4px);
  transition: all 0.8s ease;
  pointer-events: none;
  width: 100%;
}

.nologin-text2 {
  display: flex;
  justify-content: center;
  font-size: 1.2rem;
}

.highlight-text {
  background: linear-gradient(transparent 55%, rgba(255, 255, 0, 0.6) 55%);
}

.UserRoundCheck {
  margin-right: 0.5rem;
}

.portfolio-info {
  display: flex;
  align-items: center;
}

.portfolio-animated.revealed {
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}

.icon {
  padding: 1vh;
}

.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.loader {
  border: 0.8vh solid var(--color-white);
  border-top: 0.8vh solid var(--color-main-button);
  border-radius: 50%;
  width: 10vh;
  height: 10vh;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip-text {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 0.5vh;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* 위에 표시 */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip-wrapper:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
