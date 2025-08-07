<template>
  <div class="favorites-view">
    <div class="favorites-navigation-bar">
      <TopNavigationBar />
    </div>
    <div class="favorites-content">
      <!-- 검색 영역 -->
      <div class="search-section">
        <div class="search-container">
          <input
            type="text"
            placeholder="즐겨찾기한 상품을 검색하세요"
            class="search-input"
            v-model="searchQuery"
            @input="handleSearch"
          />
          <button class="search-button">
            <Search class="search-icon" />
          </button>
        </div>
      </div>

      <!-- 필터 영역 -->
      <div class="filter-section">
        <!-- 상품 유형 필터 -->
        <div class="product-type-filters">
          <button
            v-for="type in productTypes"
            :key="type.id"
            class="type-filter-btn"
            :class="{ active: selectedTypes.includes(type.id) }"
            @click="toggleType(type.id)"
          >
            <component :is="type.icon" class="type-icon" />
            {{ type.name }}
          </button>
        </div>
      </div>

      <!-- 결과 영역 -->
      <div class="results-section">
        <div class="results-header">
          <h2 class="results-title">
            <Heart class="heart-icon" />
            총 {{ filteredProducts.length }}개 즐겨찾기
          </h2>
          <div class="sort-container">
            <label>정렬:</label>
            <select
              v-model="sortBy"
              class="sort-select"
              @change="handleSortChange"
            >
              <option value="interest">수익률 높은순</option>
              <option value="name">상품명순</option>
              <option value="bank">은행명순</option>
            </select>
          </div>
        </div>

        <!-- 상품 목록 -->
        <div class="products-grid" v-if="filteredProducts.length > 0">
          <FavoriteProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @remove-favorite="removeFavorite"
          />
        </div>

        <!-- 빈 상태 -->
        <div v-else class="empty-state">
          <HeartOff class="empty-icon" />
          <h3>즐겨찾기한 상품이 없습니다</h3>
          <p>마음에 드는 금융상품을 즐겨찾기에 추가해보세요!</p>
          <button
            class="browse-products-btn"
            @click="$router.push('/products')"
          >
            상품 둘러보기
          </button>
        </div>
      </div>

      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Search,
  Heart,
  HeartOff,
  Coins,
  CreditCard,
  TrendingUp,
} from 'lucide-vue-next';
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import FooterComponent from '../../components/allshared/FooterComponent.vue';
import FavoriteProductCard from '@/components/product/FavoriteProductCard.vue';
import { productService } from '@/api/product/productService.js';

// 반응형 데이터
const searchQuery = ref('');
const selectedTypes = ref([]);
const sortBy = ref('interest');
const favoriteProducts = ref([]);
const loading = ref(false);
const error = ref(null);

// 상품 유형
const productTypes = ref([
  { id: 'SAVINGS', name: '예금', icon: Coins },
  { id: 'DEPOSIT', name: '적금', icon: CreditCard },
  { id: 'FUND', name: '펀드', icon: TrendingUp },
]);

// 필터링된 상품
const filteredProducts = computed(() => {
  let products = [...favoriteProducts.value];

  // 검색 필터
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    products = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(query) ||
        product.bankName.toLowerCase().includes(query)
    );
  }

  // 상품 유형 필터
  if (selectedTypes.value.length > 0) {
    products = products.filter((product) =>
      selectedTypes.value.includes(product.productType)
    );
  }

  // 정렬
  products.sort((a, b) => {
    switch (sortBy.value) {
      case 'interest':
        return (
          parseFloat(b.maxInterestRate || 0) -
          parseFloat(a.maxInterestRate || 0)
        );
      case 'name':
        return a.productName.localeCompare(b.productName);
      case 'bank':
        return a.bankName.localeCompare(b.bankName);
      default:
        return 0;
    }
  });

  return products;
});

// 메서드
const handleSearch = () => {
  // 검색 로직은 computed에서 처리됨
};

const handleSortChange = () => {
  // 정렬 로직은 computed에서 처리됨
};

const toggleType = (typeId) => {
  const index = selectedTypes.value.indexOf(typeId);
  if (index > -1) {
    selectedTypes.value.splice(index, 1);
  } else {
    selectedTypes.value.push(typeId);
  }
};

const removeFavorite = async (productId) => {
  try {
    await productService.removeFavorite(productId);

    // 로컬에서도 제거 (UI 즉시 업데이트)
    favoriteProducts.value = favoriteProducts.value.filter(
      (product) => product.id !== productId
    );

    console.log('즐겨찾기 제거 성공:', productId);
  } catch (error) {
    console.error('즐겨찾기 제거 실패:', error);

    // 에러 메시지 처리
    if (error.message === '로그인이 필요합니다.') {
      alert('로그인이 필요합니다.');
    } else {
      alert('즐겨찾기 제거에 실패했습니다.');
    }
  }
};

const fetchFavoriteProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await productService.getFavoriteProducts();
    favoriteProducts.value = response.data || [];
    console.log('즐겨찾기 목록 조회 성공:', favoriteProducts.value);
  } catch (err) {
    console.error('즐겨찾기 조회 실패:', err);

    if (err.message === '로그인이 필요합니다.') {
      error.value = '로그인이 필요합니다.';
    } else {
      error.value = '즐겨찾기 목록을 불러오는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchFavoriteProducts();
});
</script>

<style scoped>
.favorites-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.favorites-navigation-bar {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1vh;
  margin-bottom: 1vh;
}

.favorites-content {
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

.favorites-content::-webkit-scrollbar {
  width: 0.5vw;
}

.favorites-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0.3vw;
}

.favorites-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 0.3vw;
}

.favorites-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 검색 영역 */
.search-section {
  width: 100%;
  max-width: 85vw;
  margin: 0 auto;
  padding: 2vh 2vw 0 2vw;
}

.search-container {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 0.5vh 1vw;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e0e0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 1.5vh 2vw;
  font-size: 1rem;
  color: #333;
}

.search-input::placeholder {
  color: #66bb6a;
}

.search-button {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.search-icon {
  color: white;
  width: 20px;
  height: 20px;
}

/* 필터 영역 */
.filter-section {
  width: 100%;
  max-width: 85vw;
  margin: 0 auto;
  padding: 0 2vw;
  background: white;
  border-radius: 20px;
  padding: 3vh 2vw;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.product-type-filters {
  display: flex;
  gap: 1vw;
  justify-content: center;
}

.type-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5vw;
  padding: 1vh 2vw;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.type-filter-btn:hover {
  border-color: #999;
  color: #666;
}

.type-filter-btn.active {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border-color: transparent;
}

.type-icon {
  width: 18px;
  height: 18px;
}

/* 결과 영역 */
.results-section {
  width: 100%;
  max-width: 85vw;
  margin: 0 auto;
  padding: 0 2vw;
  background: white;
  border-radius: 20px;
  padding: 3vh 2vw;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 2vh;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3vh;
  padding-bottom: 2vh;
  border-bottom: 2px solid #e0e0e0;
}

.results-title {
  display: flex;
  align-items: center;
  gap: 1vw;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
}

.heart-icon {
  color: #4caf50;
  fill: #4caf50;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 1vw;
}

.sort-select {
  padding: 0.8vh 1.5vw;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  color: #4caf50;
  font-weight: 500;
}

.sort-select:focus {
  outline: none;
  border-color: #999;
}

/* 상품 그리드 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2vh 2vw;
  width: 100%;
  max-width: 100%;
  justify-items: center;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 5vh 2vw;
  color: #666;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #a5d6a7;
  margin-bottom: 2vh;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 1vh;
  color: #4caf50;
}

.empty-state p {
  margin-bottom: 3vh;
  font-size: 1.1rem;
}

.browse-products-btn {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
  border: none;
  padding: 1.5vh 3vw;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.browse-products-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .search-section,
  .filter-section,
  .results-section {
    max-width: 100%;
    padding-left: 1.8vw;
    padding-right: 1.8vw;
  }
}

@media (max-width: 768px) {
  .search-section,
  .filter-section,
  .results-section {
    padding: 2vh 2vw;
  }

  .results-header {
    flex-direction: column;
    gap: 2vh;
    align-items: flex-start;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-type-filters {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .search-section,
  .filter-section,
  .results-section {
    padding: 1.5vh 1.5vw;
  }
}
</style>
