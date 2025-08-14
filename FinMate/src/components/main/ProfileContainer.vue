<template>
  <div class="profile-container">
    <div v-if="isLoggedIn" class="profile-header">
      <button class="quiz-button" @click="openQuizModal">오늘의 퀴즈</button>
      <div class="logout-button" @click="handleLoginClick">
        <img
          src="@/assets/images/icons/LogoutRounded.png"
          class="logout-logo"
          alt="로그아웃 아이콘"
        />
        <span>로그아웃</span>
      </div>
    </div>

    <div v-if="isLoggedIn" class="profile-info">
      <div class="image-wrapper">
        <img
          v-if="!isLoading && animalImage"
          :src="animalImage"
          alt="캐릭터 이미지"
          class="capybara-img"
        />
        <div v-else class="image-spinner"></div>
      </div>

      <p class="level-text">
        <template v-if="!isLoading">
          <span v-if="memberLevel">Lv.{{ memberLevel }}</span
          >&nbsp; <span>{{ summary }}</span
          >&nbsp;<span>{{ animalName }}</span>
        </template>
        <template v-else>
          <div class="skeleton-text long"></div>
        </template>
      </p>

      <div class="xp-bar">
        <div class="xp-fill" :style="{ width: fillPercentage + '%' }"></div>
        <span class="xp-text">{{ levelexp }}/{{ maxXp }}</span>
      </div>
    </div>

    <button
      v-if="!isLoggedIn"
      class="custom-login-button"
      @click="handleLoginClick"
    >
      로그인 하러 가기
    </button>
    <div v-if="!isLoggedIn" class="login-options">
      <p class="login-option">
        <router-link to="/signup1">회원가입</router-link>
      </p>
      <p>|</p>
      <p class="login-option">
        <router-link to="/find-id">아이디 찾기</router-link>
      </p>
      <p>|</p>
      <p class="login-option">
        <router-link to="/reset-pw">비밀번호 변경</router-link>
      </p>
    </div>
  </div>

  <QuizRewardIntroModal
    v-if="showOnboarding && stage === 'reward'"
    @next="stage = 'limit'"
    @close="closeOnboarding"
  />
  <QuizDailyLimitModal
    v-if="showOnboarding && stage === 'limit'"
    @start="openDailyQuiz"
    @close="closeOnboarding"
  />
  <DailyQuizModal
    v-if="showDailyQuiz"
    @close="closeDailyQuiz"
    @exp-updated="applyExpPatch"
  />
  <ConfirmModal
    v-if="showLogoutConfirm"
    :firsttext="'오늘의 금융 탐험은 여기까지!\n동물 친구들이 다음 추천을 준비 중이에요'"
    leftButtonText="취소"
    rightButtonText="로그아웃"
    @confirm="handleLogoutConfirm"
    :images="logoutImage"
  />
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth/auth";
import { ref, computed, onMounted } from "vue";

import { useToast } from "@/composables/useToast";
import DailyQuizModal from "@/components/dailyquiz/modals/DailyQuizModal.vue";
import ConfirmModal from "@/components/allshared/ConfirmModal.vue";
import logoutImage from "@/assets/images/logos/logoutkiwi.png";
import { getMemberLevel } from "@/api/main/main.js";
import { getMemberCharacter } from "@/api/info/userStatsAPI";
import { getQuizSolved } from "@/api/dailyquiz/dailyQuizSolved.js";

import QuizRewardIntroModal from "@/components/dailyquiz/modals/QuizRewardIntroModal.vue";
import QuizDailyLimitModal from "@/components/dailyquiz/modals/QuizDailyLimitModal.vue";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const router = useRouter();
const authStore = useAuthStore();

const { toast } = useToast();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const showOnboarding = ref(false);
const showDailyQuiz = ref(false);
const showLogoutConfirm = ref(false);
const isLoading = ref(true);

const maxXp = 1000;
const memberLevel = ref(0);
const totalexp = ref(0);
const levelexp = ref(0);
const fillPercentage = computed(() => (levelexp.value / maxXp) * 100);
const animalName = ref("");
const animalImage = ref("");
const summary = ref("");

const stage = ref("reward");
const closeOnboarding = () => {
  showOnboarding.value = false;
  stage.value = "reward";
};
const openDailyQuiz = () => {
  showOnboarding.value = false;
  showDailyQuiz.value = true;
};
const closeDailyQuiz = () => {
  showDailyQuiz.value = false;
  if (isLoggedIn.value) refreshLevel();
};

function handleLoginClick() {
  if (!isLoggedIn.value) {
    router.push("/login");
  } else {
    showLogoutConfirm.value = true;
  }
}
function handleLogoutConfirm(confirmed) {
  showLogoutConfirm.value = false;
  if (confirmed) authStore.logout();
}

onMounted(async () => {
  try {
    if (isLoggedIn.value) {
      const levelData = await getMemberLevel();
      const character = await getMemberCharacter();
      memberLevel.value = levelData.data.currentLevel;
      totalexp.value = levelData.data.totalExp;
      levelexp.value = totalexp.value % 1000;
      animalName.value = character.data.animalName;
      animalImage.value = `${BASE_API_URL}${character.data.animalImage}`;
      summary.value = levelData.data.profileSummary;
      console.log(levelData.data);
      console.log(character.data);
    }
  } catch (err) {
    console.error("⚠️ 사용자 정보 로딩 실패:", err);
  } finally {
    isLoading.value = false;
  }
});

async function openQuizModal() {
  if (showOnboarding.value || showDailyQuiz.value) return;

  try {
    const res = await getQuizSolved();
    console.log("퀴즈 풀이 상태", res.data.quizSolved);
    if (res.data.quizSolved) {
      toast("오늘은 이미 퀴즈를 푸셨군요?\n내일 다시 도전해주세요!", "warning");
      return;
    }
    showOnboarding.value = true;
    stage.value = "reward";
  } catch (error) {
    console.error("퀴즈 로딩 실패", error);
    toast(
      "퀴즈 상태를 가져오지 못했어요. 잠시 후 다시 시도해주세요.",
      "warning"
    );
  }
}

async function refreshLevel() {
  try {
    const levelData = await getMemberLevel();
    memberLevel.value = levelData.data.currentLevel;
    totalexp.value = levelData.data.totalExp;
    levelexp.value = totalexp.value % maxXp;
    summary.value = levelData.data.profileSummary;
    console.log("[Profile] refreshLevel:", levelData.data);
  } catch (err) {
    console.error("레벨 재조회 실패:", err);
  }
}

function applyExpPatch(payload) {
  console.log("[Profile] exp-updated payload:", payload);
  if (payload?.currentLevel != null) memberLevel.value = payload.currentLevel;
  if (payload?.totalExp != null) {
    totalexp.value = payload.totalExp;
    levelexp.value = totalexp.value % maxXp;
  }
  if (payload?.profileSummary) summary.value = payload.profileSummary;
}
</script>

<style scoped>
.profile-container {
  width: 23vw;
  height: 35vh;
  border: 0.2vh solid var(--color-light-gray);
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2vh;
  padding: 3vh;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-extrabold);
}
.profile-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logout-logo {
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.5rem;
}
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.quiz-button {
  background-color: var(--color-main-button);
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
  font-size: 0.9rem;
  border-radius: 2vh;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}
.quiz-button:hover {
  box-shadow: 0 0.5vh 0.5vw rgba(0, 0, 0, 0.3);
  color: var(--color-white);
  transform: translateY(-0.5vh);
}
.logout-button {
  display: flex;
  align-items: center;
  width: 6rem;
  padding: 0.5rem;
  cursor: pointer;
  font-weight: var(--font-weight-extrabold);
  background-color: var(--color-logout-button);
  font-size: 0.9rem;
  border-radius: 2vh;
  transition: all 0.2s ease;
  color: var(--color-white);
}
.logout-button:hover {
  box-shadow: 0 0.5vh 0.5vw rgba(0, 0, 0, 0.3);
  color: var(--color-white);
  transform: translateY(-0.5vh);
  background-color: var(--color-red);
}
.image-wrapper {
  width: 12vh;
  height: 12vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.capybara-img {
  width: 100%;
}
.image-spinner {
  width: 12vh;
  height: 12vh;
  border: 0.8vh solid var(--color-white);
  border-top: 0.8vh solid var(--color-main-button);
  border-radius: 50%;
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
.level-text {
  font-weight: var(--font-weight-extrabold);
  font-size: 1.1rem;
  text-align: center;
}
.xp-bar {
  position: relative;
  width: 240px;
  height: 30px;
  background-color: var(--color-light-gray);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.xp-fill {
  height: 100%;
  background-color: var(--color-black);
  transition: width 0.5s ease;
}
.xp-text {
  position: absolute;
  top: 5px;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 13px;
  color: var(--color-white);
  font-weight: var(--font-weight-medium);
  text-align: center;
  z-index: 1;
}
.custom-login-button {
  width: 70%;
  height: 5rem;
  background-color: var(--color-main-button);
  color: var(--color-black);
  font-size: 1rem;
  border-radius: 2vh;
  cursor: pointer;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-extrabold);
}
.custom-login-button:hover {
  transform: translateY(-0.6vh);
  background-color: var(--color-main-button);
  color: var(--color-white);
  box-shadow: 0 0.5vh 0.5vw rgba(50, 50, 50, 0.15);
}
.login-options {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-light-gray);
}
.login-option {
  cursor: pointer;
  transition: color 0.2s ease;
}
.login-option:hover {
  color: var(--color-black);
}
.login-option a {
  color: inherit;
  text-decoration: none;
}
.login-option a:hover {
  text-decoration: underline;
}
.skeleton-text {
  height: 1.2rem;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 1vh;
  margin: 0.2rem auto;
}
.skeleton-text.long {
  width: 10rem;
}
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
