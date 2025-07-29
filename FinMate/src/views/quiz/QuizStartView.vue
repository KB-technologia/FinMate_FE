<template>
  <div class="quiz-start-view">
    <div>
      <TopNavigationBar />
    </div>
    <div class="quiz-start-content">
      <div class="quiz-start-header-container">
        <div class="quiz-start-header">
          <div class="quiz-start-header-title">
            <i class="fa-solid fa-chart-simple icon-title"></i>
            <h1>투자 성향 테스트</h1>
          </div>
          <div class="quiz-start-description">
            <span>총 7문항</span>
            <span> | </span>
            <span>약 5분 소요</span>
            <span> | </span>
            <span>결과로 상품 추천</span>
          </div>
          <div class="quiz-start-image-container">
            <img
              src="@/assets/images/logos/kiwiLogo2.png"
              alt="Quiz Start Image"
              class="quiz-start-image"
            />
            <div class="speech-bubble">
              <p>나와 함께</p>
              <p>테스트 해볼래?</p>
            </div>
          </div>
          <button @click="startQuiz">시작하기</button>
        </div>
        <div class="keyword-cloud">
          <span class="word word1 bold">용맹한</span>
          <span class="word word2">섬세한</span>
          <span class="word word3">신중한</span>
          <span class="word word4 bold">도전적인</span>
          <span class="word word5">적극적인</span>
          <span class="word word6">소심한</span>
          <span class="word word7">느긋한</span>
          <span class="word word8">현실적인</span>
          <span class="word word9">과감한</span>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import FooterComponent from "../../components/allshared/FooterComponent.vue";
import TopNavigationBar from "../../components/allshared/TopNavigationBar.vue";

import { useRouter } from "vue-router";
const router = useRouter();
const startQuiz = () => {
  router.push("/quiz");
};
</script>

<style scoped>
.quiz-start-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.quiz-start-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100vw;
  height: 100vh;
}

.quiz-start-header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 100vh;
}

.quiz-start-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70vw;
  height: 30vh;
}

.quiz-start-description {
  font-size: 1.5rem;
}

.quiz-start-header-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.icon-title {
  margin-right: 1vw;
  align-items: center;
  justify-content: center;
}

.quiz-start-image {
  width: 20vw;
  height: 20vw;
  object-fit: contain;
}

.quiz-start-image-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.speech-bubble {
  position: relative;
  background: #fff;
  border: 0.1vh solid #ccc;
  border-radius: 2vh;
  padding: 1rem;
  font-size: 1.2rem;
  max-width: 15vw;
  text-align: center;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.speech-bubble::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -15px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border: 1vh solid transparent;
  border-right-color: #ccc;
  border-left: 0;
}

button {
  background-color: var(--color-main-button);
  width: 15vw;
  color: var(--color-black);
  border: none;
  border-radius: 2vh;
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;
  animation: bounce 1.2s infinite;
  transition: transform 0.2s ease;
}

button:hover {
  color: var(--color-white);
  transition: all 0.2s ease-in-out;
  transform: translateY(-8px);
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.keyword-cloud {
  position: relative;
  width: 50vw;
  height: 60vh;
  overflow: hidden;
}

.word {
  position: absolute;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0.7;
  animation: floatWord 10s infinite alternate ease-in-out;
  transition: transform 0.3s ease;
}

.word:hover {
  transform: scale(1.2) rotate(2deg);
  z-index: 10;
  opacity: 1;
}
.bold {
  font-weight: 700;
  font-size: 2rem;
}
.word1 {
  top: 10%;
  left: 15%;
  font-size: 2rem;
  color: #e57373;
  transform: rotate(-10deg);
}
.word2 {
  top: 30%;
  left: 50%;
  font-size: 1.5rem;
  color: #81c784;
  transform: rotate(8deg);
}
.word3 {
  top: 60%;
  left: 20%;
  font-size: 1.8rem;
  color: #64b5f6;
  transform: rotate(-5deg);
}
.word4 {
  top: 20%;
  left: 70%;
  font-size: 2.2rem;
  color: #4db6ac;
  transform: rotate(15deg);
}
.word5 {
  top: 50%;
  left: 80%;
  font-size: 1.4rem;
  color: #ffb74d;
  transform: rotate(-12deg);
}
.word6 {
  top: 40%;
  left: 35%;
  font-size: 1.6rem;
  color: #9575cd;
  transform: rotate(5deg);
}
.word7 {
  top: 70%;
  left: 60%;
  font-size: 1.3rem;
  color: #f06292;
  transform: rotate(12deg);
}
.word8 {
  top: 15%;
  left: 40%;
  font-size: 1.7rem;
  color: #a1887f;
  transform: rotate(-7deg);
}
.word9 {
  top: 80%;
  left: 10%;
  font-size: 1.5rem;
  color: #90a4ae;
  transform: rotate(10deg);
}
</style>
