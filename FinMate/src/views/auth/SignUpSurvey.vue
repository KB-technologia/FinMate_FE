<script setup>
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import FooterComponent from '@/components/allshared/FooterComponent.vue';
import SurveyComponent from '@/components/auth/SurveyComponent.vue';
</script>

<template>
  <div class="survey-view">
    <TopNavigationBar />
    <div class="survey-view-content">
      <div class="survey">
        <SurveyComponent />
      </div>
      <!-- <FooterComponent /> -->
    </div>
  </div>
</template>

<style scoped>
.survey-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.survey-view::before {
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

.survey-view-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100vw;
  height: 100vh;
}

.survey {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}
</style>
