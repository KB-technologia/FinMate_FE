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
                        :src="getBankLogo(selectedProducts[0].bankName)"
                        :alt="selectedProducts[0].bankName"
                        @error="
                          handleImageError($event, selectedProducts[0].bankName)
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
                        :src="getBankLogo(selectedProducts[1].bankName)"
                        :alt="selectedProducts[1].bankName"
                        @error="
                          handleImageError($event, selectedProducts[1].bankName)
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
              <!-- 기본 정보 -->
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

              <!-- 공통 상세 정보(혼합) -->
              <div v-if="isMixedComparison" class="comparison-section">
                <h3 class="section-title">상세 정보</h3>
                <div class="comparison-table">
                  <div class="comparison-row">
                    <div class="comparison-label">투자기간</div>
                    <div class="comparison-value left">
                      {{ getInvestmentPeriod(selectedProducts[0]) }}
                    </div>
                    <div class="comparison-value right">
                      {{ getInvestmentPeriod(selectedProducts[1]) }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">최소투자금액</div>
                    <div class="comparison-value left">
                      {{ getMinInvestmentAmount(selectedProducts[0]) }}
                    </div>
                    <div class="comparison-value right">
                      {{ getMinInvestmentAmount(selectedProducts[1]) }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">대표 금리/수익률</div>
                    <div class="comparison-value left expect">
                      {{ formatRate(selectedProducts[0].expectedReturn) }}%
                    </div>
                    <div class="comparison-value right expect">
                      {{ formatRate(selectedProducts[1].expectedReturn) }}%
                    </div>
                  </div>

                  <div class="comparison-row">
                    <div class="comparison-label">위험도</div>
                    <div
                      class="comparison-value left"
                      :class="getRiskColorClass(selectedProducts[0])"
                    >
                      {{ getRiskDescription(selectedProducts[0]) }}
                    </div>
                    <div
                      class="comparison-value right"
                      :class="getRiskColorClass(selectedProducts[1])"
                    >
                      {{ getRiskDescription(selectedProducts[1]) }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">수수료/비용</div>
                    <div class="comparison-value left">
                      {{ getFeeDescription(selectedProducts[0]) }}
                    </div>
                    <div class="comparison-value right">
                      {{ getFeeDescription(selectedProducts[1]) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 예금/적금 전용 상세 정보 -->
              <div v-if="hasDepositOrSavings" class="comparison-section">
                <h3 class="section-title">상세 정보</h3>
                <div class="comparison-table">
                  <div class="comparison-row">
                    <div class="comparison-label">최소 가입금액</div>
                    <div class="comparison-value left">
                      {{ formatAmount(selectedProducts[0].minAmount) }}원
                    </div>
                    <div class="comparison-value right">
                      {{ formatAmount(selectedProducts[1].minAmount) }}원
                    </div>
                  </div>
                  <div
                    v-if="
                      selectedProducts[0].productType === 'SAVINGS' ||
                      selectedProducts[1].productType === 'SAVINGS'
                    "
                    class="comparison-row"
                  >
                    <div class="comparison-label">월 적립한도</div>
                    <div class="comparison-value left">
                      {{
                        formatAmount(
                          selectedProducts[0].detail?.maxMonthlyPayment
                        )
                      }}원
                    </div>
                    <div class="comparison-value right">
                      {{
                        formatAmount(
                          selectedProducts[1].detail?.maxMonthlyPayment
                        )
                      }}원
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">최소 가입 기간</div>
                    <div class="comparison-value left">
                      {{ selectedProducts[0].minTerm }}개월
                    </div>
                    <div class="comparison-value right">
                      {{ selectedProducts[1].minTerm }}개월
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">최대 만기 기간</div>
                    <div class="comparison-value left">
                      {{ selectedProducts[0].maxTerm }}개월
                    </div>
                    <div class="comparison-value right">
                      {{ selectedProducts[1].maxTerm }}개월
                    </div>
                  </div>

                  <div class="comparison-row">
                    <div class="comparison-label">기본금리</div>
                    <div class="comparison-value left basic">
                      {{ formatRate(selectedProducts[0].expectedReturn) }}%
                    </div>
                    <div class="comparison-value right basic">
                      {{ formatRate(selectedProducts[1].expectedReturn) }}%
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">우대금리</div>
                    <div class="comparison-value left">
                      {{
                        formatRate(selectedProducts[0].detail?.bonusRate || 0)
                      }}%
                    </div>
                    <div class="comparison-value right">
                      {{
                        formatRate(selectedProducts[1].detail?.bonusRate || 0)
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
                          selectedProducts[0].detail?.earlyWithdrawalPenalty ||
                            0
                        )
                      }}%
                    </div>
                    <div class="comparison-value right">
                      {{
                        formatRate(
                          selectedProducts[1].detail?.earlyWithdrawalPenalty ||
                            0
                        )
                      }}%
                    </div>
                  </div>
                </div>
              </div>

              <!-- 펀드 전용 상세 정보 -->
              <div v-if="isFund" class="comparison-section">
                <h3 class="section-title">펀드 정보</h3>
                <div class="comparison-table">
                  <div class="comparison-row">
                    <div class="comparison-label">펀드유형</div>
                    <div class="comparison-value left">
                      {{ getFundType(selectedProducts[0].detail?.fundType) }}
                    </div>
                    <div class="comparison-value right">
                      {{ getFundType(selectedProducts[1].detail?.fundType) }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">위험도</div>
                    <div
                      class="comparison-value left"
                      :class="getRiskColorClass(selectedProducts[0])"
                    >
                      {{
                        getRiskLevel(
                          selectedProducts[0].detail?.riskGrade ||
                            selectedProducts[0].riskLevel
                        )
                      }}
                    </div>
                    <div
                      class="comparison-value right"
                      :class="getRiskColorClass(selectedProducts[1])"
                    >
                      {{
                        getRiskLevel(
                          selectedProducts[1].detail?.riskGrade ||
                            selectedProducts[1].riskLevel
                        )
                      }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">기준가</div>
                    <div class="comparison-value left">
                      {{ formatAmount(selectedProducts[0].detail?.nav) }}원
                    </div>
                    <div class="comparison-value right">
                      {{ formatAmount(selectedProducts[1].detail?.nav) }}원
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">순자산(AUM)</div>
                    <div class="comparison-value left">
                      {{ formatAum(selectedProducts[0].detail?.aum) }}
                    </div>
                    <div class="comparison-value right">
                      {{ formatAum(selectedProducts[1].detail?.aum) }}
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">총비용비율</div>
                    <div class="comparison-value left">
                      {{
                        formatRate(selectedProducts[0].detail?.expenseRatio)
                      }}%
                    </div>
                    <div class="comparison-value right">
                      {{
                        formatRate(selectedProducts[1].detail?.expenseRatio)
                      }}%
                    </div>
                  </div>
                  <div class="comparison-row">
                    <div class="comparison-label">환매 소요일</div>
                    <div class="comparison-value left">
                      {{ selectedProducts[0].detail?.redemptionPeriod || '-' }}
                      영업일
                    </div>
                    <div class="comparison-value right">
                      {{ selectedProducts[1].detail?.redemptionPeriod || '-' }}
                      영업일
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="hasProductRateData"
              class="comparison-section chart-section"
            >
              <h3 class="section-title">
                {{ isFund ? '수익률 추이 비교' : '금리 추이 비교' }}
              </h3>
              <div class="charts-container">
                <div class="chart-item chart-item-first">
                  <div class="chart-item-header">
                    <h4 class="chart-item-title">
                      {{ selectedProducts[0].name }}
                    </h4>
                    <span class="chart-bank-name">{{
                      selectedProducts[0].bankName
                    }}</span>
                  </div>
                  <div class="chart-wrapper">
                    <ProductRateChart
                      v-if="selectedProducts[0].productRate"
                      :product-rate="selectedProducts[0].productRate"
                      :title="isFund ? '수익률 추이' : '금리 추이'"
                      :show-zero-line="isFund"
                    />
                    <div v-else class="no-chart-data">
                      차트 데이터가 없습니다
                    </div>
                  </div>
                </div>

                <div class="chart-item chart-item-second">
                  <div class="chart-item-header">
                    <h4 class="chart-item-title">
                      {{ selectedProducts[1].name }}
                    </h4>
                    <span class="chart-bank-name">{{
                      selectedProducts[1].bankName
                    }}</span>
                  </div>
                  <div class="chart-wrapper">
                    <ProductRateChart
                      v-if="selectedProducts[1].productRate"
                      :product-rate="selectedProducts[1].productRate"
                      :title="isFund ? '수익률 추이' : '금리 추이'"
                      :show-zero-line="isFund"
                    />
                    <div v-else class="no-chart-data">
                      차트 데이터가 없습니다
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 분석 결과 -->
          <div class="analysis-wrapper">
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
                <!-- <img
                  v-if="characterImage"
                  :src="characterImagePath"
                  :alt="characterData?.animalName || '캐릭터'"
                  class="character-icon"
                /> -->
                AI 분석 결과
              </h3>
              <div class="analysis-content">
                <div v-if="isLoadingAnalysis" class="loading-spinner">
                  <div class="spinner"></div>
                  <p>분석 중...</p>
                </div>
                <div v-else-if="analysisError" class="error-message">
                  <p>{{ analysisError }}</p>
                  <button @click="fetchComparisonAnalysis" class="retry-button">
                    다시 시도
                  </button>
                </div>
                <div
                  v-else-if="analysisResult"
                  class="analysis-result-container"
                >
                  <div
                    class="character-area"
                    :class="{ flip: shouldFlipCharacter }"
                  >
                    <img
                      v-if="characterImage"
                      :src="characterImagePath"
                      :alt="characterData?.animalName || '캐릭터'"
                      class="character-icon"
                    />
                  </div>
                  <div class="chat-messages">
                    <div
                      v-for="(message, index) in getChatMessages(
                        analysisResult
                      )"
                      :key="index"
                      class="chat-bubble"
                      :class="{ delay: index > 0 }"
                      :style="{ animationDelay: `${index * 0.3}s` }"
                    >
                      <div
                        class="message-content"
                        v-html="parseMarkdown(message)"
                      ></div>
                    </div>
                  </div>
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
import { ref, watch, nextTick, computed } from 'vue';
import { productService } from '../../api/product/productService';
import ProductRateChart from './ProductRateChart.vue';
import { getBankLogo, handleImageError } from '../../utils/bank';
import { getCharacter } from '../../api/mypage/character';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  selectedProducts: { type: Array, default: () => [] },
});

const emit = defineEmits(['close']);

const isLoadingAnalysis = ref(false);
const analysisError = ref(null);
const analysisResult = ref(null);
const characterData = ref(null);
const characterImage = ref(null);

const characterImagePath = computed(() => {
  if (!characterData.value?.animalImage) return null;

  // lv0를 lv3로 변경
  const imagePath = characterData.value.animalImage.replace(
    'level0/panda_lv0.png',
    'level3/panda_lv3.png'
  );
  return import.meta.env.VITE_BASE_API_URL + imagePath;
});

const shouldFlipCharacter = computed(() => {
  if (!characterData.value?.animalImage) return true;

  const imagePath = characterData.value.animalImage;
  // cat이나 koala가 포함되면 반전하지 않음
  return !imagePath.includes('cat') && !imagePath.includes('koala');
});

const fetchCharacter = async () => {
  try {
    const response = await getCharacter();
    if (response.data) {
      characterData.value = response.data;
    } else if (response) {
      characterData.value = response;
    }
    characterImage.value = true;
  } catch (error) {
    console.error('캐릭터 데이터 로드 실패:', error);
    characterImage.value = false;
  }
};

const getInvestmentPeriod = (product) => {
  if (product.productType === 'FUND') {
    return '제한없음';
  }
  return product.detail?.defaultTermMonths
    ? `${product.detail.defaultTermMonths}개월`
    : `${product.minTerm}개월`;
};

const getMinInvestmentAmount = (product) => {
  if (product.productType === 'FUND') {
    return '제한없음';
  }
  return formatAmount(product.minAmount) + '원';
};

const getRiskDescription = (product) => {
  if (product.productType === 'DEPOSIT' || product.productType === 'SAVINGS') {
    return '원금보장';
  }
  const riskLevel = product.detail?.riskGrade || product.riskLevel;
  return getRiskLevel(riskLevel);
};

const getFeeDescription = (product) => {
  if (product.productType === 'DEPOSIT' || product.productType === 'SAVINGS') {
    const penalty = product.detail?.earlyWithdrawalPenalty;
    return penalty
      ? `중도해지 ${formatRate(penalty)}%`
      : '중도해지 수수료 없음';
  }
  const expenseRatio = product.detail?.expenseRatio;
  return expenseRatio
    ? `총비용비율 ${formatRate(expenseRatio)}%`
    : '비용정보 없음';
};

const hasDepositOrSavings = computed(() => {
  return (
    props.selectedProducts.length === 2 &&
    (props.selectedProducts[0].productType === 'DEPOSIT' ||
      props.selectedProducts[0].productType === 'SAVINGS') &&
    (props.selectedProducts[1].productType === 'DEPOSIT' ||
      props.selectedProducts[1].productType === 'SAVINGS')
  );
});

const isMixedComparison = computed(() => {
  if (props.selectedProducts.length !== 2) return false;
  const types = props.selectedProducts.map((p) => p.productType);
  // 펀드와 예금/적금을 비교하는 경우만 true 반환 (예금-적금 비교는 제외)
  return (
    types.includes('FUND') &&
    (types.includes('DEPOSIT') || types.includes('SAVINGS'))
  );
});

const isFund = computed(() => {
  return (
    props.selectedProducts.length === 2 &&
    props.selectedProducts[0].productType === 'FUND' &&
    props.selectedProducts[1].productType === 'FUND'
  );
});

const hasProductRateData = computed(() => {
  return props.selectedProducts.some((product) => product.productRate);
});

const getRiskColorClass = (product) => {
  if (product.productType === 'DEPOSIT' || product.productType === 'SAVINGS') {
    return '';
  }

  const riskLevel = product.detail?.riskGrade || product.riskLevel;

  if (riskLevel >= 4) {
    if (riskLevel === 4) return 'risk-medium-high';
    if (riskLevel === 5) return 'risk-high';
    if (riskLevel === 6) return 'risk-very-high';
  }

  return '';
};

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue && props.selectedProducts.length === 2) {
      nextTick(() => {
        fetchComparisonAnalysis();
        fetchCharacter();
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

const getTypeLabel = (type) => {
  const labels = { DEPOSIT: '예금', SAVINGS: '적금', FUND: '펀드' };
  return labels[type] || type;
};

const getInterestType = (type) => {
  const types = { SIMPLE: '단리', COMPOUND: '복리' };
  return types[type] || type || '-';
};

const getFundType = (type) => {
  const types = {
    STOCK: '주식형',
    BOND: '채권형',
    MIXED_EQUITY_BOND: '혼합형',
    REAL_ESTATE: '부동산형',
    SPECIAL_ASSET: '특별자산형',
    HYBRID_ASSET: '혼합자산형',
  };
  return types[type] || type || '-';
};

const formatRate = (rate) => (rate ? rate.toFixed(2) : '0.00');
const formatAmount = (amount) =>
  !amount ? '-' : new Intl.NumberFormat('ko-KR').format(amount);
const formatAum = (aum) => {
  if (!aum || aum === 0) return '-';
  const value = Number(aum);
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(1)}조원`;
  } else if (value >= 1e8) {
    return `${(value / 1e8).toFixed(1)}억원`;
  } else {
    return `${value.toLocaleString()}원`;
  }
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

const getChatMessages = (text) => {
  if (!text) return [];

  // \n\n으로 먼저 나누고, 빈 문자열 제거
  return text
    .split('\n\n')
    .map((msg) => msg.trim())
    .filter((msg) => msg.length > 0);
};

const getRiskLevel = (level) => {
  const levels = {
    1: '매우 낮은 위험',
    2: '낮은 위험',
    3: '보통 위험',
    4: '다소 높은 위험',
    5: '높은 위험',
    6: '매우 높은 위험',
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
  backdrop-filter: blur(0.2vw);
}

.modal-container {
  background: white;
  border-radius: 1vw;
  width: 70vw;
  max-height: 90vh;
  max-width: 90vw;
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

.analysis-wrapper {
  background: #f9f9f9;
  border-radius: 0.75vw;
  padding: 2vh 2vw;
  margin-top: 2vh;
}

.character-area {
  flex-shrink: 0;
  display: flex;
  align-content: flex-end;
  justify-content: center;
  padding-top: 23rem;
  padding-left: 1vw;
  height: 100%;
}

.character-area.flip {
  transform: scaleX(-1);
}

.character-icon {
  width: 7vw;
  height: 7vw;
}

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  min-width: 0;
}

.chat-bubble {
  background: #e3f2fd;
  border-radius: 1.2vw;
  padding: 1vh 1.2vw;
  position: relative;
  max-width: 100%;
  word-wrap: break-word;
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
}

.chat-bubble.delay {
  animation-fill-mode: both;
}

.chat-bubble:before {
  content: '';
  position: absolute;
  left: -0.5vw;
  bottom: 1vh;
  width: 0;
  height: 0;
  border-top: 0.7vw solid transparent;
  border-bottom: 0.7vw solid transparent;
  border-right: 0.7vw solid #e3f2fd;
}

.message-content {
  font-family: WantedSans, -apple-system, BlinkMacSystemFont, system-ui, Roboto,
    sans-serif;
  font-size: 0.9vw;
  line-height: 1.5;
  color: #333;
  margin: 0;
}

.message-content p {
  margin: 0 0 0.5vh 0;
}

.message-content p:last-child {
  margin-bottom: 0;
}

.message-content strong {
  color: #1976d2;
  font-weight: 700;
}

.message-content ul {
  margin: 0.5vh 0;
  padding-left: 1.2vw;
}

.message-content li {
  margin: 0.3vh 0;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.analysis-result-container {
  display: flex;
  /* gap: 1vw; */
  width: 100%;
  align-items: flex-start;
  min-height: 15vh;
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
  margin-bottom: 3vh;
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
  font-size: 1.1vw;
  font-weight: 600;
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
  font-size: 0.9vw;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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
  padding: 2vh 2vw;
  margin-bottom: 3vh;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 3vh;
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

.chart-section {
  padding: 2vh 2vw;
  margin-top: 4vh;
}

.charts-container {
  display: grid;
  flex-direction: column;
  gap: 1.5vw;
}

.chart-item {
  background: #fafafa;
  border-radius: 0.5vw;
  padding: 1.5vh 1.5vw;
  border: 1px solid #e5e7eb;
  min-width: 0;
}

.chart-item-header {
  margin-bottom: 1vh;
  padding-bottom: 1vh;
  border-bottom: 1px solid #e0e0e0;
}

.chart-item-title {
  font-size: 1vw;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5vh 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.chart-bank-name {
  font-size: 0.8vw;
  color: #666;
  font-weight: 500;
}

.chart-wrapper {
  min-height: 20vh;
  width: 100%;
  overflow: hidden;
}

.no-chart-data {
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.9vw;
  background: #f8f9fa;
  border-radius: 0.5vw;
  border: 1px dashed #ddd;
}

.chart-item-first :deep(canvas) {
  filter: hue-rotate(90deg) saturate(1.2) brightness(1);
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
  flex: 1;
  min-width: 0;
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

.comparison-value.expect {
  font-weight: 700;
  color: var(--color-red);
}

.comparison-value.basic {
  font-weight: 700;
  color: var(--color-red);
}

.comparison-value.risk-medium-high {
  color: var(--color-orange);
}

.comparison-value.risk-high {
  color: var(--color-red-alert);
}

.comparison-value.risk-very-high {
  color: var(--color-red);
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
