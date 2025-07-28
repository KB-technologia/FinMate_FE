<template>
  <div class="my-reviews-page">
    <TopNavigationBar />
    <div class="main-content">
      <Sidebar />
      <RightPanel>
        <div class="my-reviews-header">
          <h1 class="title">My Review</h1>
          <div class="category-tab-bar-container">
            <div class="category-tab-bar">
              <button
                v-for="type in categories"
                :key="type.value"
                :class="{ active: selectedCategory === type.value }"
                @click="selectedCategory = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="review-sort-bar">
          <div class="select-wrapper">
            <select v-model="selectedSort">
              <option value="all">전체보기</option>
              <option value="latest">최신순</option>
              <option value="high">높은 별점순</option>
              <option value="low">낮은 별점순</option>
            </select>
            <ChevronDown class="select-icon" />
          </div>
        </div>
      </RightPanel>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ChevronDown } from "lucide-vue-next";

import Sidebar from "@/components/info/Sidebar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";

const selectedSort = ref("all");
const selectedCategory = ref("all");

const categories = [
  { label: "전체", value: "all" },
  { label: "예금", value: "deposit" },
  { label: "적금", value: "saving" },
  { label: "펀드", value: "fund" },
];
</script>

<style scoped>
.my-reviews-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.my-reviews-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title {
  font-size: 2.2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
  text-align: center;
}

.category-tab-bar-container {
  width: 100%;
  max-width: 47rem;
  border: none;
}

.category-tab-bar {
  display: flex;
  width: 100%;
  border-radius: 0.25rem;
  overflow: hidden;
}

.category-tab-bar button {
  flex: 1;
  padding: 0.8rem 0;
  font-size: 1rem;
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border: none;
  transition: background-color 0.2s ease;
  border-right: 0.0625rem solid var(--color-white);
}

.category-tab-bar button.active {
  background-color: var(--color-primary-yellow);
  color: var(--color-black);
  font-weight: var(--font-weight-bold);
}

.review-sort-bar {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
}

.select-wrapper {
  position: relative;
  display: inline-block;
}

.select-wrapper select {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 2.5rem;
  border: 0.0625rem solid var(--color-dark-gray);
  color: var(--color-black);
  background-color: var(--color-white);
  appearance: none;
  text-align: center;

  outline: none;
  box-shadow: none;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  width: 1rem;
  height: 1rem;
  color: var(--color-dark-gray);
}
</style>
