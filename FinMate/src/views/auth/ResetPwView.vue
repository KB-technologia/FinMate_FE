<template>
  <div class="signup-view">
    <div>
      <TopNavigationBar />
    </div>
    <div class="ResetPw-content">
      <div>
        <ResetPw />
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
import ResetPw from '@/components/auth/ResetPw.vue';
</script>

<style scoped>
.signup-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.ResetPw-content {
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
