<template>
  <div class="gacha-modal" @click.self="emit('close')">
    <div class="modal-content">
      <h2 class="title">어떤 알을 선택하시겠어요?</h2>

      <div class="egg-select-area">
        <img :src="arrowIcon" alt="선택 화살표" class="center-indicator" />

        <div class="scroll-wrapper">
          <div class="scroll-inner" ref="innerRef">
            <div class="egg" v-for="(egg, i) in duplicatedEggList" :key="i">
              <img :src="egg.url" class="egg-img" />
            </div>
          </div>
        </div>
      </div>

      <button class="confirm-btn" @click="startRolling">
        이 캐릭터로 할래요!
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

import arrowIcon from "@/assets/images/icons/arrow_triangle.svg";

const emit = defineEmits(["close", "confirm"]);

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
.gacha-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  width: 90vw;
  max-width: 700px;
  min-height: 32rem;
  padding: 2rem;
  border-radius: 1rem;
  background-color: var(--color-modal-bg);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 3rem;
}

.title {
  margin-top: 2rem;
  font-size: 1.7rem;
  font-weight: var(--font-weight-bold);
}

.egg-select-area {
  width: 100%;
  margin-top: 4rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
}

.scroll-inner {
  display: flex;
  gap: 0.7rem;
  will-change: transform;
}

.egg {
  flex: 0 0 auto;
  width: 8rem;
  height: 8rem;
}

.egg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.confirm-btn {
  margin-top: auto;
  margin-bottom: 1rem;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;

  background-color: var(--color-primary-green);
  color: var(--color-white);
  border-radius: 2rem;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.confirm-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}
</style>
