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
</template>

<style scoped>
.signup-complete-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  width: 100vw;
  text-align: center;
}

.signup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  gap: 5px;
}

.penguin-image {
  width: 300px;
  height: auto;
}

.title {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 16px;
  color: #666;
}

.login-button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 5px;
}

.login-button:hover {
  background-color: var(--color-dark-gray);
}
</style>
