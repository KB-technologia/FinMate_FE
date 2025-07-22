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
              src="@/assets/images/kiwiLogo2.png"
              alt="Quiz Start Image"
              class="quiz-start-image"
            />
            <div class="speech-bubble">
              <p>나와 함께</p>
              <p>테스트 해볼래?</p>
            </div>
          </div>
          <button>시작하기</button>
        </div>
        <div class="keyword-cloud">
          <span class="word word1 bold" style="top: 30%; left: 80%"
            >용맹한</span
          >
          <span class="word word2" style="top: 25%; left: 20%">섬세한</span>
          <span class="word word3" style="top: 35%; left: 75%">신중한</span>
          <span class="word word4 bold" style="top: 50%; left: 15%"
            >도전적인</span
          >
          <span class="word word5" style="top: 60%; left: 70%">적극적인</span>
          <span class="word word6" style="top: 55%; left: 30%">소심한</span>
          <span class="word word7" style="top: 70%; left: 75%">느긋한</span>
          <span class="word word8" style="top: 65%; left: 20%">현실적인</span>
          <span class="word word9" style="top: 45%; left: 10%">과감한</span>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import FooterComponent from '../../components/allshared/FooterComponent.vue';
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
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
  height: 100vh;
}

.quiz-start-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
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
  margin-right: 10px;
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
  content: '';
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
  flex: 3;
  width: 100vw;
  height: 60vh;
  background-color: #fffef8;
}

.word {
  position: absolute;
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.9;
  white-space: nowrap;
}
.bold {
  font-weight: 700;
  font-size: 2rem;
}
.word1 {
  color: #e57373; /* 빨강 */
}
.word2 {
  color: #81c784; /* 연초록 */
}
.word3 {
  color: #64b5f6; /* 파랑 */
}
.word4 {
  color: #4db6ac; /* 청록 */
}
.word5 {
  color: #ffb74d; /* 주황 */
}
.word6 {
  color: #9575cd; /* 보라 */
}
.word7 {
  color: #f06292; /* 핑크 */
}
.word8 {
  color: #a1887f; /* 갈색 */
}
.word9 {
  color: #90a4ae; /* 회청 */
}
</style>
