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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
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
