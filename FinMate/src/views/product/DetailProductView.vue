<template>
  <TopNavigationBar />

  <div class="product-page-container">
    <div class="scrollable-content">
      <div class="product-card-wrapper">
        <ProductDetailCard :product="mockProduct" />
      </div>
      <div class="divider" />
      <div class="rating-row">
        <h1 class="review-title">Product Review</h1>
        <div class="rating-detail-wrapper">
          <StarRatingWithDetail
            :rating="4.5"
            :count="9"
            size="3rem"
            @open-detail="openRatingDetailModal"
          />
          <button class="write-review-button" @click="openReviewModal">
            <Pencil class="icon" />
            리뷰 작성하기
          </button>
        </div>
        <WriteReviewModal
          v-if="isReviewModalOpen"
          :product-name="mockProduct.name"
          :product-image-url="logoPath"
          @submit="handleReviewSubmit"
          @close="isReviewModalOpen = false"
        />
        <RatingDetailModal
          v-if="isRatingDetailOpen"
          :total-score="3.5"
          :rating-data="[30, 60, 10, 90, 20]"
          :review-count="4"
          @close="isRatingDetailOpen = false"
        />
      </div>
      <ReviewFilterBar
        @update:sort="handleSortChange"
        @update:filter="handleFilterChange"
      />
      <div class="review-list">
        <ReviewCard
          v-for="(review, index) in filteredAndSortedReviews"
          :key="index"
          :username="review.username"
          :rating="review.rating"
          :date="review.date"
          :content="review.content"
        />
      </div>
      <Pagination
        :current-page="currentPage"
        :total-items="mockReviews.length"
        :page-size="pageSize"
        @page-change="handlePageChange"
      />
      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { Pencil } from "lucide-vue-next";

import { getBankLogoPath } from "@/utils/bank";

import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import FooterComponent from "@/components/allshared/FooterComponent.vue";
import ProductDetailCard from "@/components/product/ProductDetailCard.vue";
import StarRatingWithDetail from "@/components/allshared/star/StarRatingWithDetail.vue";
import ReviewFilterBar from "@/components/review/ReviewFilterBar.vue";
import ReviewCard from "@/components/review/ReviewCard.vue";
import Pagination from "@/components/allshared/Pagination.vue";
import WriteReviewModal from "@/components/review/WriteReviewModal.vue";
import RatingDetailModal from "@/components/review/RatingDetailModal.vue";

// TODO: API 연동(테스트용 mock 데이터)
const mockProduct = {
  id: 1,
  name: "국민 퍼스트 예금1",
  bankName: "KB국민은행",
  productType: "DEPOSIT",
  expectedReturn: 1.8,
  riskLevel: 1,
  detail: {
    bonusRate: 1.0,
    minTerm: 12,
    minAmount: 1000000,
    defaultTermMonths: 12,
    interestType: "SIMPLE",
    compoundingPeriod: "MONTHLY",
    earlyWithdrawalPenalty: 0.5,
    isFlexible: false,
  },
};

const mockReviews = [
  {
    username: "홍길동",
    rating: 5,
    date: "2025.07.24",
    content: "금리가 높아서 짧은 기간에도 이자 수익이 꽤 나왔어요!",
  },
  {
    username: "김길동",
    rating: 4,
    date: "2025.07.20",
    content: "가입도 쉽고 모바일로 관리하기도 편했어요.",
  },
  {
    username: "박길동",
    rating: 1.5,
    date: "2025.06.20",
    content: "뭔가 제가 생각한 것보단 별로였어요",
  },
];

const filter = ref("all");
const sort = ref("latest");
const currentPage = ref(1);
const pageSize = 5;
const logoPath = getBankLogoPath(mockProduct.bankName);

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const isReviewModalOpen = ref(false);
const isRatingDetailOpen = ref(false);

const openReviewModal = () => {
  isRatingDetailOpen.value = false;
  isReviewModalOpen.value = true;
};

const openRatingDetailModal = () => {
  isReviewModalOpen.value = false;
  isRatingDetailOpen.value = true;
};

const filteredAndSortedReviews = computed(() => {
  let reviews = [...mockReviews];

  if (filter.value !== "all") {
    const ratingFilter = parseInt(filter.value);
    reviews = reviews.filter((r) => Math.floor(r.rating) === ratingFilter);
  }

  if (sort.value === "latest") {
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort.value === "high") {
    return reviews.sort((a, b) => b.rating - a.rating);
  } else if (sort.value === "low") {
    return reviews.sort((a, b) => a.rating - b.rating);
  }
  return reviews;
});

const handleFilterChange = (value) => {
  filter.value = value;
};

const handleSortChange = (value) => {
  sort.value = value;
};
</script>

<style scoped>
.product-page-container {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scrollable-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(1rem, 4vw, 2rem);
  gap: clamp(1rem, 4vh, 2rem);
}

.product-card-wrapper {
  width: 100%;
  max-width: 62.5rem;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
}

.divider {
  width: 100%;
  max-width: 62.5rem;
  height: 0.0625rem;
  background-color: var(--color-dark-gray);
  margin: 1rem 0;
}

.rating-row {
  width: 100%;
  max-width: 62.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-title {
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-black);
  text-align: center;
  margin: 0 auto 3.5rem auto;
  white-space: nowrap;
}

.review-list {
  width: 100%;
  max-width: 62.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;
}

.rating-detail-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
}

.write-review-button {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-black);
  text-decoration: underline;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.write-review-button:hover {
  color: var(--color-orange);
}

.icon {
  width: 1.3rem;
  height: 1.2rem;
}

:deep(.star-rating) {
  align-self: flex-start;
}

:deep(.star-icon) {
  font-size: 3rem;
}
</style>
