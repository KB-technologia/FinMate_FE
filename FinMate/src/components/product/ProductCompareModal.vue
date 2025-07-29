<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h2 class="modal-title">상품 비교</h2>
          <button @click="closeModal" class="close-button">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 모달 바디 -->
        <div class="modal-body">
          <!-- CompareButton의 UI 부분 재사용 -->
          <div class="compare-container">
            <div class="vs-compare-card">
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
                        :src="getBankImagePath(selectedProducts[0].bankName)"
                        :alt="selectedProducts[0].bankName"
                        @error="
                          (e) =>
                            handleImageError(e, selectedProducts[0].bankName)
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
                        :src="getBankImagePath(selectedProducts[1].bankName)"
                        :alt="selectedProducts[1].bankName"
                        @error="
                          (e) =>
                            handleImageError(e, selectedProducts[1].bankName)
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
            </div>
          </div>

          <!-- 상세 비교 내용 -->
          <div class="comparison-details">
            <div class="comparison-grid">
              <!-- 기본 정보 비교 -->
              <div class="comparison-section">
                <h3 class="section-title">기본 정보</h3>
                <div class="comparison-table">
                  <div class="comparison-row">
                    <div class="comparison-label">은행</div>
                    <div class="comparison-value left">
                      {{ selectedProducts[0].bankName }}
                    </div>
                    <div class="comparison-value right">
                      {{ selectedProducts[1].bankName }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">상품 유형</div>
                    <div class="comparison-value left">
                      {{ getTypeLabel(selectedProducts[0].productType) }}
                    </div>
                    <div class="comparison-value right">
                      {{ getTypeLabel(selectedProducts[1].productType) }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">수익률/금리</div>
                    <div class="comparison-value left highlight">
                      {{
                        formatRate(
                          selectedProducts[0].expectedReturn +
                            (selectedProducts[0].detail?.bonusRate || 0)
                        )
                      }}%
                    </div>
                    <div class="comparison-value right highlight">
                      {{
                        formatRate(
                          selectedProducts[1].expectedReturn +
                            (selectedProducts[1].detail?.bonusRate || 0)
                        )
                      }}%
                    </div>
                  </div>
                </div>
              </div>

              <!-- 상세 정보 비교 -->
              <div class="comparison-section">
                <h3 class="section-title">상세 정보</h3>
                <div class="comparison-table">
                  <!-- 예적금인 경우 -->
                  <template
                    v-if="
                      selectedProducts[0].productType === 'DEPOSIT' ||
                      selectedProducts[0].productType === 'SAVINGS'
                    "
                  >
                    <div class="comparison-row">
                      <div class="comparison-label">기본금리</div>
                      <div class="comparison-value left">
                        {{ formatRate(selectedProducts[0].expectedReturn) }}%
                      </div>
                      <div class="comparison-value right">
                        {{ formatRate(selectedProducts[1].expectedReturn) }}%
                      </div>
                    </div>
                    <div class="comparison-row">
                      <div class="comparison-label">우대금리</div>
                      <div class="comparison-value left">
                        {{
                          formatRate(
                            selectedProducts[0].detail?.bonusRate || 0
                          )
                        }}%
                      </div>
                      <div class="comparison-value right">
                        {{
                          formatRate(
                            selectedProducts[1].detail?.bonusRate || 0
                          )
                        }}%
                      </div>
                    </div>
                  </template>

                  <!-- 펀드인 경우 -->
                  <template
                    v-else-if="selectedProducts[0].productType === 'FUND'"
                  >
                    <div class="comparison-row">
                      <div class="comparison-label">펀드유형</div>
                      <div class="comparison-value left">
                        {{ selectedProducts[0].detail?.fundType || '-' }}
                      </div>
                      <div class="comparison-value right">
                        {{ selectedProducts[1].detail?.fundType || '-' }}
                      </div>
                    </div>
                    <div class="comparison-row">
                      <div class="comparison-label">위험도</div>
                      <div class="comparison-value left">
                        {{
                          getRiskLevel(
                            selectedProducts[0].detail?.riskGrade ||
                              selectedProducts[0].riskLevel
                          )
                        }}
                      </div>
                      <div class="comparison-value right">
                        {{
                          getRiskLevel(
                            selectedProducts[1].detail?.riskGrade ||
                              selectedProducts[1].riskLevel
                          )
                        }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 모달 푸터 -->
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">닫기</button>
          <!-- <button
            @click="handleDetailedCompare"
            class="compare-button"
            :disabled="isComparing"
          >
            {{ isComparing ? '분석 중...' : '상세 분석' }}
          </button> -->
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  selectedProducts: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'detailed-compare']);

const isComparing = ref(false);

// 메서드들
const closeModal = () => {
  emit('close');
};

const handleOverlayClick = () => {
  closeModal();
};

const handleDetailedCompare = async () => {
  if (props.selectedProducts.length !== 2) return;

  isComparing.value = true;
  try {
    const [product1, product2] = props.selectedProducts;
    await emit('detailed-compare', { product1, product2 });
  } catch (error) {
    console.error('상세 비교 중 오류 발생:', error);
  } finally {
    isComparing.value = false;
  }
};

// CompareButton에서 가져온 함수들
const getBankImagePath = (bankName) => {
  const bankCode = getBankCodeFromName(bankName);
  try {
    return new URL(
      `/src/assets/images/banks/${bankCode.toLowerCase()}.png`,
      import.meta.url
    ).href;
  } catch {
    return `/src/assets/images/banks/${bankCode.toLowerCase()}.png`;
  }
};

const getBankCodeFromName = (bankName) => {
  const bankNameMap = {
    국민은행: 'kb',
    신한은행: 'shinhan',
    하나은행: 'hana',
    우리은행: 'woori',
    NH농협은행: 'nh',
    IBK기업은행: 'ibk',
    카카오뱅크: 'kakao',
    케이뱅크: 'kbank',
    SC제일은행: 'sc',
    토스뱅크: 'toss',
    BNK부산은행: 'bnk',
    iM뱅크: 'im',
  };

  if (bankNameMap[bankName]) {
    return bankNameMap[bankName];
  }

  for (const [fullName, code] of Object.entries(bankNameMap)) {
    if (
      bankName.includes(fullName.replace('은행', '')) ||
      fullName.includes(bankName)
    ) {
      return code;
    }
  }

  return bankName.charAt(0).toLowerCase();
};

const handleImageError = (event, bankName) => {
  const bankIcon = event.target.parentElement;
  event.target.style.display = 'none';
  bankIcon.style.color = 'inherit';
  bankIcon.textContent = getBankInitial(bankName);
};

const getBankInitial = (bankName) => {
  return bankName.charAt(0);
};

const getTypeLabel = (type) => {
  const labels = {
    DEPOSIT: '예금',
    SAVINGS: '적금',
    FUND: '펀드',
  };
  return labels[type] || type;
};

const formatRate = (rate) => {
  return rate ? rate.toFixed(2) : '0.00';
};

const getRiskLevel = (level) => {
  const levels = {
    1: '안전',
    2: '낮음',
    3: '보통',
    4: '높음',
    5: '매우높음',
  };
  return levels[level] || `${level}등급`;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.compare-container {
  margin-bottom: 32px;
}

/* CompareButton의 스타일을 그대로 사용 */
.vs-compare-card {
  background: transparent;
  border-radius: 16px;
  box-shadow: 0 10px 6px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.product-compare-section {
  position: relative;
  height: 120px;
  overflow: hidden;
  border-radius: 16px;
}

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
  clip-path: polygon(0 0, 60% 0, 40% 100%, 0 100%);
}

.right-shape {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  background: #ffeab4;
  z-index: 1;
  clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%);
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
  width: 50%;
  color: #ffffff;
  justify-content: flex-start;
}

.right-side {
  right: 0;
  width: 50%;
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
  font-size: 18px;
  font-weight: 700;
  margin: 0;
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

/* 상세 비교 내용 스타일 */
.comparison-details {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 24px;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comparison-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #4caf50;
}

.comparison-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comparison-row {
  display: grid;
  grid-template-columns: 120px 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.comparison-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.comparison-value.left {
  border-left: 3px solid #2e404c;
}

.comparison-value.right {
  border-left: 3px solid #ffc107;
}

.comparison-value.highlight {
  font-weight: 700;
  font-size: 16px;
  color: #e91e63;
  background: #fff5f8;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.cancel-button,
.compare-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background: #e0e0e0;
  color: #333;
}

.compare-button {
  background: #4caf50;
  color: white;
}

.compare-button:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.compare-button:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 반응형 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header,
  .modal-footer {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .comparison-row {
    grid-template-columns: 100px 1fr 1fr;
    gap: 12px;
  }

  .comparison-label {
    font-size: 13px;
  }

  .comparison-value {
    font-size: 13px;
    padding: 6px 8px;
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 98%;
    max-height: 98vh;
  }

  .comparison-row {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }

  .comparison-label {
    background: #f0f0f0;
    padding: 8px;
    border-radius: 4px;
    font-weight: 700;
  }

  .modal-footer {
    flex-direction: column;
    gap: 8px;
  }

  .cancel-button,
  .compare-button {
    width: 100%;
  }
}
</style>
