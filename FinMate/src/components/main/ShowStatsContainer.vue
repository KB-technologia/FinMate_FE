<template>
  <div v-if="isLoggedIn" class="show-stats-container-notlogin">
    <div v-if="isstats" class="stats">
      <div v-if="statData" class="stat-bar-wrapper">
        <div class="stat-row">
          <span class="stat-label"
            ><span class="icon"><Swords /></span>모험 성향 점수</span
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
            <span class="icon"><Coins /></span>재정 점수</span
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
          <p>
            <span class="icon"><Gauge /></span>속도 {{ statData.speedTag }}
          </p>
          <p>|</p>
          <p>
            <span class="icon"><Brain /></span>운/전략
            {{ statData.strategyTag }}
          </p>
          <p>|</p>
          <p>
            <span class="icon"><Sparkle /></span>가치관 {{ statData.valueTag }}
          </p>
        </div>

        <button class="detail-button" @click="goToStatsPage">
          자세히 보기
        </button>
      </div>
    </div>
    <div v-if="!isstats" class="no-stats">
      <div>
        <img
          class="animal-image-logo"
          src="@/assets/images/animals/penguin.png"
        />
      </div>
      <div class="no-login-content">
        <p class="nologin-text">
          추천 아이템을 받으려면 <br />
          투자 성향 테스트를 진행해주세요!
        </p>
        <button class="detail-button" @click="goToTest">테스트 시작하기</button>
      </div>
    </div>
    <div
      v-if="isPortfolio"
      class="portfolio"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div
        class="no-login-content portfolio-animated"
        :class="{ revealed: portfolioRevealed }"
      >
        <p class="nologin-text2">📊 나의 자산 현황</p>
        <div class="portfolio-grid">
          <p>💰 총 자산: {{ portfolioData.totalAssets.toLocaleString() }}원</p>
          <p>📈 주식: {{ portfolioData.stock.toLocaleString() }}원</p>
          <p>📉 채권: {{ portfolioData.bond.toLocaleString() }}원</p>
          <p>🏦 예금: {{ portfolioData.deposit.toLocaleString() }}원</p>
          <p>💼 펀드: {{ portfolioData.fund.toLocaleString() }}원</p>
          <p>💳 현금: {{ portfolioData.cash.toLocaleString() }}원</p>
          <p>📦 기타: {{ portfolioData.other.toLocaleString() }}원</p>
          <p>📊 성향: {{ portfolioData.investmentProfile }}</p>
        </div>
        <button class="detail-button" @click="goToPortfolio">
          자세히 보기
        </button>
      </div>
    </div>
    <div v-if="!isPortfolio" class="no-portfolio">
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

  <!-- 비로그인 상태일 때: 랜덤 이미지 & 문구 -->
  <div v-if="!isLoggedIn" class="show-stats-container">
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
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth/auth';
import { useRouter } from 'vue-router';
import { getPortfolio } from '@/api/main/main.js';
import { getMemberStat } from '@/api/main/main.js';
import { Swords } from 'lucide-vue-next';
import { Coins } from 'lucide-vue-next';
import { Gauge } from 'lucide-vue-next';
import { Brain } from 'lucide-vue-next';
import { Sparkle } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const isstats = ref(false);
const isPortfolio = ref(false);
const portfolioData = ref(null);
const statData = ref(null);

const goToStatsPage = () => {
  router.push('/my-stats');
};

const goToPortfolio = () => {
  router.push('/my-portfolio');
};

const goToTest = () => {
  router.push('/quizstart');
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
      portfolioData.value = portfolio;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        isPortfolio.value = false;
      }
    }

    try {
      const stat = await getMemberStat();
      isstats.value = !!stat && Object.keys(stat).length > 0;
      statData.value = stat;
      console.log('📊 Member Stat:', stat);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        isstats.value = false;
      }
      console.warn('📛 통계 조회 실패:', e);
    }
  }
});

const portfolioRevealed = ref(false);
let hoverTimer = null;

const handleMouseEnter = () => {
  hoverTimer = setTimeout(() => {
    portfolioRevealed.value = true;
  }, 0);
};

const handleMouseLeave = () => {
  clearTimeout(hoverTimer);
  portfolioRevealed.value = false;
};
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
  padding: 2vh;
  overflow: hidden;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-extrabold);
}

.stat-row {
  width: 90%;
  display: flex;
}

.stat-label {
  width: 10vw;
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
  width: 90%;
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
  border-right: 0.2vh solid var(--color-light-gray);
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
}
.no-login-content {
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
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.4rem 1rem;
  text-align: left;
  font-size: 1rem;
}

.portfolio-animated {
  opacity: 0.4;
  filter: blur(4px);
  transition: all 0.8s ease;
  pointer-events: none;
}

.portfolio-animated.revealed {
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}

.icon {
  padding: 1vh;
}
</style>
