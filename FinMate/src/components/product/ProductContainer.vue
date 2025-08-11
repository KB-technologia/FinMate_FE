<template>
  <div class="product-container">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">상품을 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">상품을 불러올 수 없습니다</h3>
      <p class="error-message">{{ error }}</p>
      <button @click="retryFetch" class="retry-btn">다시 시도</button>
    </div>

    <!-- 검색 결과 없음 -->
    <div v-else-if="products.length === 0" class="no-results-container">
      <div class="no-results-icon">🔍</div>
      <h3 class="no-results-title">상품이 없습니다</h3>
      <p class="no-results-message">조건을 변경해서 다시 검색해보세요.</p>
    </div>

    <!-- 상품 목록 -->
    <div v-else class="products-content">
      <!-- 상품 수 및 정렬 정보 -->
      <div class="products-header">
        <div class="products-info">
          <h2 class="products-count">총 {{ totalProducts }}개 상품</h2>
          <p v-if="selectedProducts.length > 0" class="selected-count">
            {{ selectedProducts.length }}개 선택됨
          </p>
        </div>

        <div class="sort-controls">
          <label for="sortOrder" class="sort-label">정렬:</label>
          <select
            id="sortOrder"
            :value="currentSortType"
            @change="handleSortChange"
            class="sort-select"
          >
            <option v-if="isLoggedIn" value="RECOMMENDED">추천순</option>
            <option value="YIELD_DESC">수익률 높은순</option>
            <option value="BASE_RATE_DESC">기본금리 높은순</option>
          </select>
        </div>
      </div>

      <!-- 상품 그리드 -->
      <div class="products-grid">
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          :selected-products="selectedProducts"
          @select="handleProductSelect"
          @detail="handleProductDetail"
        />
      </div>

      <!-- 페이지네이션 -->
      <Pagination
        v-if="totalProducts > pageSize"
        :current-page="currentPage"
        :total-items="totalProducts"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ProductCard from './ProductCard.vue';
import Pagination from '../allshared/Pagination.vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  selectedProducts: {
    type: Array,
    default: () => [],
  },
  currentSortType: {
    type: String,
    default: 'YIELD_DESC',
  },

  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'product-select',
  'product-detail',
  'retry-fetch',
  'sort-change',
]);

// 반응형 데이터
const currentPage = ref(1);
const pageSize = ref(12);

// 정렬된 상품 목록
const sortedProducts = computed(() => {
  // let sorted = [...props.products];

  // sorted.sort((a, b) => {
  //   let rateA, rateB;

  //   if (props.currentSortOrder === 'total') {
  //     // 수익률 높은순 (기본+우대)
  //     if (a.productType === 'FUND') {
  //       rateA = a.expectedReturn || 0;
  //     } else {
  //       rateA = (a.expectedReturn || 0) + (a.detail?.bonusRate || 0);
  //     }

  //     if (b.productType === 'FUND') {
  //       rateB = b.expectedReturn || 0;
  //     } else {
  //       rateB = (b.expectedReturn || 0) + (b.detail?.bonusRate || 0);
  //     }
  //   } else {
  //     // 기본금리 높은순
  //     rateA = a.expectedReturn || 0;
  //     rateB = b.expectedReturn || 0;
  //   }

  //   return rateB - rateA; // 높은순만
  // });

  // return sorted;
  return [...props.products];
});

// Computed 속성들
const totalProducts = computed(() => sortedProducts.value.length);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedProducts.value.slice(start, end);
});

// 메서드들
const handleProductSelect = (product) => {
  emit('product-select', product);
};

const handleProductDetail = (product) => {
  emit('product-detail', product);
};

const handlePageChange = (page) => {
  currentPage.value = page;
  // 페이지 변경 시 맨 위로 스크롤
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 1; // 페이지 크기 변경 시 첫 페이지로
};

const handleSortChange = (event) => {
  currentPage.value = 1; // 정렬 변경 시 첫 페이지로

  // 부모 컴포넌트에 정렬 변경 알림
  emit('sort-change', event.target.value);
};

const retryFetch = () => {
  emit('retry-fetch');
};

// products 변경 시 첫 페이지로 이동
watch(
  () => props.products,
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);
</script>

<style scoped>
.product-container {
  width: 100%;
  background: #ffffff;
  min-height: 400px;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 3vw;
  height: 3vw;
  border: 0.3vw solid #f0f0f0;
  border-left: 0.3vw solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5vh;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: clamp(14px, 1.2vw, 18px);
  color: #666;
  margin: 0 0 2.5vh 0;
}

/* 에러 상태 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-icon {
  font-size: 3vw;
  margin-bottom: 1.5vh;
}

.error-title {
  font-size: clamp(18px, 1.8vw, 26px);
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 2.5vh 0;
  line-height: 1.5;
}

.retry-btn {
  padding: 1.2vh 2vw;
  border: none;
  border-radius: 0.8vw;
  background: #4caf50;
  color: white;
  font-size: clamp(12px, 1vw, 15px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

/* 검색 결과 없음 */
.no-results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results-title {
  font-size: clamp(14px, 1.2vw, 26px);
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.no-results-message {
  font-size: clamp(14px, 1.2vw, 18px);
  color: #666;
  margin: 0 0 2.5vh 0;
  line-height: 1.5;
}

/* 상품 콘텐츠 */
.products-content {
  padding: 0;
}

.products-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 0 4px;
}

.products-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.products-count {
  font-size: clamp(18px, 1.8vw, 24px);
  font-weight: 600;
  color: #333;
  margin: 0;
}

.selected-count {
  font-size: clamp(12px, 1vw, 14px);
  color: #4caf50;
  font-weight: 500;
  margin: 0;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.8vw;
}

.sort-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.sort-select {
  padding: 0.8vh 1.2vw;
  border: 0.1vw solid #e0e0e0;
  border-radius: 0.4vw;
  background: #ffffff;
  color: #333;
  font-size: clamp(12px, 1vw, 14px);
  cursor: pointer;
  min-width: 9vw;
}

.sort-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

/* 상품 그리드 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20vw, 1fr));
  gap: 2vw;
  justify-items: center;
  margin-bottom: 4vh;
  max-width: 70vw;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2vw;
}

/* 반응형 */
@media (max-width: 1500px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 1.4vw;
    padding: 0 1.8vw;
  }
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.3vw;
    padding: 0 1.6vw;
  }
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.1vw;
    padding: 0 1.4vw;
  }
}

@media (max-width: 768px) {
  .product-container {
    padding: 0 1.4vw;
  }

  .products-header {
    flex-direction: column;
    gap: 1vw;
    align-items: center;
    margin-bottom: 2vh;
  }

  .products-info {
    text-align: center;
  }

  .products-count {
    font-size: clamp(18px, 1.8vw, 20px);
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1vw;
    margin-bottom: 1.5vw;
    padding: 0 0.8vw;
  }

  .loading-container,
  .error-container,
  .no-results-container {
    padding: 8vh 2vw;
  }

  .error-title,
  .no-results-title {
    font-size: clamp(18px, 1.8vw, 20px);
  }

  .sort-select {
    min-width: 8vw;
    font-size: 13px;
  }
}

@media (max-width: 600px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.8vw;
  }
}

@media (max-width: 480px) {
  .products-header {
    margin-bottom: 1.2vw;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1vw;
    margin-bottom: 1.2vw;
    padding: 0 0.5vw;
  }

  .sort-select {
    min-width: 6vw;
  }

  .loading-container,
  .error-container,
  .no-results-container {
    padding: 4vw 1vw;
  }

  .error-icon,
  .no-results-icon {
    font-size: 2.5vw;
  }

  .error-title,
  .no-results-title {
    font-size: clamp(18px, 1.8vw, 18px);
  }

  .error-message,
  .no-results-message {
    font-size: clamp(14px, 1.2vw, 18px);
  }
}
</style>
