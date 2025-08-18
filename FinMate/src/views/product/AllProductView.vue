<template>
  <div class="all-product-view">
    <div class="all-product-navigation-bar">
      <TopNavigationBar />
    </div>
    <div class="all-product-content">
      <!-- 검색 및 필터 컴포넌트 -->
      <div class="search-section">
        <SearchByCondition
          @search="handleSearch"
          @filter-change="handleFilterChange"
        />
      </div>

      <!-- 상품 컨테이너 -->
      <div class="products-section">
        <ProductContainer
          :products="products"
          :loading="loading"
          :error="error"
          :selected-products="selectedProducts"
          :currentSortType="currentSortType"
          :is-logged-in="isLoggedIn"
          @product-select="handleProductSelect"
          @product-detail="handleProductDetail"
          @retry-fetch="fetchProducts"
          @sort-change="handleSortChange"
        />

        <!-- 상품 비교 모달 -->
        <ProductCompareModal
          :is-visible="isCompareModalVisible"
          :selected-products="selectedProducts"
          @close="closeCompareModal"
        />
      </div>

      <!-- 선택된 상품 비교 영역 -->
      <CompareButton
        v-if="selectedProducts.length > 0"
        :selected-products="selectedProducts"
        @compare="handleCompareProducts"
        @remove-product="handleRemoveProduct"
      />
      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import TopNavigationBar from "../../components/allshared/TopNavigationBar.vue";
import FooterComponent from "../../components/allshared/FooterComponent.vue";
import SearchByCondition from "@/components/product/SearchByCondition.vue";
import ProductContainer from "@/components/product/ProductContainer.vue";
import CompareButton from "@/components/product/CompareButton.vue";
import ProductCompareModal from "@/components/product/ProductCompareModal.vue";
import { productService } from "../../api/product/productService";

// Router
const router = useRouter();

// 반응형 데이터
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedProducts = ref([]);
const currentSortType = ref("YIELD_DESC"); // 기본 정렬 방식

// 모달 상태
const isCompareModalVisible = ref(false);

// 필터링 관련 상태
const currentFilters = ref({
  query: "",
  banks: [],
  productTypes: [],
  subCategories: [],
});

// 로그인 여부 확인
const isLoggedIn = computed(() => {
  return !!localStorage.getItem("token");
});

// 컴포넌트 마운트 시 실행
onMounted(() => {
  if (isLoggedIn.value) {
    currentSortType.value = "RECOMMENDED";
  }
  fetchProducts();
});

// 메서드들
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const apiParams = buildApiParams(); // { sortOrder: 'desc' } 포함
    apiParams.sortType = currentSortType.value; // 현재 정렬 방식 추가
    const response = await productService.getFilteredProducts(apiParams);
    products.value = response.data || [];
  } catch (err) {
    error.value =
      err.response?.data?.message || "상품 데이터를 불러오는데 실패했습니다.";
  } finally {
    loading.value = false;
  }
};

const fetchFilteredProducts = async (apiParams) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await productService.getFilteredProducts(apiParams);

    products.value = response.data || [];
  } catch (err) {
    if (err.response?.status === 404) {
      products.value = [];
    } else {
      error.value =
        err.response?.data?.message || "상품을 불러오는데 실패했습니다.";
    }
  } finally {
    loading.value = false;
  }
};

// 검색 처리
const handleSearch = (searchQuery) => {
  currentFilters.value.query = searchQuery;

  // 검색 시 즉시 API 호출
  const apiParams = buildApiParams();
  apiParams.sortType = currentSortType.value;
  if (Object.keys(apiParams).length > 1) {
    fetchFilteredProducts(apiParams);
  } else {
    fetchProducts(); // 필터가 없으면 전체 조회
  }
};

const handleFilterChange = (filterData) => {
  currentFilters.value = { ...filterData };

  // API 파라미터가 있으면 필터링 API 호출, 없으면 전체 조회
  if (filterData.apiParams && Object.keys(filterData.apiParams).length > 0) {
    const apiParamsWithSort = {
      ...filterData.apiParams,
      sortType: currentSortType.value,
    };
    fetchFilteredProducts(apiParamsWithSort);
  } else {
    fetchProducts();
  }
};

// ProductContainer에 이벤트 핸들러 추가
const handleSortChange = (newSortType) => {
  currentSortType.value = newSortType;

  // 현재 필터와 함께 새로운 정렬로 API 재호출
  const apiParams = buildApiParams();
  apiParams.sortType = newSortType;

  if (hasActiveFilters()) {
    fetchFilteredProducts(apiParams);
  } else {
    fetchFilteredProducts({ sortType: newSortType });
  }
};

const hasActiveFilters = () => {
  return (
    currentFilters.value.query?.trim() ||
    currentFilters.value.banks?.length > 0 ||
    currentFilters.value.productTypes?.length > 0 ||
    currentFilters.value.subCategories?.length > 0
  );
};

const buildApiParams = () => {
  const params = {};

  // 검색어
  if (currentFilters.value.query?.trim()) {
    params.query = currentFilters.value.query.trim();
  }

  // 은행명 배열
  if (currentFilters.value.banks?.length > 0) {
    params.bankName = currentFilters.value.banks.map((code) =>
      getBankNameForCode(code)
    );
  }

  // 상품 타입 (첫 번째만)
  if (currentFilters.value.productTypes?.length > 0) {
    params.productType = currentFilters.value.productTypes;
  }

  // 펀드 타입 (FUND 선택 시에만)
  if (
    currentFilters.value.productTypes?.includes("FUND") &&
    currentFilters.value.subCategories?.length > 0
  ) {
    params.fundType = currentFilters.value.subCategories;
  }

  return params;
};

// 은행 코드를 실제 은행명으로 변환
const getBankNameForCode = (bankCode) => {
  const bankMap = {
    KB: "KB국민은행",
    SHINHAN: "신한은행",
    HANA: "하나은행",
    WOORI: "우리은행",
    NH: "NH농협은행",
    IBK: "IBK기업은행",
    KAKAO: "카카오뱅크",
    KBANK: "케이뱅크",
    SC: "SC제일은행",
    TOSS: "토스뱅크",
    BNK: "BNK부산은행",
    IM: "iM뱅크",
  };
  return bankMap[bankCode] || bankCode;
};

const handleProductSelect = (product) => {
  const index = selectedProducts.value.findIndex((p) => p.id === product.id);

  if (index > -1) {
    // 이미 선택된 상품이면 제거
    selectedProducts.value.splice(index, 1);
  } else {
    // 최대 2개까지만 선택 가능
    if (selectedProducts.value.length < 2) {
      selectedProducts.value.push(product);
    } else {
      alert("최대 2개 상품까지 선택할 수 있습니다.");
    }
  }
};

const handleProductDetail = (product) => {
  const routePayload = {
    path: `/product/${product.id}`,
    query: {},
  };

  if (product.productType === "FUND" && product.detail?.riskGrade) {
    const toastType = getToastTypeByRisk(product.detail.riskGrade);

    if (toastType) {
      routePayload.query.showRiskToast = toastType;
    }
  }

  router.push(routePayload);
};

// 비교하기 버튼 클릭 시 모달 열기
const handleCompareProducts = () => {
  if (selectedProducts.value.length == 2) {
    isCompareModalVisible.value = true;
  }
};

// 모달 닫기
const closeCompareModal = () => {
  isCompareModalVisible.value = false;
};

const handleRemoveProduct = (product) => {
  const index = selectedProducts.value.findIndex((p) => p.id === product.id);
  if (index > -1) {
    selectedProducts.value.splice(index, 1);
  }
};

const getToastTypeByRisk = (riskGrade) => {
  if (riskGrade == 6) return "highRisk1";
  if (riskGrade == 5) return "highRisk2";
  if (riskGrade == 4) return "highRisk3";
  return null;
};
</script>

<style scoped>
.all-product-content {
  padding-top: 1vh;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 2vh;
}

.all-product-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.all-product-view::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/backgroundImage/background_main.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.4;
  z-index: -1;
}

.all-product-navigation-bar {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1vh;
}

.all-product-view::-webkit-scrollbar {
  width: 0.5vw;
}

.all-product-view::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0.3vw;
}

.all-product-view::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 0.3vw;
}

.all-product-view::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 검색 섹션 */
.search-section {
  width: 100%;
  max-width: 85vw;
  margin: 0 auto;
  padding: 2vh 2vw 0 2vw;
}

/* 상품 섹션 */
.products-section {
  width: 100%;
  max-width: 85vw;
  margin: 0 auto;
  padding: 2vh 2vw 0 2vw;
  margin-bottom: 8.5vw; /* 비교 버튼 공간 확보 */
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .search-section,
  .products-section {
    max-width: 100%;
    padding-left: 1.8vw;
    padding-right: 1.8vw;
  }
}

@media (max-width: 768px) {
  .search-section {
    padding: 2vh 2vw 0 2vw;
  }

  .products-section {
    padding: 2vh 2vw 0 2vw;
    margin-bottom: 15vh;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 1.5vh 1.5vw 0 1.5vw;
  }

  .products-section {
    padding: 1.5vh 1.5vw 0 1.5vw;
    margin-bottom: 10vh;
  }
}
</style>
