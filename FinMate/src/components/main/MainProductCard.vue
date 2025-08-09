<template>
  <div class="card-container" @click="handleClick">
    <div class="card-content">
      <div class="product-type">
        <div class="empty-place"></div>
        <div
          class="product-type-badge"
          :class="getTypeClass(product.productType)"
        >
          <span>{{ getTypeLabel(product.productType) }}</span>
        </div>
      </div>
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
      <h3 class="product-name">{{ truncatedName }}</h3>

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
              <span>{{ product.detail.fundType }}</span>
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
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const handleClick = () => {
  router.push(`/product/${props.product.id}`);
};
const getTypeClass = (type) => {
  return `type-${type.toLowerCase()}`;
};

const getTypeLabel = (type) => {
  const labels = {
    DEPOSIT: '예금',
    SAVINGS: '적금',
    FUND: '펀드',
  };
  return labels[type] || type;
};

const getBankClass = (bankName) => {
  return bankName.replace(/\s+/g, '').toLowerCase();
};

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
    KB국민은행: 'kb',
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

const getBankInitial = (bankName) => {
  return bankName.charAt(0);
};

const handleImageError = (event) => {
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

const truncatedName = computed(() => {
  return props.product.name.length > 12
    ? props.product.name.slice(0, 12) + '...'
    : props.product.name;
});
</script>

<style scoped>
.card-container {
  width: 20vw;
  height: 40vh;
  background-color: var(--color-white);
  border: 0.2vh solid var(--color-light-gray);
  border-radius: 1vh;
  padding: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease;
  font-family: var(--font-wanted);
}

.card-container:hover {
  border: 0.2vh solid var(--color-light-blue);
  cursor: pointer;
  transform: translateY(-0.8vh);
}

.card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6px;
  text-align: left;
  align-items: flex-start;
}

.card-content p {
  font-size: 1.1rem;
  font-weight: var(--font-weight-regular);
}

.card-content h3 {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: 1.4rem;
  width: 100%;
  text-align: center;
}

.card-info-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: var(--font-weight-regular);
}

.card-info-row .label {
  width: 6rem;
  text-align: right;
  font-weight: var(--font-weight-medium);
}

.card-info-row .value {
  text-align: left;
  font-weight: var(--font-weight-regular);
}
.empty-place {
  width: 50%;
}
.product-type {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5vh;
  margin-top: 0.5vh;
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
  overflow: hidden;
}

.bank-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  width: 18vw;
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
</style>
