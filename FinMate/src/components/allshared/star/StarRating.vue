<template>
  <div class="star-rating" :style="{ fontSize: size }">
    <span
      v-for="index in maxStars"
      :key="index"
      class="star"
      :class="getStarClass(index)"
    >
      ★
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
  maxStars: {
    type: Number,
    default: 5,
  },
  size: {
    type: String,
    default: "1.5rem",
  },
});

const getStarClass = (index) => {
  if (index <= Math.floor(props.rating)) return "full";
  else if (index - props.rating < 1 && index - props.rating > 0) return "half";
  else return "empty";
};
</script>

<style scoped>
.star-rating {
  display: flex;
  gap: 0.2rem;
  line-height: 1;
}

.star {
  position: relative;
  display: inline-block;
}

.star.full,
.star.empty {
  color: var(--color-orange);
}

.star.empty {
  color: var(--color-light-gray);
}

.star.half {
  color: var(--color-light-gray);
}

.star.half::before {
  content: "★";
  color: var(--color-orange);
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
  display: inline-block;
}
</style>
