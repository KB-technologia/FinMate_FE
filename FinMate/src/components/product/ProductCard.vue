<template>
  <div
    class="product-card"
    :class="[cardBgClass, { selected: isSelected }]"
    @click="handleCardClick"
  >
    <div class="scale">
      <!-- 체크박스와 상품 타입 -->
      <div class="card-header">
        <input
          type="checkbox"
          :checked="isSelected"
          @change="handleSelect"
          @click="$event.stopPropagation()"
          class="select-checkbox"
        />
        <span
          class="product-type-badge"
          :class="getTypeClass(product.productType)"
        >
          {{ getTypeLabel(product.productType) }}
        </span>
      </div>

      <!-- 은행 정보 -->
      <div class="bank-section">
        <div class="bank-icon" :class="getBankClass(product.bankName)">
          <img
            :src="getBankImagePath(product.bankName)"
            :alt="product.bankName"
            @error="handleImageError"
            class="bank-logo"
          />
        </div>
        <div class="bank-info">
          <span class="bank-name">{{ product.bankName }}</span>
        </div>
      </div>

      <!-- 상품명 -->
      <h3 class="product-name">{{ product.name }}</h3>

      <!-- 수익률 정보 -->
      <div class="return-section">
        <div class="main-return">
          <span class="return-label">{{
            getRateLabel(product.productType)
          }}</span>
          <span class="return-value"
            >{{
              product.productType === 'FUND'
                ? formatRate(product.expectedReturn)
                : formatRate(product.expectedReturn + product.detail.bonusRate)
            }}%</span
          >
        </div>

        <!-- 상세 정보 -->
        <div class="detail-info" v-if="product.detail">
          <template
            v-if="
              product.productType === 'DEPOSIT' ||
              product.productType === 'SAVINGS'
            "
          >
            <div class="info-row">
              <span>기본금리:</span>
              <span>{{ formatRate(product.expectedReturn) }}%</span>
            </div>
            <div class="info-row">
              <span>우대금리:</span>
              <span>{{ formatRate(product.detail.bonusRate) }}%</span>
            </div>
          </template>

          <template v-else-if="product.productType === 'FUND'">
            <div class="info-row">
              <span>펀드유형:</span>
              <span>{{ subCategoriesMap(product.detail.fundType) }}</span>
            </div>
            <div class="info-row">
              <span>위험도:</span>
              <span>{{
                getRiskLevel(product.detail.riskGrade || product.riskLevel)
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const cardBgClass = computed(() => {
  const map = {
    DEPOSIT: 'bg-chick', // 예금 = 병아리
    SAVINGS: 'bg-frog', // 적금 = 개구리
    FUND: 'bg-rabbit', // 펀드 = 토끼
  };
  return map[props.product.productType] || 'bg-default';
});

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  selectedProducts: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select', 'detail']);

const isSelected = computed(() => {
  return props.selectedProducts.some((p) => p.id === props.product.id);
});

const handleSelect = () => {
  emit('select', props.product);
};

const handleCardClick = () => {
  emit('detail', props.product);
};

const getTypeLabel = (type) => {
  const labels = {
    DEPOSIT: '예금',
    SAVINGS: '적금',
    FUND: '펀드',
  };
  return labels[type] || type;
};

const getTypeClass = (type) => {
  return `type-${type.toLowerCase()}`;
};

const getBankClass = (bankName) => {
  return bankName.replace(/\s+/g, '').toLowerCase();
};

const getBankInitial = (bankName) => {
  return bankName.charAt(0);
};

// 은행 이미지 경로 생성
const getBankImagePath = (bankName) => {
  const bankCode = getBankCodeFromName(bankName);
  try {
    return new URL(
      `/src/assets/images/banks/${bankCode.toLowerCase()}.png`,
      import.meta.url
    ).href;
  } catch {
    // 이미지 로드 실패 시 대체 경로
    return `/src/assets/images/banks/${bankCode.toLowerCase()}.png`;
  }
};

// 은행명을 코드로 변환
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

  // 정확한 매칭 먼저 시도
  if (bankNameMap[bankName]) {
    return bankNameMap[bankName];
  }

  // 부분 매칭 시도
  for (const [fullName, code] of Object.entries(bankNameMap)) {
    if (
      bankName.includes(fullName.replace('은행', '')) ||
      fullName.includes(bankName)
    ) {
      return code;
    }
  }

  // 매칭되지 않으면 첫 글자 사용
  return bankName.charAt(0).toLowerCase();
};

// 이미지 로드 실패 시 처리
const handleImageError = (event) => {
  // 이미지 로드 실패 시 텍스트로 대체
  const bankIcon = event.target.parentElement;
  event.target.style.display = 'none';
  bankIcon.style.backgroundColor = '#f0f0f0';
  bankIcon.style.color = '#666';
  bankIcon.textContent = getBankInitial(props.product.bankName);
};

const getRateLabel = (type) => {
  const labels = {
    DEPOSIT: '최고',
    SAVINGS: '최고',
    FUND: '수익률',
  };
  return labels[type] || '수익률';
};

const formatRate = (rate) => {
  return rate ? rate.toFixed(2) : '0.00';
};

const subCategoriesMap = (fundType) => {
  const fundChange = {
    STOCK: '주식형',
    BOND: '채권형',
    MIXED_EQUITY_BOND: '혼합형',
    REAL_ESTATE: '부동산',
    SPECIAL_ASSET: '특별자산',
    HYBRID_ASSET: '파생상품',
  };

  return fundChange[fundType] || fundType;
};

const getRiskLevel = (level) => {
  const levels = {
    2: '매우 낮은 위험',
    3: '낮은 위험',
    4: '보통 위험',
    5: '다소 높은 위험',
    6: '높은 위험',
    7: '매우 높은 위험',
  };
  return levels[level] || `${level}등급`;
};
</script>

<style scoped>
.product-card {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  width: 100%;
  max-width: 25vw;
  /* background: #ffffff; */
  /* border: 1px solid #e0e0e0; */
  /* border-radius: 12px; */
  padding: 6vh 2.5vw;
  transition: all 0.3s ease;
  cursor: pointer;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); */
  margin: 0 auto;
  min-height: 35vh;
}
/* 타입별 배경 이미지 */
.bg-frog {
  background-image: url('@/assets/images/etc/개굴개굴.png'); /* 예금 */
}
.bg-chick {
  background-image: url('@/assets/images/etc/삐약삐약.png'); /* 적금 */
}
.bg-rabbit {
  background-image: url('@/assets/images/etc/깡총.png'); /* 펀드 */
}

.scale {
  transform: scale(0.9);
  margin-top: 3vh;
}

.product-card:hover {
  /* border-color: #4caf50; */
  /* box-shadow: 0 4px 16px rgba(76, 175, 80, 0.15); */
  transform: translateY(-10px);
}

/* .product-card.selected {
  border-color: #4caf50; 
  background-color: #f8fff8; 
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2); 
}  */
.bg-frog.selected {
  background-image: url('@/assets/images/etc/개굴개굴!.png');
}
.bg-chick.selected {
  background-image: url('@/assets/images/etc/삐약삐약!.png');
}
.bg-rabbit.selected {
  background-image: url('@/assets/images/etc/깡총!.png');
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5vh;
}

.select-checkbox {
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  accent-color: #4caf50;
}

.product-type-badge {
  padding: 0.8vh 1.2vw;
  border-radius: 1.2vw;
  font-size: clamp(11px, 0.9vw, 13px);
  font-weight: 600;
  color: white;
}

.type-deposit {
  background: var(--color-deposit-blue);
}
.type-savings {
  background: var(--color-saving-orange);
}
.type-fund {
  background: var(--color-fund-green);
}

.bank-section {
  display: flex;
  align-items: center;
  gap: 0.7vw;
  margin-bottom: 1.5vh;
}

.bank-icon {
  width: 2.5vw;
  height: 2.5vw;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2vw;
  color: #666;
  overflow: hidden; /* 이미지가 원형을 벗어나지 않도록 */
}

.bank-logo {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 원형에 맞게 조정 */
}

.bank-name {
  font-size: 1vw;
  font-weight: 500;
  color: #666;
}

.product-name {
  font-size: 1vw;
  font-weight: 700;
  color: #333;
  margin: 0 0 2vh 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.return-section {
  margin-bottom: 0;
}

.main-return {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5vh;
  padding: 1.2vw;
  background: #f8f9fa;
  border-radius: 0.8vw;
}

.return-label {
  font-size: 1vw;
  font-weight: 500;
  color: #666;
}

.return-value {
  font-size: 1.2vw;
  font-weight: 700;
  color: #e91e63;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1vh;
  padding: 0 0 0.5vw;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: clamp(12px, 1vw, 16px);
  color: #666;
  padding: 1vh 0.7vw;
}

.info-row span:first-child {
  color: #999;
  font-weight: 500;
}

.info-row span:last-child {
  font-weight: 600;
  color: #333;
}

/* 반응형 */
@media (max-width: 768px) {
  .product-card {
    max-width: 100%;
    padding: 2vh 2vw;
  }

  .bank-icon {
    width: 4.5vw;
    height: 4.5vw;
    font-size: clamp(12px, 1.8vw, 16px);
  }

  .product-name {
    font-size: clamp(14px, 2vw, 18px);
  }

  .return-value {
    font-size: clamp(18px, 2.5vw, 24px);
  }

  .main-return {
    padding: 1.5vh 1.2vw;
  }
}
</style>
