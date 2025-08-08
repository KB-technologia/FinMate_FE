<template>
  <div class="product-page">
    <TopNavigationBar />

    <div class="product-page-container">
      <div class="scrollable-content">
        <div class="product-card-wrapper">
          <component
            v-if="transformedProduct && transformedProduct.productType"
            :is="getProductComponent(transformedProduct.productType)"
            :product="transformedProduct"
            :is-favorite="isFavorite"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
        <div class="divider">&nbsp;</div>
        <div class="rating-row">
          <h1 class="review-title">Product Review</h1>
          <div class="rating-detail-wrapper">
            <StarRatingWithDetail
              :rating="averageRating"
              :count="reviews.length"
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
            :product-name="product?.name || ''"
            :product-image-url="logoPath"
            @submit="handleReviewSubmit"
            @close="isReviewModalOpen = false"
          />
          <RatingDetailModal
            v-if="isRatingDetailOpen"
            :total-score="averageRating"
            :rating-data="ratingDistribution"
            :review-count="reviews.length"
            @close="isRatingDetailOpen = false"
          />
        </div>
        <ReviewFilterBar
          @update:sort="handleSortChange"
          @update:filter="handleFilterChange"
        />
        <div class="review-list">
          <ReviewCard
            v-for="review in paginatedReviews"
            :key="review.id"
            :username="review.writer"
            :rating="Number(review.rating)"
            :date="formatDate(review.createdAt)"
            :content="review.content"
          />
        </div>
        <Pagination
          :current-page="currentPage"
          :total-items="filteredAndSortedReviews.length"
          :page-size="pageSize"
          @page-change="handlePageChange"
        />
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { Pencil } from 'lucide-vue-next';

import { getBankLogoPath } from '@/utils/bank';

import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import FooterComponent from '@/components/allshared/FooterComponent.vue';
import ProductDetailCardFund from '@/components/product/ProductDetailCardFund.vue';
import ProductDetailCardDeposit from '@/components/product/ProductDetailCardDeposit.vue';
import ProductDetailCardSavings from '@/components/product/ProductDetailCardSavings.vue';
import StarRatingWithDetail from '@/components/allshared/star/StarRatingWithDetail.vue';
import ReviewFilterBar from '@/components/review/ReviewFilterBar.vue';
import ReviewCard from '@/components/review/ReviewCard.vue';
import Pagination from '@/components/allshared/Pagination.vue';
import WriteReviewModal from '@/components/review/WriteReviewModal.vue';
import RatingDetailModal from '@/components/review/RatingDetailModal.vue';
import { productService } from '@/api/product/productService';

const route = useRoute();

const product = ref(null);
const reviews = ref([]);
const isFavorite = ref(false);

const filter = ref('all');
const sort = ref('latest');
const currentPage = ref(1);
const pageSize = 5;

const getProductComponent = (productType) => {
  const componentMap = {
    DEPOSIT: ProductDetailCardDeposit,
    SAVINGS: ProductDetailCardSavings,
    FUND: ProductDetailCardFund,
  };
  return componentMap[productType] || ProductDetailCardFund;
};

const transformedProduct = computed(() => {
  if (!product.value) return null;

  const base = {
    id: product.value.id,
    name: product.value.name,
    bankName: product.value.bankName,
    productType: product.value.productType,
    expectedReturn: product.value.expectedReturn,
    riskLevel: product.value.riskLevel,
    valueTag: product.value.valueTag,
    speedTag: product.value.speedTag,
    strategyTag: product.value.strategyTag,
    description: product.value.description,
    url: product.value.url,
    detail: {
      minAmount: product.value.minAmount,
      maxAmount: product.value.maxAmount,
      minTerm: product.value.minTerm,
      maxTerm: product.value.maxTerm,

      bonusRate: product.value.detail?.bonusRate || 0,
      defaultTermMonths:
        product.value.detail?.defaultTermMonths || product.value.minTerm,
      interestType: product.value.detail?.interestType || 'SIMPLE',
      compoundingPeriod: product.value.detail?.compoundingPeriod || 'MONTHLY',
      earlyWithdrawalPenalty: product.value.detail?.earlyWithdrawalPenalty || 0,
      isFlexible: product.value.detail?.isFlexible || false,
    },
  };

  // 적금의 경우 추가 필드
  if (product.value.productType === 'SAVINGS') {
    base.detail.paymentCycle = product.value.detail?.paymentCycle || 'MONTHLY';
    base.detail.maxMonthlyPayment =
      product.value.detail?.maxMonthlyPayment || product.value.maxAmount;
  }

  return base;
});

const logoPath = computed(() => {
  return product.value ? getBankLogoPath(product.value.bankName) : '';
});

// 평균 평점 계산 (데이터베이스 구조에 맞춤)
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce(
    (sum, review) => sum + parseFloat(review.rating),
    0
  );
  return Math.round((total / reviews.value.length) * 10) / 10;
});

// 평점 분포 계산 (1~5점)
const ratingDistribution = computed(() => {
  const distribution = [0, 0, 0, 0, 0]; // 1점, 2점, 3점, 4점, 5점
  reviews.value.forEach((review) => {
    const rating = Math.floor(parseFloat(review.rating));
    if (rating >= 1 && rating <= 5) {
      distribution[rating - 1]++;
    }
  });
  return distribution;
});

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
  let filteredReviews = [...reviews.value];

  if (filter.value !== 'all') {
    const ratingFilter = parseInt(filter.value);
    filteredReviews = filteredReviews.filter(
      (r) => Number(r.rating) === ratingFilter
    );
  }

  if (sort.value === 'latest') {
    return filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort.value === 'high') {
    return filteredReviews.sort((a, b) => b.rating - a.rating);
  } else if (sort.value === 'low') {
    return filteredReviews.sort((a, b) => a.rating - b.rating);
  }
  return filteredReviews;
});

// 페이지네이션된 리뷰
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredAndSortedReviews.value.slice(start, end);
});

// 날짜 포맷 함수 (데이터베이스 DATETIME 형식 처리)
const formatDate = (dateString) => {
  try {
    if (Array.isArray(dateString) && dateString.length >= 3) {
      // [2025, 7, 28, 22, 0, 28] 형태
      const [year, month, day] = dateString;
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(
        2,
        '0'
      )}`;
    }

    if (typeof dateString === 'string') {
      // ISO 문자열 또는 MySQL DATETIME 형태
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}.${String(date.getDate()).padStart(2, '0')}`;
      }
    }

    return '날짜 없음';
  } catch (error) {
    console.error('Date formatting error:', error);
    return '날짜 없음';
  }
};

// 즐겨찾기 토글 처리 함수
const handleToggleFavorite = async () => {
  try {
    const productId = route.params.id;

    if (isFavorite.value) {
      // 즐겨찾기 제거
      await productService.removeFavorite(productId);
      isFavorite.value = false;
    } else {
      // 즐겨찾기 추가
      await productService.addToFavorite(productId);
      isFavorite.value = true;
    }
  } catch (error) {
    // 에러 메시지 처리
    if (error.message === '로그인이 필요합니다.') {
      alert('로그인이 필요합니다.');
    } else {
      alert('즐겨찾기 처리에 실패했습니다.');
    }
  }
};

// 즐겨찾기 상태 확인 함수
const checkFavoriteStatus = async () => {
  try {
    const productId = route.params.id;
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('토큰이 없음');
      isFavorite.value = false;
      return;
    }

    const response = await productService.getFavoriteProducts();
    const favoriteItems = response.data || [];

    const isInFavorites = favoriteItems.some((favoriteItem) =>
      favoriteItem.productDTOList?.some(
        (product) => product.id.toString() === productId.toString()
      )
    );

    isFavorite.value = isInFavorites;
  } catch (error) {
    console.error('에러 발생:', error);
    isFavorite.value = false;
  }
};

// 즐겨찾기 토글 처리 함수
const handleToggleFavorite = async () => {
  try {
    const productId = route.params.id;

    if (isFavorite.value) {
      // 즐겨찾기 제거
      await productService.removeFavorite(productId);
      isFavorite.value = false;
    } else {
      // 즐겨찾기 추가
      await productService.addToFavorite(productId);
      isFavorite.value = true;
    }
  } catch (error) {
    // 에러 메시지 처리
    if (error.message === '로그인이 필요합니다.') {
      alert('로그인이 필요합니다.');
    } else {
      alert('즐겨찾기 처리에 실패했습니다.');
    }
  }
};

// 즐겨찾기 상태 확인 함수
const checkFavoriteStatus = async () => {
  try {
    const productId = route.params.id;
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('토큰이 없음');
      isFavorite.value = false;
      return;
    }

    const response = await productService.getFavoriteProducts();
    const favoriteItems = response.data || [];

    const isInFavorites = favoriteItems.some((favoriteItem) =>
      favoriteItem.productDTOList?.some(
        (product) => product.id.toString() === productId.toString()
      )
    );

    isFavorite.value = isInFavorites;
  } catch (error) {
    console.error('에러 발생:', error);
    isFavorite.value = false;
  }
};

// 데이터 로딩 함수
const loadProductData = async () => {
  try {
    const productId = route.params.id;

    // 상품 상세 정보와 리뷰를 병렬로 가져오기
    const [productResponse, reviewsResponse] = await Promise.all([
      productService.getProductDetails(productId),
      productService.getProductReviews(productId),
    ]);

    product.value = productResponse.data;
    reviews.value = Array.isArray(reviewsResponse.data)
      ? reviewsResponse.data
      : [];

    // 즐겨찾기 상태 확인
    await checkFavoriteStatus();
  } catch (err) {
    console.error('데이터 로딩 중 오류 발생:', err);
  }
};

const handleFilterChange = (value) => {
  filter.value = value;
};

const handleSortChange = (value) => {
  sort.value = value;
};

const handleReviewSubmit = async (reviewData) => {
  // 리뷰 제출 후 리뷰 목록 새로고침
  try {
    // 리뷰 POST API 호출
    const test = productService.submitReview(route.params.id, reviewData);

    // 리뷰 목록 새로고침
    const reviewsResponse = await productService.getProductReviews(
      route.params.id
    );
    reviews.value = Array.isArray(reviewsResponse.data)
      ? reviewsResponse.data
      : [];

    isReviewModalOpen.value = false;
  } catch (err) {
    console.error('리뷰 제출 중 오류 발생:', err);
  }
};

onMounted(() => {
  loadProductData();
});
</script>

<style scoped>
.product-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.product-page-container {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.scrollable-content {
  height: 100vh;
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
  height: 0.06rem;
  background-color: black;
  position: relative;
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
