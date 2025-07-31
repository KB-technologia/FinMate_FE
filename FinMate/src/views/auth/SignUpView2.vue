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
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.signup-view-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}
.content-area {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1rem;
  background-color: var(--color-white);
  flex-grow: 1;
}
.nav {
  justify-content: center;
  align-items: center;
}
</style>
