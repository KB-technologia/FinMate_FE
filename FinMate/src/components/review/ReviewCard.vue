<template>
  <div class="review-card">
    <div class="left-section">
      <div class="profile-wrapper">
        <img
          src="@/assets/images/penguin.png"
          alt="profile"
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
  </div>
</template>

<script setup>
import StarRating from "@/components/allshared/star/StarRating.vue";

defineProps({
  username: String,
  rating: Number,
  date: String,
  content: String,
});
</script>

<style scoped>
.review-card {
  display: flex;
  align-items: center;
  border: 0.125rem solid var(--color-black);
  padding: 1rem;
  gap: 1.5rem;
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
</style>
