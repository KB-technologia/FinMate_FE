<template>
  <div class="product-detail-card">
    <button class="favorite-btn" @click="handleToggleFavorite">
      <Heart class="heart-icon" :class="{ 'is-favorite': isFavorite }" />
    </button>
    <div class="top-right-badge">
      <span
        class="product-type-badge"
        :class="getTypeClass(product.productType)"
      >
        {{ getTypeLabel(product.productType) }}
      </span>
    </div>

    <div class="center-header">
      <div class="bank-logo-wrapper">
        <img
          :src="getBankImagePath(product.bankName)"
          class="bank-logo"
          :alt="product.bankName"
          @error="handleImageError"
        />
      </div>
      <h2 class="product-name">{{ product.name }}</h2>
      <div class="bank-name">{{ product.bankName }}</div>
    </div>

    <div class="info-grid">
      <div class="info-label">기본 금리</div>
      <div class="info-value">{{ formatRate(product.expectedReturn) }}%</div>

      <div class="info-label">우대 금리</div>
      <div class="info-value">{{ formatRate(product.detail.bonusRate) }}%</div>

      <div class="info-label">최소 가입 금액</div>
      <div class="info-value">
        {{ formatAmount(product.detail.minAmount) }}원
      </div>

      <div class="info-label">최소 가입 기간</div>
      <div class="info-value">{{ product.detail.minTerm }}개월</div>

      <div class="info-label">기본 가입 기간</div>
      <div class="info-value">{{ product.detail.defaultTermMonths }}개월</div>

      <div class="info-label">이자 유형</div>
      <div class="info-value">
        {{ getInterestType(product.detail.interestType) }}
      </div>

      <div class="info-label">복리 주기</div>
      <div class="info-value">
        {{ getCompoundingPeriod(product.detail.compoundingPeriod) }}
      </div>

      <div class="info-label">중도 해지 패널티</div>
      <div class="info-value">{{ product.detail.earlyWithdrawalPenalty }}%</div>

      <div class="info-label">자유 입출금 가능</div>
      <div class="info-value">
        {{ product.detail.isFlexible ? '가능' : '불가능' }}
      </div>
      <div class="info-label">상품 보러가기</div>
      <div class="info-value">
        <a :href="product.url" target="_blank" class="product-link">
          링크 열기 🔗
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBankCodeFromName } from '@/utils/bank.js';
import { Heart } from 'lucide-vue-next';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle-favorite']);

const handleToggleFavorite = () => {
  emit('toggle-favorite');
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

const formatRate = (rate) => {
  return rate ? rate.toFixed(2) : '0.00';
};

const formatAmount = (amount) => {
  return amount?.toLocaleString() || '0';
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

// 이미지 로드 실패 시 처리
const handleImageError = (event) => {
  // 이미지 로드 실패 시 텍스트로 대체
  const bankIcon = event.target.parentElement;
  event.target.style.display = 'none';
  bankIcon.style.backgroundColor = '#f0f0f0';
  bankIcon.style.color = '#666';
  bankIcon.textContent = props.product.bankName.charAt(0);
};

const getInterestType = (type) => {
  const map = {
    SIMPLE: '단리',
    COMPOUND: '복리',
  };
  return map[type] || type;
};

const getCompoundingPeriod = (period) => {
  const map = {
    MONTHLY: '매월',
    YEARLY: '매년',
  };
  return map[period] || period;
};
</script>

<style scoped>
.product-detail-card {
  width: 62.5rem;
  max-width: 62.5rem;
  margin: 0 auto;
  padding: 2.5rem;
  background-color: var(--color-primary-yellow);
  border-radius: 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

.favorite-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 0.15vw solid #e8f5e8;
  border-radius: 50%;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.favorite-btn:hover {
  background: #4caf50;
  border-color: #4caf50;
  transform: scale(1.1);
}

.favorite-btn:hover .heart-icon {
  color: white;
}

.heart-icon {
  width: 1.8rem;
  height: 1.8rem;
  color: #4caf50;
  transition: all 0.3s ease;
  stroke-width: 2;
}

.heart-icon.is-favorite {
  color: #4caf50;
  fill: #4caf50;
  animation: heartBeat 0.6s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.3);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.top-right-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.product-type-badge {
  padding: 0.625rem 1.125rem;
  border-radius: 999px;
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
  font-size: 0.9375rem;
}

.type-deposit {
  background: var(--color-survey-blue);
}
.type-savings {
  background: var(--color-saving-orange);
}
.type-fund {
  background: var(--color-fund-green);
}

.center-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
}

.bank-logo-wrapper {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  font-weight: 700;
  font-size: 2.4rem;
  color: #666;
  overflow: hidden; /* 이미지가 원형을 벗어나지 않도록 */
}

.bank-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-name {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
  margin: 1rem 0 0.5rem;
  text-align: center;
}

.bank-name {
  font-size: 1.125rem;
  color: var(--color-dark-gray);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  row-gap: 1.25rem;
  column-gap: 2.5rem;
  max-width: 40rem;
  margin: 0 auto;
}

.info-label {
  font-size: 1.125rem;
  color: var(--color-black);
  font-weight: var(--font-weight-medium);
}

.info-value {
  font-size: 1.125rem;
  font-weight: var(--font-weight-bold);
  text-align: right;
}

.product-link {
  color: var(--color-blue);
  text-decoration: underline;
  font-weight: 500;
}
</style>
