<template>
  <div class="signup-view">
    <div class="nav">
      <TopNavigationBar />
    </div>
    <div class="signup-view-content">
      <div class="content-area">
        <RegisterForm />
      </div>
      <div>
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
  overflow-y: auto;
}

.signup-view::before {
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

.signup-view-content {
  display: flex;
  height: 100vh;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  overflow-y: auto;
}
.content-area {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1rem;
  flex-grow: 1;
}
.nav {
  justify-content: center;
  align-items: center;
}
</style>
