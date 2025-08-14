<template>
  <canvas ref="canvas" class="confetti-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import confetti from "canvas-confetti";

/**
 * props
 * - anchorSelector  : 컨페티를 덮을 대상(모달) 선택자. 기본 .tm-modal
 * - duration        : 컨페티를 몇 ms 동안 내릴지
 * - zIndex          : z-index (모달 위에 올라오도록 충분히 크게)
 * - heightRatio     : 모달 높이의 몇 %만 덮을지 (키위 위쪽만 덮고 싶으면 0.4~0.55)
 * - scale           : 조각 크기
 * - burstParticles  : 시작 팡! 개수
 * - streamParticles : 비 내릴 때 프레임당 개수
 * - spread          : 흩뿌리는 각도 (넓을수록 퍼짐)
 * - startVelocity   : 초기 속도
 */
const props = defineProps({
  anchorSelector: { type: String, default: ".tm-modal" },
  duration: { type: Number, default: 1800 },
  zIndex: { type: Number, default: 200000 },
  heightRatio: { type: Number, default: 0.5 },
  scale: { type: Number, default: 1.2 },
  burstParticles: { type: Number, default: 100 },
  streamParticles: { type: Number, default: 10 },
  spread: { type: Number, default: 90 },
  startVelocity: { type: Number, default: 55 },
  gravity: { type: Number, default: 1.0 },
});

const canvas = ref(null);
let myConfetti;
let intervalId;
let resizeObs;

function placeCanvasOverAnchor() {
  const el =
    canvas.value?.closest(props.anchorSelector) ||
    document.querySelector(props.anchorSelector);
  const c = canvas.value;
  if (!el || !c) return;

  const rect = el.getBoundingClientRect();
  const height = Math.max(
    100,
    rect.height * Math.min(1, Math.max(0.2, props.heightRatio))
  );

  Object.assign(c.style, {
    position: "fixed",
    left: rect.left + "px",
    top: rect.top + "px",
    width: rect.width + "px",
    height: height + "px",
    pointerEvents: "none",
    zIndex: String(props.zIndex),
  });
  c.width = Math.floor(rect.width);
  c.height = Math.floor(height);
}

function startRain() {
  const c = canvas.value;
  if (!c) return;
  myConfetti = confetti.create(c, { resize: false, useWorker: true });

  const end = Date.now() + props.duration;

  myConfetti({
    particleCount: 80,
    spread: 90,
    origin: { x: 0.5, y: 0.05 },
    startVelocity: 50,
    gravity: 1.1,
    ticks: 200,
    particleCount: props.burstParticles,
    spread: props.spread,
    origin: { x: 0.5, y: 0.05 },
    startVelocity: props.startVelocity,
    gravity: props.gravity,
    scalar: props.scale,
    ticks: 200,
  });

  intervalId = setInterval(() => {
    myConfetti({
      particleCount: props.streamParticles,
      spread: props.spread,
      startVelocity: props.startVelocity * 0.9,
      origin: { x: Math.random(), y: 0 },
      gravity: props.gravity,
      ticks: 200,
      scalar: props.scale,
    });

    if (Date.now() > end) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }, 140);
}

onMounted(() => {
  placeCanvasOverAnchor();
  const anchor =
    canvas.value?.closest(props.anchorSelector) ||
    document.querySelector(props.anchorSelector);

  if (anchor && "ResizeObserver" in window) {
    resizeObs = new ResizeObserver(() => placeCanvasOverAnchor());
    resizeObs.observe(anchor);
  }
  window.addEventListener("resize", placeCanvasOverAnchor);

  startRain();
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
  window.removeEventListener("resize", placeCanvasOverAnchor);
  if (resizeObs) resizeObs.disconnect();
});
</script>

<style scoped>
.confetti-canvas {
  display: block;
}
</style>
