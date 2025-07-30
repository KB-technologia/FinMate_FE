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
              <!-- AI 분석 결과 -->
              <div class="comparison-section analysis-section">
                <h3 class="section-title">
                  <svg
                    width="20"
                    height="20"
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
                    <!-- <pre class="analysis-text">{{ analysisResult }}</pre> -->
                  </div>
                </div>
              </div>

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
                  <!-- 공통 정보 -->
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
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { productService } from '../../api/product/productService';

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

const emit = defineEmits(['close']);

// 분석 관련 상태
const isLoadingAnalysis = ref(false);
const analysisError = ref(null);
const analysisResult = ref(null);

// 모달이 열릴 때 분석 API 호출
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

// 분석 API 호출 함수
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

// 메서드들
const closeModal = () => {
  // 모달 닫을 때 상태 초기화
  analysisResult.value = null;
  analysisError.value = null;
  isLoadingAnalysis.value = false;
  emit('close');
};

const handleOverlayClick = () => {
  closeModal();
};

// CompareButton에서 가져온 유틸리티 함수들
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

const getInterestType = (type) => {
  const types = {
    SIMPLE: '단리',
    COMPOUND: '복리',
  };
  return types[type] || type || '-';
};

const formatRate = (rate) => {
  return rate ? rate.toFixed(2) : '0.00';
};

const formatAmount = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

const formatTerm = (minTerm, maxTerm) => {
  if (!minTerm && !maxTerm) return '-';
  if (!maxTerm) return `${minTerm}개월~`;
  if (minTerm === maxTerm) return `${minTerm}개월`;
  return `${minTerm}~${maxTerm}개월`;
};

// 마크다운 파싱 함수
const parseMarkdown = (text) => {
  if (!text) return '';

  return (
    text
      // 헤딩 처리 (### -> h3, ## -> h2, # -> h1)
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')

      // 볼드 처리 (**text** -> <strong>text</strong>)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

      // 이탤릭 처리 (*text* -> <em>text</em>)
      .replace(/\*(.*?)\*/g, '<em>$1</em>')

      // 리스트 처리
      .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
      .replace(/^-\s+(.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

      // 줄바꿈 처리
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')

      // 전체를 p 태그로 감싸기
      .replace(/^(.*)$/s, '<p>$1</p>')

      // 빈 p 태그 제거
      .replace(/<p><\/p>/g, '')
  );
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
  max-width: 1000px;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-section .section-title {
  border-bottom-color: #2196f3;
}

.analysis-content {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196f3;
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

.retry-button {
  margin-top: 12px;
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background: #1976d2;
}

.analysis-result {
  width: 100%;
}

.analysis-text {
  white-space: pre-wrap;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui,
    Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
  margin: 0;
}

.comparison-table {
  display: flex;
  flex-direction: column;
  gap: 0.8vh;
}

.comparison-row {
  display: grid;
  grid-template-columns: 8.5vw 1fr 1fr;
  gap: 1vw;
  align-items: center;
  padding: 0.8vh 0;
  border-bottom: 0.05vw solid #f0f0f0;
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
  padding: 0.5vh 0.8vw;
  background: #f8f9fa;
  border-radius: 0.4vw;
  text-align: center;
}

.comparison-value.left {
  border-left: 0.2vw solid #2e404c;
}

.comparison-value.right {
  border-left: 0.2vw solid #ffc107;
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
  gap: 0.8vw;
  padding: 1.5vh 2vw;
  border-top: 0.1vw solid #e0e0e0;
  background: #fafafa;
}

.cancel-button {
  padding: 0.8vh 1.5vw;
  border-radius: 0.5vw;
  font-size: 0.9vw;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background: #e0e0e0;
  color: #333;
}

/* 반응형 */
@media (max-width: 1200px) {
  .modal-container {
    max-width: 70vw;
  }

  .modal-title {
    font-size: 1.8vw;
  }

  .section-title {
    font-size: 1.3vw;
  }

  .product-name {
    font-size: 1.3vw;
  }
}

@media (max-width: 768px) {
  .modal-container {
    width: 95vw;
    max-width: 95vw;
    max-height: 95vh;
  }

  .modal-header,
  .modal-footer {
    padding: 2vh 3vw;
  }

  .modal-body {
    padding: 2vh 3vw;
  }

  .modal-title {
    font-size: 2.5vw;
  }

  .close-button {
    width: 4vw;
    height: 4vw;
  }

  .close-button svg {
    width: 2.5vw;
    height: 2.5vw;
  }

  .product-compare-section {
    height: 10vh;
  }

  .bank-icon {
    width: 4.5vw;
    height: 4.5vw;
  }

  .product-name {
    font-size: 1.8vw;
  }

  .vs-circle {
    width: 5.5vw;
    height: 5.5vw;
  }

  .vs-text {
    font-size: 1.5vw;
  }

  .section-title {
    font-size: 1.8vw;
  }

  .section-title svg {
    width: 2vw;
    height: 2vw;
  }

  .comparison-row {
    grid-template-columns: 12vw 1fr 1fr;
    gap: 2vw;
  }

  .comparison-label {
    font-size: 1.3vw;
  }

  .comparison-value {
    font-size: 1.3vw;
    padding: 1vh 1.5vw;
  }

  .comparison-value.highlight {
    font-size: 1.5vw;
  }

  .analysis-text {
    font-size: 1.3vw;
    padding: 2vh 2vw;
  }

  .analysis-text h1 {
    font-size: 1.8vw;
  }

  .analysis-text h2 {
    font-size: 1.6vw;
  }

  .analysis-text h3 {
    font-size: 1.4vw;
  }

  .spinner {
    width: 4vw;
    height: 4vw;
    border-width: 0.4vw;
  }

  .loading-spinner p,
  .error-message p {
    font-size: 1.3vw;
  }

  .retry-button {
    font-size: 1.3vw;
    padding: 1vh 2vw;
  }

  .cancel-button {
    font-size: 1.3vw;
    padding: 1.5vh 2.5vw;
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 98vw;
    max-width: 98vw;
    max-height: 98vh;
  }

  .comparison-row {
    grid-template-columns: 1fr;
    gap: 1.5vh;
    text-align: center;
  }

  .comparison-label {
    background: #f0f0f0;
    padding: 1vh 2vw;
    border-radius: 0.8vw;
    font-weight: 700;
    font-size: 2vw;
  }

  .comparison-value {
    font-size: 2vw;
    padding: 1.2vh 2vw;
  }

  .comparison-value.highlight {
    font-size: 2.2vw;
  }

  .modal-footer {
    flex-direction: column;
    gap: 1.5vh;
  }

  .cancel-button {
    width: 100%;
    font-size: 2vw;
    padding: 2vh 3vw;
  }

  .analysis-text {
    font-size: 1.8vw;
    padding: 2vh 3vw;
  }

  .analysis-text h1 {
    font-size: 2.5vw;
  }

  .analysis-text h2 {
    font-size: 2.2vw;
  }

  .analysis-text h3 {
    font-size: 2vw;
  }

  .modal-title {
    font-size: 3.5vw;
  }

  .product-name {
    font-size: 2.5vw;
  }

  .section-title {
    font-size: 2.5vw;
  }

  .section-title svg {
    width: 3vw;
    height: 3vw;
  }

  .vs-circle {
    width: 8vw;
    height: 8vw;
  }

  .vs-text {
    font-size: 2.5vw;
  }

  .bank-icon {
    width: 6vw;
    height: 6vw;
  }

  .spinner {
    width: 6vw;
    height: 6vw;
    border-width: 0.6vw;
  }

  .loading-spinner p,
  .error-message p {
    font-size: 2vw;
  }

  .retry-button {
    font-size: 2vw;
    padding: 1.5vh 3vw;
  }
}

.comparison-row {
  display: grid;
  grid-template-columns: 140px 1fr 1fr;
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

.cancel-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background: #e0e0e0;
  color: #333;
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
    grid-template-columns: 120px 1fr 1fr;
    gap: 12px;
  }

  .comparison-label {
    font-size: 13px;
  }

  .comparison-value {
    font-size: 13px;
    padding: 6px 8px;
  }

  .analysis-text {
    font-size: 13px;
    padding: 16px;
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

  .cancel-button {
    width: 100%;
  }

  .analysis-text {
    font-size: 12px;
    padding: 12px;
  }
}
</style>
