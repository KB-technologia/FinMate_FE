<template>
  <TopNavigationBar />
  <div class="all-product-view">
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
        :currentSortOrder="currentSortOrder"
        @product-select="handleProductSelect"
        @product-detail="handleProductDetail"
        @retry-fetch="fetchProducts"
        @sort-change="handleSortChange"
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import FooterComponent from '../../components/allshared/FooterComponent.vue';
import SearchByCondition from '@/components/product/SearchByCondition.vue';
import ProductContainer from '@/components/product/ProductContainer.vue';
import CompareButton from '@/components/product/CompareButton.vue';
import { productService } from '../../api/product/productService';

// Router
const router = useRouter();

// 반응형 데이터
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedProducts = ref([]);
const currentSortOrder = ref('desc');

// 필터링 관련 상태
const currentFilters = ref({
  query: '',
  banks: [],
  productTypes: [],
  subCategories: [],
});

// 컴포넌트 마운트 시 실행
onMounted(() => {
  fetchProducts();
});

// 메서드들
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const apiParams = buildApiParams(); // { sortOrder: 'desc' } 포함
    const response = await productService.getFilteredProducts(apiParams);

    // const response = await productService.getAllProducts();
    products.value = response.data || [];
    console.log('상품 데이터 로드 완료:', products.value.length);
  } catch (err) {
    error.value =
      err.response?.data?.message || '상품 데이터를 불러오는데 실패했습니다.';
    console.error('API Error:', err);
  } finally {
    loading.value = false;
  }
};

const fetchFilteredProducts = async (apiParams) => {
  loading.value = true;
  error.value = null;

  try {
    console.log('필터링 API 호출:', apiParams);
    const response = await productService.getFilteredProducts(apiParams);

    products.value = response.data || [];
    console.log(`필터링 완료: ${products.value.length}개 상품`);
  } catch (err) {
    console.error('필터링 에러:', err);

    if (err.response?.status === 404) {
      // 404는 결과 없음을 의미할 수 있음
      products.value = [];
    } else {
      error.value =
        err.response?.data?.message || '상품을 불러오는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

// 검색 처리
const handleSearch = (searchQuery) => {
  console.log('검색 실행:', searchQuery);
  currentFilters.value.query = searchQuery;

  // 검색 시 즉시 API 호출
  const apiParams = buildApiParams();
  if (Object.keys(apiParams).length > 0) {
    fetchFilteredProducts(apiParams);
  } else {
    fetchProducts(); // 필터가 없으면 전체 조회
  }
};

const handleFilterChange = (filterData) => {
  console.log('필터 변경:', filterData);
  currentFilters.value = { ...filterData };

  // API 파라미터가 있으면 필터링 API 호출, 없으면 전체 조회
  if (filterData.apiParams && Object.keys(filterData.apiParams).length > 0) {
    fetchFilteredProducts(filterData.apiParams);
  } else {
    fetchProducts();
  }
};

// ProductContainer에 이벤트 핸들러 추가
const handleSortChange = (newSortOrder) => {
  currentSortOrder.value = newSortOrder;

  // 현재 필터와 함께 새로운 정렬로 API 재호출
  const apiParams = buildApiParams();
  apiParams.sortOrder = newSortOrder;

  if (Object.keys(apiParams).length > 1) {
    // sortOrder 외에 다른 필터가 있으면
    fetchFilteredProducts(apiParams);
  } else {
    // 필터가 없으면 전체 조회 (sortOrder만 포함)
    fetchFilteredProducts({ sortOrder: newSortOrder });
  }
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
    params.productType = currentFilters.value.productTypes[0];
  }

  // 펀드 타입 (FUND 선택 시에만)
  if (
    currentFilters.value.productTypes?.includes('FUND') &&
    currentFilters.value.subCategories?.length > 0
  ) {
    params.fundType = currentFilters.value.subCategories;
  }

  params.sortOrder = currentSortOrder.value;
  return params;
};

// 은행 코드를 실제 은행명으로 변환
const getBankNameForCode = (bankCode) => {
  const bankMap = {
    KB: 'KB국민은행',
    SHINHAN: '신한은행',
    HANA: '하나은행',
    WOORI: '우리은행',
    NH: 'NH농협은행',
    IBK: 'IBK기업은행',
    KAKAO: '카카오뱅크',
    KBANK: '케이뱅크',
    SC: 'SC제일은행',
    TOSS: '토스뱅크',
    BNK: 'BNK부산은행',
    IM: 'iM뱅크',
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
      alert('최대 2개 상품까지 선택할 수 있습니다.');
    }
  }
};

const handleProductDetail = (product) => {
  // 상품 상세 페이지로 이동
  router.push(`/product/${product.id}`);
};

const handleCompareProducts = async ({ product1, product2 }) => {
  try {
    const response = await productService.compareProducts(
      product1.id,
      product2.id
    );

    alert(
      `${product1.name}과 ${product2.name} 비교 결과:\n\n${response.data.comparisonResult}`
    );

    // 또는 비교 페이지로 이동
    // router.push({
    //   name: 'ProductCompare',
    //   query: {
    //     id1: product1.id,
    //     id2: product2.id,
    //   },
    // });
  } catch (err) {
    console.error('비교 에러:', err);
    alert('상품 비교에 실패했습니다.');
  }
};

const handleRemoveProduct = (product) => {
  const index = selectedProducts.value.findIndex((p) => p.id === product.id);
  if (index > -1) {
    selectedProducts.value.splice(index, 1);
  }
};
</script>

<style scoped>
.all-product-view {
  height: 87vh;
  overflow-y: auto;
  overflow-x: hidden;

  /* scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1; */
}

.all-product-view::-webkit-scrollbar {
  width: 8px;
}

.all-product-view::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.all-product-view::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.all-product-view::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 검색 섹션 */
.search-section {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 24px 0 24px;
}

/* 상품 섹션 */
.products-section {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 24px 24px;
  margin-bottom: 120px; /* 비교 버튼 공간 확보 */
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .search-section,
  .products-section {
    max-width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 768px) {
  .search-section {
    padding: 16px 16px 0 16px;
  }

  .products-section {
    padding: 0 16px 16px 16px;
    margin-bottom: 100px;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 12px 12px 0 12px;
  }

  .products-section {
    padding: 0 12px 12px 12px;
    margin-bottom: 80px;
  }
}
</style>
