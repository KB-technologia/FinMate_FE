<template>
  <div class="rating-wrapper">
    <StarRating :rating="rating" :size="size" />
    <div class="review-info">
      <span class="review-count">{{ count }}</span>
      <button class="detail-button" @click="onDetailClick">
        자세히 보기 &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import StarRating from "@/components/allshared/StarRating.vue";

defineProps({
  rating: Number,
  count: Number,
  size: {
    type: String,
    default: "2.5rem",
  },
});

const emit = defineEmits(["open-detail"]);

const onDetailClick = () => {
  emit("open-detail");
};
</script>

<style scoped>
.rating-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.review-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-black);
}

.detail-button {
  background: none;
  border: none;
  color: var(--color-dark-blue);
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  font-size: 1rem;
  padding: 0;
}

.detail-button:hover {
  color: var(--color-black);
}
</style>
