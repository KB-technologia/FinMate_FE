<script setup>
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import FooterComponent from '@/components/allshared/FooterComponent.vue';
import LoginForm from '../../components/auth/LoginForm.vue';
</script>

<template>
  <div class="login-view">
    <div>
      <TopNavigationBar />
    </div>
    <div class="login-view-content">
      <div>
        <LoginForm />
      </div>
      <div>
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.login-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/backgroundImage/background_auth.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: -1;
}

.login-view-content {
  padding-top: 1vh;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 3vh;
}
</style>
