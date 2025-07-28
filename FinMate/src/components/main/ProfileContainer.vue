<template>
  <div class="profile-container">
    <div v-if="isLoggedIn" class="profile-header">
      <button class="quiz-button" @click="showQuizModal = true">
        오늘의 퀴즈
      </button>
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
      <img
        src="@/assets/images/animals/capybara.png"
        alt="카피바라"
        class="capybara-img"
      />
      <p class="level-text">Lv3. 소심한 카피바라</p>
      <div class="xp-bar">
        <div class="xp-fill" :style="{ width: fillPercentage + '%' }"></div>
        <span class="xp-text">{{ currentXp }}/{{ maxXp }}</span>
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
      <p>회원가입</p>
      <p>|</p>
      <p>아이디 찾기</p>
      <p>|</p>
      <p>비밀번호 찾기</p>
    </div>
  </div>
  <DailyQuizModal v-if="showQuizModal" @close="showQuizModal = false" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth';
import { ref, computed } from 'vue';
import DailyQuizModal from '@/components/dailyquiz/DailyQuizModal.vue';

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const showQuizModal = ref(false);

const currentXp = 2000;
const maxXp = 3000;
const fillPercentage = computed(() => (currentXp / maxXp) * 100);

function handleLoginClick() {
  if (!isLoggedIn.value) {
    router.push('/login');
  } else {
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (confirmed) {
      authStore.logout();
    }
  }
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
  flex-direction: row;
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
  text-align: center;
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

  transform: translateY(-0.5vh);
}

.logout-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  padding: 0.5rem;
  cursor: pointer;
  border: var(--color-red) solid 1px;
  font-weight: var(--font-weight-extrabold);
  font-size: 0.7rem;
  border-radius: 1vh;
}

.logout-button:hover {
  color: var(--color-red);
  transition: all 0.2s ease-in-out;
}

.capybara-img {
  width: 12vh;
  margin-bottom: 0.5rem;
}

.level-text {
  font-weight: var(--font-weight-extrabold);
  font-size: 1.1rem;
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
  width: 50%;
  height: 4rem;
  background-color: var(--color-main-button);
  color: var(--color-black);
  font-size: 1rem;
  border-radius: 2vh;
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-extrabold);
}

.custom-login-button:hover {
  transform: translateY(-0.6vh);
  box-shadow: 0 0.5vh 0.5vw rgba(50, 50, 50, 0.15);
}

.login-options {
  width: 100%;
  height: 5rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-primary-bluegray);
}
</style>
