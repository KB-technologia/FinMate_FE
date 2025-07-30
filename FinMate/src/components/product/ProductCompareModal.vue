<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">상품 비교</h2>
          <button @click="closeModal" class="close-button">
            <svg
              width="1.5vw"
              height="1.5vw"
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

        <div class="modal-body">
          <div class="compare-container">
            <div class="vs-compare-card">
              <div class="product-compare-section">
                <div class="background-shapes">
                  <div class="left-shape"></div>
                  <div class="right-shape"></div>
                </div>

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

                <div class="vs-divider">
                  <div class="vs-circle">
                    <span class="vs-text">vs</span>
                  </div>
                </div>

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

          <div class="comparison-details">
            <div class="comparison-grid">
              <div class="comparison-section analysis-section">
                <h3 class="section-title">
                  <svg
                    width="1.2vw"
                    height="1.2vw"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"
                    />
                    <path d="M9 7L12 4L15 7" />
                    <path d="M12 4V16" />
                  </svg>
                  AI 분석 결과
                </h3>
                <div class="analysis-content">
                  <div v-if="isLoadingAnalysis" class="loading-spinner">
                    <div class="spinner"></div>
                    <p>분석 중...</p>
                  </div>
                  <div v-else-if="analysisError" class="error-message">
                    <p>{{ analysisError }}</p>
                    <button
                      @click="fetchComparisonAnalysis"
                      class="retry-button"
                    >
                      다시 시도
                    </button>
                  </div>
                  <div v-else-if="analysisResult" class="analysis-result">
                    <div
                      class="analysis-text"
                      v-html="parseMarkdown(analysisResult)"
                    ></div>
                  </div>
                </div>
              </div>

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

              <div class="comparison-section">
                <h3 class="section-title">상세 정보</h3>
                <div class="comparison-table">
                  <div class="comparison-row">
                    <div class="comparison-label">최소 가입금액</div>
                    <div class="comparison-value left">
                      {{ formatAmount(selectedProducts[0].minAmount) }}
                    </div>
                    <div class="comparison-value right">
                      {{ formatAmount(selectedProducts[1].minAmount) }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">투자 기간</div>
                    <div class="comparison-value left">
                      {{
                        formatTerm(
                          selectedProducts[0].minTerm,
                          selectedProducts[0].maxTerm
                        )
                      }}
                    </div>
                    <div class="comparison-value right">
                      {{
                        formatTerm(
                          selectedProducts[1].minTerm,
                          selectedProducts[1].maxTerm
                        )
                      }}
                    </div>
                  </div>

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
                    <div class="comparison-row">
                      <div class="comparison-label">이자 유형</div>
                      <div class="comparison-value left">
                        {{
                          getInterestType(
                            selectedProducts[0].detail?.interestType
                          )
                        }}
                      </div>
                      <div class="comparison-value right">
                        {{
                          getInterestType(
                            selectedProducts[1].detail?.interestType
                          )
                        }}
                      </div>
                    </div>
                    <div class="comparison-row">
                      <div class="comparison-label">중도해지 수수료</div>
                      <div class="comparison-value left">
                        {{
                          formatRate(
                            selectedProducts[0].detail
                              ?.earlyWithdrawalPenalty || 0
                          )
                        }}%
                      </div>
                      <div class="comparison-value right">
                        {{
                          formatRate(
                            selectedProducts[1].detail
                              ?.earlyWithdrawalPenalty || 0
                          )
                        }}%
                      </div>
                    </div>
                  </template>

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

        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">닫기</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { productService } from '../../api/product/productService';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  selectedProducts: { type: Array, default: () => [] },
});

const emit = defineEmits(['close']);

const isLoadingAnalysis = ref(false);
const analysisError = ref(null);
const analysisResult = ref(null);

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue && props.selectedProducts.length === 2) {
      nextTick(() => {
        fetchComparisonAnalysis();
      });
    }
  }
);

const fetchComparisonAnalysis = async () => {
  if (props.selectedProducts.length !== 2) return;
  isLoadingAnalysis.value = true;
  analysisError.value = null;
  analysisResult.value = null;
  try {
    const [product1, product2] = props.selectedProducts;
    const response = await productService.compareProducts(
      product1.id,
      product2.id
    );
    analysisResult.value = response.data.comparisonResult;
  } catch (error) {
    console.error('분석 API 호출 실패:', error);
    analysisError.value =
      error.response?.data?.message || '분석을 불러오는데 실패했습니다.';
  } finally {
    isLoadingAnalysis.value = false;
  }
};

const closeModal = () => {
  analysisResult.value = null;
  analysisError.value = null;
  isLoadingAnalysis.value = false;
  emit('close');
};

const handleOverlayClick = () => {
  closeModal();
};

// 유틸리티 함수들
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
  if (bankNameMap[bankName]) return bankNameMap[bankName];
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

const getBankInitial = (bankName) => bankName.charAt(0);

const getTypeLabel = (type) => {
  const labels = { DEPOSIT: '예금', SAVINGS: '적금', FUND: '펀드' };
  return labels[type] || type;
};

const getInterestType = (type) => {
  const types = { SIMPLE: '단리', COMPOUND: '복리' };
  return types[type] || type || '-';
};

const formatRate = (rate) => (rate ? rate.toFixed(2) : '0.00');
const formatAmount = (amount) =>
  !amount ? '-' : new Intl.NumberFormat('ko-KR').format(amount) + '원';

const formatTerm = (minTerm, maxTerm) => {
  if (!minTerm && !maxTerm) return '-';
  if (!maxTerm) return `${minTerm}개월~`;
  if (minTerm === maxTerm) return `${minTerm}개월`;
  return `${minTerm}~${maxTerm}개월`;
};

const parseMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
    .replace(/^-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.*)$/s, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
};

const getRiskLevel = (level) => {
  const levels = { 1: '안전', 2: '낮음', 3: '보통', 4: '높음', 5: '매우높음' };
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
  backdrop-filter: blur(0.2vw);
}

.modal-container {
  background: white;
  border-radius: 1vw;
  width: 60vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 1.2vw 3.6vw rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5vh 2vw;
  border-bottom: 0.05vw solid #e0e0e0;
  background: #fafafa;
}

.modal-title {
  font-size: 1.5vw;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 1vh 1vw;
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
  padding: 2vh 2vw;
}

.compare-container {
  margin-bottom: 2vh;
}

.vs-compare-card {
  background: transparent;
  border-radius: 1vw;
  box-shadow: 0 0.6vw 0.4vw rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.product-compare-section {
  position: relative;
  height: 12vh;
  overflow: hidden;
  border-radius: 1vw;
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
  padding: 1vh 1.5vw;
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
  margin-right: 0.8vw;
}

.right-side .product-icon {
  order: 2;
  margin-left: 0.8vw;
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
  backdrop-filter: blur(0.25vw);
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
  font-size: 1.1vw;
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
  width: 3.8vw;
  height: 3.8vw;
  background: #dddddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.25vw 0.75vw rgba(0, 0, 0, 0.15);
}

.vs-text {
  font-size: 1vw;
  font-weight: 700;
  color: #1f2937;
  text-transform: lowercase;
}

.comparison-details {
  background: #f9f9f9;
  border-radius: 0.75vw;
  padding: 1.5vh 1.5vw;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
}

.comparison-section {
  background: white;
  border-radius: 0.5vw;
  padding: 1.2vh 1.2vw;
  box-shadow: 0 0.1vw 0.5vw rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.1vw;
  font-weight: 600;
  color: #333;
  margin: 0 0 1vh 0;
  padding-top: 1vh;
  padding-bottom: 1vh;
  border-bottom: 0.1vw solid #4caf50;
  display: flex;
  align-items: center;
  gap: 0.5vw;
}

.analysis-section .section-title {
  border-bottom-color: #2196f3;
}

.analysis-content {
  min-height: 7.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  color: #666;
}

.spinner {
  width: 2.5vw;
  height: 2.5vw;
  margin-top: 2vh;
  border: 0.25vw solid #f3f3f3;
  border-top: 0.25vw solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  color: #e91e63;
}

.error-message p {
  font-size: 0.9vw;
}

.retry-button {
  margin-top: 0.75vh;
  padding: 0.5vh 1vw;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 0.4vw;
  cursor: pointer;
  font-size: 0.9vw;
}

.retry-button:hover {
  background: #1976d2;
}

.analysis-result {
  width: 100%;
}

.analysis-text {
  white-space: pre-wrap;
  font-family: WantedSans, -apple-system, BlinkMacSystemFont, system-ui, Roboto,
    sans-serif;
  font-size: 0.9vw;
  line-height: 1.6;
  color: #333;
  background: #f8f9fa;
  padding: 1.2vh 1.2vw;
  border-radius: 0.5vw;
  border-left: 0.25vw solid #2196f3;
  margin: 0;
}

.comparison-table {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
}

.comparison-row {
  display: grid;
  grid-template-columns: 8.8vw 1fr 1fr;
  gap: 0.6vw;
  align-items: center;
  padding: 2vh 0.2vw;
  border-bottom: 0.03vw solid #f0f0f0;
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-label {
  font-size: 0.9vw;
  font-weight: 600;
  color: #666;
}

.comparison-value {
  font-size: 0.9vw;
  color: #333;
  font-weight: 500;
  padding: 0.3vh 0.5vw;
  background: #f8f9fa;
  border-radius: 0.25vw;
  text-align: center;
}

.comparison-value.left {
  border-left: 0.15vw solid #2e404c;
}

.comparison-value.right {
  border-left: 0.15vw solid #ffc107;
}

.comparison-value.highlight {
  font-weight: 700;
  font-size: 1vw;
  color: #e91e63;
  background: #fff5f8;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5vw;
  padding: 2vh 2vw;
  border-top: 0.05vw solid #e0e0e0;
  background: #fafafa;
}

.cancel-button {
  padding: 1vh 1.5vw;
  border-radius: 0.3vw;
  font-size: 0.9vw;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: var(--color-primary-green);
  color: var(--color-modal-bg);
}

.cancel-button:hover {
  background: #e0e0e0;
  color: #333;
}

.loading-spinner p {
  font-size: 0.9vw;
}
</style>
