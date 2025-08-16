<template>
  <div class="quiz-view">
    <div>
      <TopNavigationBar />
    </div>
    <div class="quiz-view-content">
      <div class="quiz">
        <QuizComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import QuizComponent from '../../components/quiz/QuizComponent.vue';
</script>

<style scoped>
.quiz-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.quiz-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/backgroundImage/background_main.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
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
