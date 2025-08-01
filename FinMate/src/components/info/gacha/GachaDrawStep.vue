<template>
  <div class="draw-step">
    <h2 class="title">앞으로의 여정을 함께할 새로운 동물은 누구일까요?</h2>
    <div class="egg-select-area">
      <img :src="arrowIcon" alt="선택 화살표" class="center-indicator" />
      <div class="scroll-wrapper">
        <div class="scroll-inner" ref="innerRef">
          <div
            class="egg"
            :class="{ 'egg-animate': !isRolling }"
            v-for="(egg, i) in duplicatedEggList"
            :key="i"
          >
            <img :src="egg.url" class="egg-img" />
          </div>
        </div>
      </div>
    </div>
    <button class="confirm-btn" @click="startRolling">
      이제 알을 골라볼게요!
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import arrowIcon from "@/assets/images/icons/arrow_triangle.svg";

const emit = defineEmits(["confirm"]);

const innerRef = ref(null);
const selectedIndex = ref(0);
const isRolling = ref(false);
const offsetX = ref(0);
let speed = 30;
let frameId = null;

const images = import.meta.glob("@/assets/images/animals/Gacha_egg/*.png", {
  eager: true,
  import: "default",
});

const eggList = Object.keys(images)
  .filter((path) => !path.includes("egg_family.png"))
  .sort()
  .map((path) => ({ url: images[path] }));

const duplicatedEggList = Array(100)
  .fill(null)
  .flatMap(() => eggList);

const startRolling = async () => {
  if (isRolling.value) return;
  isRolling.value = true;
  speed = 20 + Math.random() * 5;
  await nextTick();

  const inner = innerRef.value;
  const direction = -1;
  const decay = 0.98;

  offsetX.value = -inner.scrollWidth / 2 + inner.parentElement.offsetWidth / 2;
  inner.style.transform = `translateX(${offsetX.value}px)`;

  const animate = () => {
    offsetX.value += direction * speed;
    speed *= decay;
    inner.style.transform = `translateX(${offsetX.value}px)`;

    if (Math.abs(speed) < 0.5) {
      cancelAnimationFrame(frameId);
      isRolling.value = false;

      const eggs = inner.querySelectorAll(".egg");
      const wrapperCenter = inner.parentElement.offsetWidth / 2;
      let closest = 0;
      let min = Infinity;

      eggs.forEach((el, i) => {
        const eggCenter = el.offsetLeft + el.offsetWidth / 2 + offsetX.value;
        const dist = Math.abs(wrapperCenter - eggCenter);
        if (dist < min) {
          min = dist;
          closest = i;
        }
      });

      selectedIndex.value = closest;
      emit("confirm", duplicatedEggList[closest].url);
    } else {
      frameId = requestAnimationFrame(animate);
    }
  };

  frameId = requestAnimationFrame(animate);
};
</script>

<style scoped>
.draw-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.title {
  margin-top: 2rem;
  font-size: 1.7rem;
  font-weight: var(--font-weight-bold);
}

.egg-select-area {
  width: 100%;
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.center-indicator {
  position: absolute;
  top: -3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2rem;
  z-index: 10;
  pointer-events: none;
}

.scroll-wrapper {
  width: 100%;
  height: 8rem;
  overflow: hidden;
  position: relative;
  box-sizing: content-box;
}

.scroll-inner {
  display: flex;
  gap: 0.4rem;
  will-change: transform;
  margin: 0 8rem;
}

.egg {
  flex: 0 0 auto;
  width: 8.5rem;
  height: 8.5rem;
}

.egg-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.confirm-btn {
  margin-top: 7rem;
  padding: 0.8rem 7rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border-radius: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.confirm-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

@keyframes tilt {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.egg-animate {
  animation: tilt 2s ease-in-out infinite;
}
</style>
