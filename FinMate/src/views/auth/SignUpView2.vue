<template>
  <div class="signup-view">
    <div>
      <TopNavigationBar />
    </div>
    <div class="signup-view-content">
      <div>
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
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  min-height: 100vh;
  background-color: #f4f4f4;
}
</style>
