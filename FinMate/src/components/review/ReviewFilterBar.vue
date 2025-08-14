<template>
  <div class="review-filter-bar">
    <div class="filter-tabs">
      <button
        :class="{ active: sort === 'latest' }"
        @click="updateSort('latest')"
      >
        최신순
      </button>
      <span class="divider">|</span>
      <button :class="{ active: sort === 'high' }" @click="updateSort('high')">
        높은 별점순
      </button>
      <span class="divider">|</span>
      <button :class="{ active: sort === 'low' }" @click="updateSort('low')">
        낮은 별점순
      </button>
    </div>
    <select class="filter-select" v-model="filter" @change="emitFilterChange">
      <option value="all">모든 별점 보기</option>
      <option value="5">5점</option>
      <option value="4">4점</option>
      <option value="3">3점</option>
      <option value="2">2점</option>
      <option value="1">1점</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["update:sort", "update:filter"]);

const sort = ref("latest");
const filter = ref("all");

const updateSort = (value) => {
  sort.value = value;
  emit("update:sort", value);
};

const emitFilterChange = () => {
  emit("update:filter", filter.value);
};
</script>

<style scoped>
.review-filter-bar {
  width: 100%;
  max-width: 62.5rem;
  background-color: var(--color-primary-bluegray);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.25rem;
}

.filter-tabs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-tabs button {
  background: none;
  border: none;
  color: var(--color-white);
  font-weight: var(--font-weight-medium);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;

  outline: none;
  box-shadow: none;
  appearance: none;
}

.filter-tabs button.active {
  text-decoration: underline;
  font-weight: var(--font-weight-bold);
  font-size: 1rem;
}

.filter-tabs .divider {
  color: var(--color-white);
  margin: 0 0.25rem;
}

.filter-select {
  font-size: 0.8rem;
  padding: 0.5rem 3rem 0.5rem 0.6rem;
  border-radius: 0.2rem;
  border: none;
  width: 12rem;
  transform: translateX(7px);

  outline: none;
  box-shadow: none;
}
</style>
