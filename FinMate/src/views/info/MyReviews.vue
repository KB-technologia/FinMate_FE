<template>
  <div class="my-reviews-page">
    <TopNavigationBar />
    <div class="mypage-container">
      <Sidebar />
      <RightPanel :scroll="true" class="stats-right-panel">
        <div class="panel-inner">
          <div class="my-reviews-header">
            <h1 class="title">My Review</h1>
            <CategoryFilterBar
              v-model="selectedCategory"
              :categories="categories"
            />
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

          <div class="review-list">
            <ReviewCard
              v-for="(review, index) in paginatedReviews"
              :key="index"
              :username="review.username"
              :rating="review.rating"
              :date="review.date"
              :content="review.content"
              :showDelete="true"
              @delete="handleDelete(index)"
              class="card-wrapper"
            />
            <p v-if="filteredReviews.length === 0" class="no-review-message">
              작성한 리뷰가 없습니다.
            </p>
            <Pagination
              v-if="filteredReviews.length > 0"
              :current-page="currentPage"
              :total-items="filteredReviews.length"
              :page-size="pageSize"
              @page-change="(page) => (currentPage = page)"
            />
          </div>
        </div>
      </RightPanel>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ChevronDown } from "lucide-vue-next";

import Sidebar from "@/components/info/Sidebar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import Pagination from "@/components/allshared/Pagination.vue";
import CategoryFilterBar from "@/components/info/CategoryFilterBar.vue";
import ReviewCard from "@/components/review/ReviewCard.vue";

const selectedSort = ref("all");
const selectedCategory = ref("all");

const categories = [
  { label: "전체", value: "all" },
  { label: "예금", value: "deposit" },
  { label: "적금", value: "saving" },
  { label: "펀드", value: "fund" },
];

const currentPage = ref(1);
const pageSize = 4;

// TODO: API 연동하기
const mockReviews = ref([
  {
    id: 1,
    username: "홍길동",
    rating: 4.5,
    date: "2025-07-26",
    content: "금리가 생각보다 높고, 가입 절차도 간편해서 좋았어요.",
    category: "deposit",
  },
  {
    id: 1,
    username: "홍길동",
    rating: 2.0,
    date: "2025-07-16",
    content: "금리가 생각보다 높고, 가입 절차도 간편해서 좋았어요.",
    category: "deposit",
  },
]);

const filteredReviews = computed(() => {
  let result = [...mockReviews.value];

  if (selectedCategory.value !== "all") {
    result = result.filter((r) => r.category === selectedCategory.value);
  }

  if (selectedSort.value === "latest") {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (selectedSort.value === "high") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (selectedSort.value === "low") {
    result.sort((a, b) => a.rating - b.rating);
  }

  return result;
});

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredReviews.value.slice(start, start + pageSize);
});
</script>

<style scoped>
.my-reviews-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.mypage-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  align-items: flex-start;
}

.stats-right-panel {
  padding: 2rem;
}

.panel-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
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
  width: 1rem;
  height: 1rem;
  color: var(--color-dark-gray);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;
  align-items: center;

  min-height: 50vh;
  justify-content: space-between;
}

.card-wrapper {
  width: 90%;
  max-width: 60rem;
}

.no-review-message {
  margin-top: 8rem;
  font-size: 1.5rem;
  color: var(--color-dark-gray);
  text-align: center;
}
</style>
