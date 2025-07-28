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
      </RightPanel>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "@/components/info/Sidebar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";

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
  max-width: 750px;
  border: none;
}

.category-tab-bar {
  display: flex;
  width: 100%;
  border-radius: 4px;
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
  border-right: 1px solid var(--color-white);
}

.category-tab-bar button.active {
  background-color: var(--color-primary-yellow);
  color: var(--color-black);
  font-weight: var(--font-weight-bold);
}
</style>
