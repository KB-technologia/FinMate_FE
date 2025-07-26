<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>별점 정보</h3>
      </div>
      <p class="review-description">
        <span class="review-count">{{ reviewCount }}</span
        >개의 리뷰가 달렸어요
      </p>
      <div class="star-wrapper">
        <StarRating :rating="totalScore" size="2rem" />
      </div>

      <div class="bar-group">
        <div v-for="(label, idx) in labels" :key="idx" class="bar-row">
          <span class="label">{{ label }}</span>
          <div class="bar-wrapper">
            <div
              class="bar-fill"
              :style="{ width: ratingData[idx] + '%' }"
            ></div>
          </div>
          <span class="percent">{{ ratingData[idx] }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StarRating from "@/components/allshared/star/StarRating.vue";

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
  max-height: fit-content;
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

.review-description {
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-black);
  text-align: center;
  margin-bottom: 0.5rem;
}

.review-count {
  color: var(--color-orange);
  font-weight: var(--font-weight-bold);
}

.star-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.bar-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-row {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  gap: 0.5rem;
}

.label {
  width: 2.5rem;
  text-align: center;
  font-weight: var(--font-weight-bold);
  margin-right: 0.4rem;
}

.bar-wrapper {
  flex: 1;
  height: 2.2rem;
  background: var(--color-light-gray);
  border-radius: 1rem;
  overflow: hidden;
  margin-right: 0.4rem;
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
