<template>
  <div class="profile-container">
    <div v-if="isLoggedIn" class="profile-header">
      <button class="quiz-button">오늘의 퀴즈</button>
      <div class="logout-button" @click="handleLoginClick">
        <img
          src="@/assets/images/LogoutRounded.png"
          class="logout-logo"
          alt="로그아웃 아이콘"
        />
        <span>로그아웃</span>
      </div>
    </div>
    <div v-if="isLoggedIn" class="profile-info">
      <img
        src="@/assets/images/capybara.png"
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
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth/auth";
import { computed } from "vue";

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);

const currentXp = 2000;
const maxXp = 3000;
const fillPercentage = computed(() => (currentXp / maxXp) * 100);

function handleLoginClick() {
  if (!isLoggedIn.value) {
    router.push("/login");
  } else {
    const confirmed = window.confirm("정말 로그아웃하시겠습니까?");
    if (confirmed) {
      authStore.logout();
    }
  }
}
</script>

<style scoped>
.profile-container {
  width: 22vw;
  height: 30vh;
  background-color: var(--color-primary-yellow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2vh;
  padding: 3vh;
  font-family: var(--font-wanted);
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
  color: var(--color-black);
  font-size: 1rem;
  border-radius: 2vh;
  cursor: pointer;
  border: none;
  padding: 0.5rem 1rem;
}

.quiz-button:hover {
  box-shadow: 0 1vh 1vw rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}

.logout-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  padding: 0.5rem;
  cursor: pointer;
  border: var(--color-red) solid 1px;
  font-weight: bold;
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
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.xp-bar {
  position: relative;
  width: 180px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: var(--color-white);
  text-align: center;
  line-height: 20px;
  z-index: 1;
}

.custom-login-button {
  width: 50%;
  height: 4rem;
  background-color: var(--color-main-button);
  color: var(--color-black);
  font-size: 1rem;
  border-radius: 2vh;
  cursor: pointer;
}

.custom-login-button:hover {
  box-shadow: 0 1vh 1vw rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}
</style>
