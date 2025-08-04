<template>
  <div class="star-rating" :style="{ fontSize: size }">
    <span
      v-for="index in maxStars"
      :key="index"
      class="star"
      :class="[getStarClass(index), { interactive: interactive }]"
      @click="handleStarClick(index)"
      @mouseleave="handleMouseLeave"
    >
      ★
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
    default: '1.5rem',
  },
  interactive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['rating-change']);

const hoverRating = ref(0);

const getStarClass = (index) => {
  const currentRating =
    props.interactive && hoverRating.value > 0
      ? hoverRating.value
      : props.rating;

  if (index <= Math.floor(currentRating)) return 'full';
  else if (index - currentRating < 1 && index - currentRating > 0)
    return 'half';
  else return 'empty';
};

const handleStarClick = (index) => {
  if (props.interactive) {
    emit('rating-change', index);
  }
};

const handleMouseOver = (index) => {
  if (props.interactive) {
    hoverRating.value = index;
  }
};

const handleMouseLeave = () => {
  if (props.interactive) {
    hoverRating.value = 0;
  }
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
  transition: transform 0.1s ease;
}

.star.interactive {
  cursor: pointer;
}

.star.interactive:hover {
  transform: scale(1.1);
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
  content: '★';
  color: var(--color-orange);
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
  display: inline-block;
}
</style>
