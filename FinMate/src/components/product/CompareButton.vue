<!-- components/product/CompareButton.vue -->
<template>
  <div v-if="selectedProducts.length > 0" class="compare-container">
    <div v-if="selectedProducts.length === 2" class="vs-compare-card">
      <div class="product-compare-section">
        <div class="background-shapes">
          <div class="left-shape"></div>
          <div class="right-shape"></div>
        </div>

        <!-- 첫 번째 상품 -->
        <div class="product-side left-side">
          <div class="product-icon">
            <div class="bank-icon">
              {{ getBankInitial(selectedProducts[0].bankName) }}
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ selectedProducts[0].name }}</h3>
          </div>
        </div>

        <!-- VS 구분선 -->
        <div class="vs-divider">
          <div class="vs-circle">
            <span class="vs-text">vs</span>
          </div>
        </div>

        <!-- 두 번째 상품 -->
        <div class="product-side right-side">
          <div class="product-icon">
            <div class="bank-icon">
              {{ getBankInitial(selectedProducts[1].bankName) }}
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ selectedProducts[1].name }}</h3>
          </div>
        </div>
      </div>

      <!-- 비교하기 버튼 -->
      <div class="compare-button-section">
        <button
          @click="compareProducts"
          class="compare-btn"
          :disabled="isComparing"
        >
          {{ isComparing ? '비교 중...' : '비교하기' }}
        </button>
      </div>
    </div>

    <!-- 1개만 선택된 경우 -->
    <div v-else class="single-selection">
      <div class="selected-product">
        <div class="product-info-simple">
          <div
            class="bank-icon small"
            :class="getBankClass(selectedProducts[0].bankName)"
          >
            {{ getBankInitial(selectedProducts[0].bankName) }}
          </div>
          <span class="product-name-simple">{{
            selectedProducts[0].name
          }}</span>
        </div>
        <div class="selection-guide">
          <p>비교할 상품을 하나 더 선택해주세요</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  selectedProducts: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['compare', 'remove-product']);

const isComparing = ref(false);

// 메서드들
const compareProducts = async () => {
  if (props.selectedProducts.length !== 2) {
    return;
  }

  isComparing.value = true;

  try {
    const [product1, product2] = props.selectedProducts;
    await emit('compare', { product1, product2 });
  } catch (error) {
    console.error('비교 중 오류 발생:', error);
  } finally {
    isComparing.value = false;
  }
};

const getBankClass = (bankName) => {
  return bankName.replace(/\s+/g, '').toLowerCase();
};

const getBankInitial = (bankName) => {
  return bankName.charAt(0);
};
</script>

<style scoped>
.compare-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 40px);
  max-width: 800px;
}

/* VS 비교 카드 (2개 선택 시) */
.vs-compare-card {
  background: transparent;
  border-radius: 16px;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.product-compare-section {
  position: relative;
  height: 120px; /* 세로 간격 줄임 */
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

/* 배경 사각형들 (사선 효과) */
.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left-shape {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #2e404c;
  z-index: 1;
  clip-path: polygon(0 0, 60% 0, 40% 100%, 0 100%); /* 정확히 반반 */
}

.right-shape {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  background: #ffeab4;
  z-index: 1;
  clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%); /* 정확히 반반 */
}

.product-side {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 16px 24px;
  z-index: 2;
}

.left-side {
  left: 0;
  width: 50%; /* 정확히 반반 */
  color: #ffffff;
  justify-content: flex-start;
}

.right-side {
  right: 0;
  width: 50%; /* 정확히 반반 */
  color: #000000;
  justify-content: flex-end;
  text-align: right;
}

.product-icon {
  flex-shrink: 0;
  z-index: 3;
}

.left-side .product-icon {
  margin-right: 12px;
}

.right-side .product-icon {
  order: 2;
  margin-left: 12px;
  margin-right: 0;
}

.bank-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.15);
  color: inherit;
  backdrop-filter: blur(4px);
}

.right-side .bank-icon {
  background: rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
  z-index: 3;
  min-width: 0;
}

.right-side .product-info {
  order: 1;
  text-align: right;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.remove-btn {
  position: absolute;
  top: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.8;
  z-index: 4;
}

.remove-btn.left {
  right: 8px;
}

.remove-btn.right {
  right: 8px;
}

.remove-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.vs-divider {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.vs-circle {
  width: 60px;
  height: 60px;
  background: #dddddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.vs-text {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  text-transform: lowercase;
}

.compare-button-section {
  padding: 12px 24px; /* 세로 간격 줄임 */
  background: #ffffff;
  border-radius: 0 0 16px 16px;
}

.compare-btn {
  width: 100%;
  padding: 12px 24px; /* 버튼 높이 줄임 */
  border: none;
  border-radius: 12px;
  background: #147117;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.compare-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.compare-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 1개 선택 시 */
.single-selection {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.product-info-simple {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.bank-icon.small {
  width: 32px;
  height: 32px;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
}

.product-name-simple {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.remove-btn-simple {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn-simple:hover {
  background: #ffe5e5;
  color: #f44336;
}

.selection-guide {
  text-align: center;
}

.selection-guide p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

/* 반응형 */
@media (max-width: 768px) {
  .compare-container {
    bottom: 10px;
    width: calc(100% - 20px);
    max-width: none;
  }

  .product-compare-section {
    height: 140px;
  }

  .product-side {
    padding: 16px 20px;
  }

  .bank-icon {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }

  .product-name {
    font-size: 16px;
    max-width: 180px;
  }

  .vs-circle {
    width: 70px;
    height: 70px;
  }

  .vs-text {
    font-size: 18px;
  }

  .compare-btn {
    font-size: 14px;
    padding: 12px 20px;
  }
}

@media (max-width: 480px) {
  .product-compare-section {
    height: 120px;
  }

  .product-side {
    padding: 12px 16px;
    width: 42%;
  }

  .product-name {
    font-size: 14px;
    max-width: 140px;
  }

  .bank-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .vs-circle {
    width: 80px;
    height: 80px;
  }

  .vs-text {
    font-size: 16px;
  }

  .compare-button-section {
    padding: 12px 16px;
  }
}
</style>
