<template>
  <div class="review-card">
    <div class="left-section">
      <div class="profile-wrapper">
        <img
          src="@/assets/images/animals/penguin.png"
          alt="리뷰 작성자 프로필 이미지"
          class="profile-image"
        />
      </div>
      <div class="user-info">
        <p class="username">{{ username }}</p>
        <StarRating :rating="rating" :size="'1.1rem'" />
        <p class="date">{{ date }}</p>
      </div>
    </div>
    <div class="divider" />
    <div class="review-content">
      {{ content }}
    </div>
    <button
      v-if="showDelete"
      class="delete-button"
      @click="$emit('delete', { id, productId })"
    >
      <Trash2 class="icon-trash" />
    </button>
  </div>
</template>

<script setup>
import StarRating from '@/components/allshared/star/StarRating.vue';
import { Trash2 } from 'lucide-vue-next';

defineProps({
  username: String,
  rating: Number,
  date: String,
  content: String,
  showDelete: Boolean,
  id: Number,
  productId: Number,
});

defineEmits(['delete']);
</script>

<style scoped>
.review-card {
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-mypage-card);
  gap: 1.5rem;
  --delete-w: 3.5rem;
  width: 100%;
  border-radius: 2vh;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-wrapper {
  width: 5rem;
  height: 5rem;
  background-color: var(--color-primary-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.8rem;
}

.username {
  font-weight: var(--font-weight-semibold);
  font-size: 1.1rem;
  margin: 0;
}

.date {
  font-size: 0.85rem;
  color: var(--color-dark-gray);
}

.divider {
  width: 0.125rem;
  height: 100%;
  background-color: var(--color-light-gray);
}

.review-content {
  flex: 1;
  font-size: 1rem;
  font-weight: var(--font-weight-medium);
}

.delete-button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--delete-w);
  transform: translateX(100%);
  background-color: var(--color-delete-bg);
  border: none;
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-trash {
  color: var(--color-white);
  width: 1.5rem;
  height: 1.5rem;
}

.delete-button:hover .icon-trash {
  color: var(--color-red);
}
</style>
