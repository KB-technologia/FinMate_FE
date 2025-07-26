<template>
  <div class="modal-backdrop" @click.self="onClose">
    <div class="modal-card">
      <div class="product-title-row">
        <img :src="productImageUrl" alt="product" class="product-image" />
        <h2 class="product-name">{{ productName }}</h2>
      </div>
      <StarRating :rating="rating" size="2.5rem" class="star-display" />
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        v-model="rating"
        class="rating-slider"
        :style="sliderStyle"
      />
      <textarea
        v-model="reviewText"
        placeholder="리뷰를 작성해주세요"
        class="review-textarea"
      />
      <button class="submit-button" @click="handleSubmit">SUBMIT</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import { useToast } from "@/composables/useToast";
import StarRating from "@/components/allshared/star/StarRating.vue";

const { toast } = useToast();

const props = defineProps({
  productName: String,
  productImageUrl: String,
});

const emit = defineEmits(["close", "submit"]);

const rating = ref(0);
const reviewText = ref("");

const handleSubmit = () => {
  if (rating.value === 0) {
    toast("별점을 선택해주세요.", "warning");
    return;
  }

  if (!reviewText.value.trim()) {
    toast("리뷰 내용을 입력해주세요.", "warning");
    return;
  }

  emit("submit", {
    rating: rating.value,
    content: reviewText.value,
  });
  emit("close");
};

const onClose = () => emit("close");

const sliderStyle = computed(() => {
  const percentage = (rating.value / 5) * 100;
  return {
    background: `linear-gradient(to right, var(--color-orange) 0%, var(--color-orange) ${percentage}%, #dcdcdc ${percentage}%, #dcdcdc 100%)`,
  };
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-card {
  background-color: var(--color-primary-yellow);
  border-radius: 1.5rem;
  padding: 2.5rem;
  width: 90vw;
  max-width: 40rem;
  max-height: 50vh;
  overflow-y: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.product-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-image {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
}

.product-name {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
}

.star-display {
  display: block;
  margin: 0.7rem auto;
  width: fit-content;
}

.rating-slider {
  width: 100%;
  height: 0.6rem;
  appearance: none;
  border-radius: 1rem;
  transition: background 450ms ease-in;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

.rating-slider::-webkit-slider-thumb {
  appearance: none;
  height: 1.2rem;
  width: 1.2rem;
  background-color: var(--color-orange);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  margin-top: -0.3rem;
}

.review-textarea {
  width: 100%;
  height: 6rem;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-light-gray);
  font-size: 1rem;
  padding: 1rem;
  resize: none;
  outline: none;
}

.submit-button {
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: var(--color-dark-blue);
}
</style>
