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
              <img
                :src="getBankLogo(selectedProducts[0].bankName)"
                :alt="selectedProducts[0].bankName"
                @error="
                  (e) => handleImageError(e, selectedProducts[0].bankName)
                "
                class="bank-logo"
              />
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
              <img
                :src="getBankLogo(selectedProducts[1].bankName)"
                :alt="selectedProducts[1].bankName"
                @error="
                  (e) => handleImageError(e, selectedProducts[1].bankName)
                "
                class="bank-logo"
              />
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
            <img
              :src="getBankLogo(selectedProducts[0].bankName)"
              :alt="selectedProducts[0].bankName"
              @error="(e) => handleImageError(e, selectedProducts[0].bankName)"
              class="bank-logo small-logo"
            />
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

const getBankLogo = (bankName) => {
  const bankLogos = {
    국민은행: '/src/assets/images/banks/kb.png',
    KB증권: '/src/assets/images/banks/kb.png',
    케이비자산운용: '/src/assets/images/banks/kb.png',

    신한은행: '/src/assets/images/banks/shinhan.png',
    신한투자증권: '/src/assets/images/banks/shinhan.png',
    제주은행: '/src/assets/images/banks/shinhan.png',

    하나은행: '/src/assets/images/banks/hana.png',
    하나증권: '/src/assets/images/banks/hana.png',
    하나자산운용: '/src/assets/images/banks/hana.png',

    우리은행: '/src/assets/images/banks/woori.png',
    우리투자증권: '/src/assets/images/banks/woori.png',

    농협은행: '/src/assets/images/banks/nh.png',
    NH농협은행: '/src/assets/images/banks/nh.png',
    NH투자증권: '/src/assets/images/banks/nh.png',

    IBK기업은행: '/src/assets/images/banks/ibk.png',
    IBK투자증권: '/src/assets/images/banks/ibk.png',
    아이비케이투자증권: '/src/assets/images/banks/ibk.png',
    아이비케이기업은행: '/src/assets/images/banks/ibk.png',

    카카오뱅크: '/src/assets/images/banks/kakao.png',
    케이뱅크: '/src/assets/images/banks/kbank.png',
    SC제일은행: '/src/assets/images/banks/sc.png',

    토스뱅크: '/src/assets/images/banks/toss.png',
    토스증권: '/src/assets/images/banks/toss.png',

    BNK부산은행: '/src/assets/images/banks/bnk.png',
    부산은행: '/src/assets/images/banks/bnk.png',
    iM뱅크: '/src/assets/images/banks/im.png',
  };
  return bankLogos[bankName] || '/src/assets/images/banks/default.png';
};

const handleImageError = (event, bankName) => {
  const bankIcon = event.target.parentElement;
  event.target.style.display = 'none';
  bankIcon.style.backgroundColor = '#f0f0f0';
  bankIcon.style.color = '#666';
  bankIcon.style.display = 'flex';
  bankIcon.style.alignItems = 'center';
  bankIcon.style.justifyContent = 'center';
  bankIcon.style.fontSize = '1.2vw';
  bankIcon.style.fontWeight = 700;
  bankIcon.textContent = bankName.charAt(0);
};
</script>

<style scoped>
.compare-container {
  position: fixed;
  bottom: 2vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 4vw);
  max-width: 46vw;
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
  height: 12vh;
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
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  color: inherit;
  backdrop-filter: blur(4px);
  overflow: hidden;
}

.right-side .bank-icon {
  background: rgba(0, 0, 0, 0.1);
}

.bank-logo {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 원형에 맞게 조정 */
}

.bank-logo.small-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  font-size: 1rem;
  font-weight: 700;
  margin: 0.1rem 0.6rem 0.1rem 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vs-divider {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.vs-circle {
  width: 3.5vw;
  height: 3.5vw;
  background: #dddddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.4vh 1.2vw rgba(0, 0, 0, 0.15);
}

.vs-text {
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 700;
  color: #1f2937;
  text-transform: lowercase;
}

.compare-button-section {
  padding: 1vh 2vw;
  background: #ffffff;
  border-radius: 0 0 1.2vw 1.2vw;
}

.compare-btn {
  width: 100%;
  padding: 1.2vh 2vw;
  border: none;
  border-radius: 0.8vw;
  background: #147117;
  color: white;
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.compare-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 0.6vh 2vw rgba(76, 175, 80, 0.3);
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
  border: 0.1vw solid #e0e0e0;
  border-radius: 1.2vw;
  padding: 3vh 1.2vw;
  box-shadow: 0 0.4vh 1.6vw rgba(0, 0, 0, 0.1);
}

.product-info-simple {
  display: flex;
  align-items: center;
  gap: 1vh;
  margin-bottom: 1.2vh;
}

.bank-icon.small {
  width: 2.2vw;
  height: 2.2vw;
  background: #f5f5f5;
  color: #666;
}

.product-name-simple {
  flex: 1;
  font-size: clamp(12px, 1vw, 16px);
  font-weight: 600;
  color: #333;
}

.selection-guide {
  text-align: center;
}

.selection-guide p {
  margin: 0;
  font-size: clamp(11px, 1vw, 15px);
  color: #666;
}

/* 반응형 */
@media (max-width: 768px) {
  .compare-container {
    bottom: 1vh;
    width: calc(100% - 2.5vw);
    max-width: none;
  }

  .product-compare-section {
    height: 15vh;
  }

  .product-side {
    padding: 1.5vh 2vw;
  }

  .bank-icon {
    width: 5vw;
    height: 5vw;
    font-size: clamp(16px, 2.3vw, 20px);
  }

  .product-name {
    font-size: clamp(14px, 2vw, 18px);
    max-width: 22vw;
  }

  .vs-circle {
    width: 8.5vw;
    height: 8.5vw;
  }

  .vs-text {
    font-size: clamp(14px, 7.5vw, 20px);
  }

  .compare-btn {
    font-size: clamp(12px, 1.8vw, 16px);
    padding: 1.5vh 2.5vw;
  }
}

@media (max-width: 480px) {
  .product-compare-section {
    height: 13vh;
  }

  .product-side {
    padding: 1.2vh 2vw;
    width: 42%;
  }

  .product-name {
    font-size: clamp(12px, 3vw, 16px);
    max-width: 25vw;
  }

  .bank-icon {
    width: 3vw;
    height: 3vw;
    font-size: 1vw;
  }

  .vs-circle {
    width: 12vw;
    height: 12vw;
  }

  .vs-text {
    font-size: clamp(14px, 3vw, 18px);
  }

  .compare-button-section {
    padding: 1.2vh 2vw;
  }
}
</style>
