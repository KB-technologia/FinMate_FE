<template>
  <div class="signup-view">
    <div>
      <TopNavigationBar />
    </div>
    <div class="signup-view-content">
      <div>
        <SignUpTermsForm />
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
import SignUpTermsForm from '@/components/auth/SignUpTermsForm.vue';
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

.signup-view-content {
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
