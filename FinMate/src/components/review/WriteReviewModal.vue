<template>
  <div class="modal-backdrop" @click.self="onClose">
    <div class="modal-card">
      <CloseButton @click="onClose" class="close-button" />
      <div class="product-title-row">
        <img :src="productImageUrl" alt="product" class="product-image" />
        <h2 class="product-name">{{ productName }}</h2>
      </div>
      <StarRating
        :rating="Number(rating)"
        size="2.5rem"
        class="star-display"
        :interactive="true"
        @rating-change="handleRatingChange"
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
import { ref } from "vue";

import { useToast } from "@/composables/useToast";
import StarRating from "@/components/allshared/star/StarRating.vue";
import CloseButton from "@/components/allshared/CloseButton.vue";

const { toast } = useToast();

const props = defineProps({
  productName: String,
  productImageUrl: String,
});

const emit = defineEmits(["close", "submit"]);

const rating = ref(0);
const reviewText = ref("");

const handleRatingChange = (newRating) => {
  rating.value = newRating;
};

const handleSubmit = () => {
  const ratingNumber = Number(rating.value);
  if (rating.value === 0) {
    toast("별점을 선택해주세요.", "warning");
    return;
  }

  if (!reviewText.value.trim()) {
    toast("리뷰 내용을 입력해주세요.", "warning");
    return;
  }

  emit("submit", {
    rating: ratingNumber,
    content: reviewText.value,
    ease_of_signup: 0,
  });
  emit("close");
};

const onClose = () => emit("close");
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
  max-width: 50rem;
  max-height: 50vh;
  overflow-y: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
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
  margin: 0.7rem auto 2rem auto;
  width: fit-content;
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
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: var(--color-dark-blue);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  transform: scale(0.7);
  z-index: 10;
}
</style>
