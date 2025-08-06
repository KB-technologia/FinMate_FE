<script setup>
import { useRouter } from 'vue-router';
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import FooterComponent from '@/components/allshared/FooterComponent.vue';

const router = useRouter();

function goToLogin() {
  router.push('/login');
}
</script>

<template>
  <div class="signup-complete-view">
    <TopNavigationBar />
    <div class="scroll-able">
      <div class="signup-content">
        <img
          src="@/assets/images/animals/penguin.png"
          alt="펭귄 캐릭터"
          class="penguin-image"
        />

        <h2 class="title">회원가입이 완료되었어요!</h2>
        <p class="subtitle">이제 핀메이트 서비스를 자유롭게 이용해보세요</p>

        <button class="login-button" @click="goToLogin">로그인하러 가기</button>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
.signup-complete-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.scroll-able {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.signup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.75rem 1.25rem;
  gap: 0.3125rem;
  height: 100vh;
}

.penguin-image {
  height: auto;
  width: 20rem;
  animation: bounce 1.2s ease-in-out 1.2s infinite alternate;
}

.title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 1rem;
  color: #666;
}

.login-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.3125rem;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
    animation-timing-function: ease-in;
  }
  50% {
    transform: translateY(-15px);
    animation-timing-function: ease-out;
  }
}
</style>
