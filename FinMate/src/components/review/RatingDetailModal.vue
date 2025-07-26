<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>별점 정보</h3>
      </div>
      <div class="review-count">{{ reviewCount }}</div>
      <div class="stars">
        <span
          v-for="n in 5"
          :key="n"
          class="star"
          :class="{ filled: n <= Math.round(totalScore) }"
          >★</span
        >
      </div>
      <div v-for="(label, idx) in labels" :key="idx" class="bar-row">
        <span class="label">{{ label }}</span>
        <div class="bar-wrapper">
          <div class="bar-fill" :style="{ width: ratingData[idx] + '%' }"></div>
        </div>
        <span class="percent">{{ ratingData[idx] }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalScore: Number,
  ratingData: Array,
  reviewCount: Number,
});

const labels = ["최고", "좋음", "보통", "별로", "나쁨"];
const emit = defineEmits(["close"]);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal {
  position: relative;
  display: block;
  background: var(--color-white);
  padding: 2rem;
  border-radius: 1rem;
  width: 28rem;
  max-width: 90vw;
  max-height: 48vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-white);
  background-color: var(--color-primary-bluegray);
  padding: 0.7rem 1rem;
  border-radius: 0.5rem 0.5rem 0 0;
  margin: -2rem -2rem 1rem -2rem;
}

.modal-header h3 {
  margin-top: 0.5rem;
  font-size: 1.4rem;
  font-weight: var(--font-weight-medium);
}

.review-count {
  text-align: center;
  font-size: 2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-black);
  margin-bottom: 0.3rem;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin: 0.5rem 0 1rem;
}

.star {
  font-size: 2rem;
  color: var(--color-light-gray);
}

.star.filled {
  color: var(--color-orange);
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}

.label {
  width: 2.5rem;
  text-align: center;
  font-weight: var(--font-weight-bold);
}

.bar-wrapper {
  flex: 1;
  height: 2rem;
  background: var(--color-light-gray);
  border-radius: 1rem;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: var(--color-primary-yellow);
}
.percent {
  width: 3rem;
  text-align: center;
  font-size: 0.9rem;
  font-weight: var(--font-weight-bold);
}
</style>
