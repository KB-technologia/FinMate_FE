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
.star.full {
  color: var(--color-orange);
}

.star.half {
  background: linear-gradient(to right, var(--color-orange) 50%, #ccc 50%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.star.empty {
  color: #ccc;
}
</style>
