<template>
  <div class="signup-view">
    <div class="nav">
      <TopNavigationBar />
    </div>
    <div class="signup-view-content">
      <div class="content-area">
        <RegisterForm />
      </div>
      <div class="footer-container">
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import FooterComponent from '@/components/allshared/FooterComponent.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
</script>

<style scoped>
.signup-view {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  max-height: none !important;
  height: auto !important;
}

.signup-view::before {
  content: '';
  position: fixed;
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

.nav {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
}

.signup-view-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 200px);
  max-height: none;
  height: auto;
}

.content-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: fit-content;
  height: auto;
}

.footer-container {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

:global(html, body) {
  height: auto !important;
  min-height: 100% !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
</style>
