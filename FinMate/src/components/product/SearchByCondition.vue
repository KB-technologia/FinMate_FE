<!-- components/product/SearchByCondition.vue -->
<template>
  <div class="search-condition-container">
    <!-- 검색바 -->
    <div class="search-bar-section">
      <div class="search-input-wrapper">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearchInput"
          @keyup.enter="handleSearch"
          placeholder="키워드를 입력하세요"
          class="search-input"
        />
        <button @click="handleSearch" class="search-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 은행 필터 -->
    <div class="bank-filter-section">
      <div class="filter-header">
        <button
          @click="scrollBanks('left')"
          class="scroll-button left"
          :disabled="!canScrollLeft"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="bank-list-container">
          <div ref="bankListRef" class="bank-list" @scroll="handleBankScroll">
            <button
              v-for="bank in bankList"
              :key="bank.code"
              @click="toggleBankFilter(bank.code)"
              :class="[
                'bank-item',
                { active: selectedBanks.includes(bank.code) },
              ]"
            >
              <div class="bank-icon">
                <img
                  :src="getBankImagePath(bank.code)"
                  :alt="bank.name"
                  @error="handleImageError"
                  class="bank-logo"
                />
              </div>
              <span class="bank-name">{{ bank.shortName }}</span>
            </button>
          </div>
        </div>

        <button
          @click="scrollBanks('right')"
          class="scroll-button right"
          :disabled="!canScrollRight"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 상품 타입 필터 -->
    <div class="product-type-section">
      <div class="type-buttons">
        <button
          v-for="type in productTypes"
          :key="type.code"
          @click="toggleProductType(type.code)"
          :class="[
            'type-button',
            { active: selectedProductTypes.includes(type.code) },
          ]"
        >
          <div class="type-icon" :class="type.iconClass">
            {{ type.icon }}
          </div>
          <span class="type-name">{{ type.name }}</span>
        </button>
      </div>
    </div>

    <!-- 세부 카테고리 필터 (적금, 펀드 등 선택했을 때) -->
    <div class="sub-category-section" v-if="showSubCategories">
      <div class="sub-category-list">
        <button
          v-for="category in currentSubCategories"
          :key="category.code"
          @click="toggleSubCategory(category.code)"
          :class="[
            'sub-category-button',
            { active: selectedSubCategories.includes(category.code) },
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 선택된 필터 표시 -->
    <div class="selected-filters" v-if="hasActiveFilters">
      <div class="filter-tags">
        <!-- 은행 필터 태그 -->
        <span
          v-for="bankCode in selectedBanks"
          :key="`bank-${bankCode}`"
          class="filter-tag bank-tag"
        >
          {{ getBankName(bankCode) }}
          <button @click="removeBankFilter(bankCode)" class="remove-tag">
            ×
          </button>
        </span>

        <!-- 상품 타입 태그 -->
        <span
          v-for="typeCode in selectedProductTypes"
          :key="`type-${typeCode}`"
          class="filter-tag type-tag"
        >
          {{ getProductTypeName(typeCode) }}
          <button @click="removeProductType(typeCode)" class="remove-tag">
            ×
          </button>
        </span>

        <!-- 세부 카테고리 태그 -->
        <span
          v-for="subCode in selectedSubCategories"
          :key="`sub-${subCode}`"
          class="filter-tag sub-tag"
        >
          {{ getSubCategoryName(subCode) }}
          <button @click="removeSubCategory(subCode)" class="remove-tag">
            ×
          </button>
        </span>

        <!-- 전체 초기화 버튼 -->
        <button @click="clearAllFilters" class="clear-all-button">
          전체 초기화
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const emit = defineEmits(['search', 'filter-change']);

// 반응형 데이터
const searchQuery = ref('');
const selectedBanks = ref([]);
const selectedProductTypes = ref([]);
const selectedSubCategories = ref([]);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

// 템플릿 참조
const bankListRef = ref(null);

// 은행 목록 데이터
const bankList = [
  { code: 'KB', name: '국민은행', shortName: 'KB국민' },
  { code: 'SHINHAN', name: '신한은행', shortName: '신한' },
  { code: 'HANA', name: '하나은행', shortName: '하나' },
  { code: 'WOORI', name: '우리은행', shortName: '우리' },
  { code: 'NH', name: 'NH농협은행', shortName: 'NH농협' },
  { code: 'IBK', name: 'IBK기업은행', shortName: 'IBK기업' },
  { code: 'KAKAO', name: '카카오뱅크', shortName: '카카오뱅크' },
  { code: 'KBANK', name: '케이뱅크', shortName: '케이뱅크' },
  { code: 'SC', name: 'SC제일은행', shortName: 'SC제일' },
  { code: 'TOSS', name: '토스뱅크', shortName: '토스뱅크' },
  { code: 'BNK', name: '부산은행', shortName: 'BNK부산' },
  { code: 'IM', name: 'iM뱅크', shortName: 'iM뱅크' },
];

// 상품 타입 데이터
const productTypes = [
  { code: 'DEPOSIT', name: '예금', icon: '🐣', iconClass: 'deposit' },
  { code: 'SAVINGS', name: '적금', icon: '🐸', iconClass: 'savings' },
  { code: 'FUND', name: '펀드', icon: '🐰', iconClass: 'fund' },
];

// 세부 카테고리 데이터 - 펀드만 있음
const subCategoriesMap = {
  FUND: [
    { code: 'STOCK', name: '주식형' },
    { code: 'BOND', name: '채권형' },
    { code: 'MIXED_EQUITY_BOND', name: '혼합형' },
    { code: 'REAL_ESTATE', name: '부동산' },
    { code: 'SPECIAL_ASSET', name: '특별자산' },
    { code: 'HYBRID_ASSET', name: '파생상품' },
  ],
};

// Computed
const showSubCategories = computed(() => {
  // 펀드만 세부 카테고리 표시
  return selectedProductTypes.value.includes('FUND');
});

const currentSubCategories = computed(() => {
  const categories = [];
  selectedProductTypes.value.forEach((type) => {
    if (subCategoriesMap[type]) {
      categories.push(...subCategoriesMap[type]);
    }
  });
  return categories;
});

const hasActiveFilters = computed(() => {
  return (
    selectedBanks.value.length > 0 ||
    selectedProductTypes.value.length > 0 ||
    selectedSubCategories.value.length > 0 ||
    searchQuery.value.trim().length > 0
  );
});

// 메서드
const getBankImagePath = (bankCode) => {
  return `/src/assets/images/banks/${bankCode.toLowerCase()}.png`;
};

const handleImageError = (event) => {
  // 이미지 로드 실패 시 기본 이미지 또는 텍스트로 대체
  event.target.style.display = 'none';
  event.target.parentElement.style.backgroundColor = '#f0f0f0';
  event.target.parentElement.innerHTML = event.target.alt.charAt(0);
};

const getBankName = (bankCode) => {
  const bank = bankList.find((b) => b.code === bankCode);
  return bank ? bank.shortName : bankCode;
};

const getProductTypeName = (typeCode) => {
  const type = productTypes.find((t) => t.code === typeCode);
  return type ? type.name : typeCode;
};

const getSubCategoryName = (subCode) => {
  for (const categories of Object.values(subCategoriesMap)) {
    const category = categories.find((c) => c.code === subCode);
    if (category) return category.name;
  }
  return subCode;
};

const handleSearchInput = () => {
  // 입력하는 동안 실시간 검색 (디바운싱 적용 가능)
  emitFilterChange();
};

const handleSearch = () => {
  emit('search', searchQuery.value);
  emitFilterChange();
};

const toggleBankFilter = (bankCode) => {
  const index = selectedBanks.value.indexOf(bankCode);
  if (index > -1) {
    selectedBanks.value.splice(index, 1);
  } else {
    selectedBanks.value.push(bankCode);
  }
  emitFilterChange();
};

const toggleProductType = (typeCode) => {
  const index = selectedProductTypes.value.indexOf(typeCode);
  if (index > -1) {
    selectedProductTypes.value.splice(index, 1);
    // 상품 타입 제거 시 관련 세부 카테고리도 제거
    if (subCategoriesMap[typeCode]) {
      const subCodesToRemove = subCategoriesMap[typeCode].map(
        (sub) => sub.code
      );
      selectedSubCategories.value = selectedSubCategories.value.filter(
        (sub) => !subCodesToRemove.includes(sub)
      );
    }
  } else {
    selectedProductTypes.value.push(typeCode);
  }
  emitFilterChange();
};

const toggleSubCategory = (subCode) => {
  const index = selectedSubCategories.value.indexOf(subCode);
  if (index > -1) {
    selectedSubCategories.value.splice(index, 1);
  } else {
    selectedSubCategories.value.push(subCode);
  }
  emitFilterChange();
};

const removeBankFilter = (bankCode) => {
  const index = selectedBanks.value.indexOf(bankCode);
  if (index > -1) {
    selectedBanks.value.splice(index, 1);
    emitFilterChange();
  }
};

const removeProductType = (typeCode) => {
  toggleProductType(typeCode);
};

const removeSubCategory = (subCode) => {
  const index = selectedSubCategories.value.indexOf(subCode);
  if (index > -1) {
    selectedSubCategories.value.splice(index, 1);
    emitFilterChange();
  }
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedBanks.value = [];
  selectedProductTypes.value = [];
  selectedSubCategories.value = [];
  emitFilterChange();
};

const emitFilterChange = () => {
  const filterData = {
    query: searchQuery.value,
    banks: selectedBanks.value,
    productTypes: selectedProductTypes.value,
    subCategories: selectedSubCategories.value,
    // API 호출을 위한 추가 데이터
    apiParams: buildApiParams(),
  };
  emit('filter-change', filterData);
};

// API 파라미터 구성
const buildApiParams = () => {
  const params = {};

  // 검색어
  if (searchQuery.value?.trim()) {
    params.query = searchQuery.value.trim();
  }

  // 은행명 (코드를 실제 은행명으로 변환)
  if (selectedBanks.value?.length > 0) {
    params.bankName = selectedBanks.value.map((code) => {
      const bank = bankList.find((b) => b.code === code);
      return bank ? bank.name : code;
    });
  }

  // 상품 타입
  if (selectedProductTypes.value?.length > 0) {
    params.productType = selectedProductTypes.value;
  }

  // 펀드 타입
  if (
    selectedProductTypes.value?.includes('FUND') &&
    selectedSubCategories.value?.length > 0
  ) {
    params.fundType = selectedSubCategories.value;
  }

  return params;
};

// 은행 리스트 가로 스크롤
const scrollBanks = (direction) => {
  if (!bankListRef.value) return;

  const scrollAmount = 300;
  const currentScroll = bankListRef.value.scrollLeft;

  if (direction === 'left') {
    bankListRef.value.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: 'smooth',
    });
  } else {
    bankListRef.value.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: 'smooth',
    });
  }
};

const handleBankScroll = () => {
  if (!bankListRef.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = bankListRef.value;
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
};

// 라이프사이클
onMounted(() => {
  nextTick(() => {
    handleBankScroll();
  });
});
</script>

<style scoped>
.search-condition-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* background: var(--color-product-color); */
  border: 0.2vh solid var(--color-light-gray);
  border-radius: 2vh;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}

/* 검색바 */
.search-bar-section {
  margin-bottom: 32px;
}

.search-input-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 16px 60px 16px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 16px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4caf50;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.search-input::placeholder {
  color: #999;
  text-align: center;
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: #4caf50;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #45a049;
  transform: translateY(-50%) scale(1.05);
}

/* 은행 필터 */
.bank-filter-section {
  margin-bottom: 24px;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
}

.scroll-button {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.scroll-button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #4caf50;
  color: #4caf50;
}

.scroll-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.bank-list-container {
  flex: 1;
  overflow: hidden;
}

.bank-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 4px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.bank-list::-webkit-scrollbar {
  display: none;
}

.bank-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 110px;
}

.bank-item:hover {
  border-color: #4caf50;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.bank-item.active {
  border-color: #4caf50;
  background: #f8fff8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.bank-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bank-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bank-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

/* 상품 타입 필터 */
.product-type-section {
  margin-bottom: 24px;
}

.type-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.type-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: 500;
}

.type-button:hover {
  border-color: #4caf50;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
}

.type-button.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.type-icon {
  font-size: 20px;
}

.type-icon.deposit {
  color: #2196f3;
}

.type-icon.savings {
  color: #ff9800;
}

.type-icon.fund {
  color: #9c27b0;
}

.type-button.active .type-icon {
  color: white;
}

/* 세부 카테고리 */
.sub-category-section {
  margin-bottom: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.sub-category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.sub-category-button {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.sub-category-button:hover {
  border-color: #4caf50;
  color: #4caf50;
  background: #f8fff8;
}

.sub-category-button.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
}

/* 선택된 필터 표시 */
.selected-filters {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.filter-tag.bank-tag {
  background: #e8f5e8;
  color: #2e7d32;
}

.filter-tag.type-tag {
  background: #fff3e0;
  color: #f57c00;
}

.filter-tag.sub-tag {
  background: #f3e5f5;
  color: #7b1fa2;
}

.remove-tag {
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  padding: 0;
  margin-left: 4px;
}

.remove-tag:hover {
  opacity: 0.7;
}

.clear-all-button {
  padding: 6px 12px;
  border: 1px solid #ff5722;
  border-radius: 16px;
  background: white;
  color: #ff5722;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-all-button:hover {
  background: #ff5722;
  color: white;
}

/* 반응형 */
@media (max-width: 768px) {
  .search-condition-container {
    padding: 16px;
  }

  .search-input {
    font-size: 14px;
    padding: 14px 50px 14px 20px;
  }

  .search-button {
    width: 36px;
    height: 36px;
    right: 7px;
  }

  .type-buttons {
    flex-direction: column;
    align-items: center;
  }

  .type-button {
    width: 100%;
    max-width: 240px;
    justify-content: center;
  }

  .bank-item {
    min-width: 70px;
  }

  .bank-name {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .search-condition-container {
    padding: 12px;
  }

  .filter-header {
    padding: 12px;
  }

  .bank-item {
    min-width: 60px;
    padding: 8px;
  }

  .bank-icon {
    width: 32px;
    height: 32px;
  }

  .bank-name {
    font-size: 10px;
  }

  .type-button {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
