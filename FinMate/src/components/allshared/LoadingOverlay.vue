<template>
  <div class="loading-overlay">
    <img
      v-if="type === 'fly'"
      class="flying-kiwi"
      src="@/assets/images/logos/flying-kiwi.png"
      alt="비행기 타고 가는 키위새"
    />

    <div v-else-if="type === 'desk'" class="desk-scene">
      <img
        class="desk-kiwi"
        src="@/assets/images/logos/kiwi-writing.png"
        alt="책상 앞 키위새"
      />
      <img
        class="falling-paper"
        src="@/assets/images/logos/paper-falling.png"
        alt="천천히 떨어지는 종이"
      />
    </div>

    <p class="loading-text">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "로딩 중...",
  },
  type: {
    type: String,
    default: "fly",
  },
});
</script>

<style scoped>
/* 인증코드 발급 loading 페이지 (/UserInfoForm.vue) */
/* TODO: 로딩화면 적용 후 아래 주석은 삭제해주세요 */
/* 사용 예시:
      <LoadingOverlay
      v-if="ui.isLoading"
      :message="'설문지를 제작하고 있어요 잠시 기다려주세요!''"
      type="desk"
    />
*/
.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.flying-kiwi {
  width: 8rem;
  height: auto;
  margin-bottom: 2rem;
  animation-name: kiwi-float-forward;
  animation-duration: 4s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes kiwi-float-forward {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(5vw, -1vh);
  }
  50% {
    transform: translate(10vw, 0);
  }
  75% {
    transform: translate(15vw, 1vh);
  }
  100% {
    transform: translate(20vw, 0);
  }
}

/* 설문 시작 전 loading 페이지 */
.desk-scene {
  position: relative;
  width: 10rem;
  height: 10rem;
  margin-bottom: 2rem;
}

.desk-kiwi {
  width: 100%;
  height: auto;
  display: block;
}

.falling-paper {
  position: absolute;
  top: 0;
  left: 60%;
  width: 3.5rem;
  transform: translateX(-50%);
  animation-name: paper-fall;
  animation-duration: 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  pointer-events: none;
}

@keyframes paper-fall {
  0% {
    transform: translateX(-50%) translateY(-30%);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(200%);
    opacity: 0;
  }
}

.loading-text {
  color: var(--color-white);
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  transform: translateY(-2rem);
}
</style>
