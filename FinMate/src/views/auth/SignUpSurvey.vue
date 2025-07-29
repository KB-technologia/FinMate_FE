<script setup>
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import FooterComponent from '@/components/allshared/FooterComponent.vue';
// import SurveyComponent from '@/components/survey/SurveyComponent.vue';
</script>

<template>
  <div class="survey-view">
    <TopNavigationBar />
    <div class="survey-view-content">
      <div class="survey">
        <!-- <SurveyComponent/> -->
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
.survey-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
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
