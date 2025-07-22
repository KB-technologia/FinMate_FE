<template>
  <div class="quiz-view">
    <div>
      <TopNavigationBar />
    </div>
    <div class="quiz-view-content">
      <div class="quiz"></div>
      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import FooterComponent from '../../components/allshared/FooterComponent.vue';
</script>

<style scoped>
.quiz-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
.quiz-view-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100vw;
  height: 100vh;
}
.quiz {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}
</style>
