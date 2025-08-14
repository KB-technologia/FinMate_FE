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
            :src="getBankLogo(product.bankName)"
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
          <span class="return-value">
            {{
              product.productType === 'FUND'
                ? formatRate(product.expectedReturn)
                : formatRate(product.expectedReturn + product.detail.bonusRate)
            }}%
          </span>
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
              <span>{{ subCategoriesMap(product.detail.fundType) }}</span>
            </div>
            <div class="info-row">
              <span>위험도:</span>
              <span>{{ getRiskLevel(product.detail.riskGrade) }}</span>
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

const handleImageError = (event) => {
  const bankIcon = event.target?.parentElement;
  if (!bankIcon) return;

  if (event.target) {
    event.target.style.display = 'none';
  }
  bankIcon.style.backgroundColor = '#f0f0f0';
  bankIcon.style.color = '#666';
  bankIcon.textContent = props.product.bankName?.charAt(0) || '?';
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
    1: '매우 낮은 위험',
    2: '낮은 위험',
    3: '보통 위험',
    4: '다소 높은 위험',
    5: '높은 위험',
    6: '매우 높은 위험',
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
/* .card-container {
  background-color: var(--color-white);
  border: 0.2vh solid var(--color-light-gray);
  border-radius: 1vh;
  width: 20vw;
  height: 40vh;
  padding: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease;
  font-family: var(--font-wanted);
} */
.card-container {
  background: url('@/assets/images/etc/화분.png');
  width: 17vw;
  height: 40vh;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease;
  transform: scale(1.1);
  font-family: var(--font-wanted);
}

/* .card-container:hover {
  border: 0.2vh solid var(--color-black);
  cursor: pointer;
  transform: translateY(-0.8vh);
} */
.card-container:hover {
  cursor: pointer;
  transform: translateY(-0.8vh);
}

.card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6px;
  margin-left: -1.5vh;
  text-align: left;
  transform: scale(0.6);
  transform-origin: center;
  margin-top: -12vh;
  align-items: flex-start;
}
/* .card-content {
  width: 100%; 
  height: 100%;
  margin: auto; 
  display: flex;
  position: absolute;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  align-items: flex-start;
  transform: scale(0.7);
  transform-origin: center;
  margin-top: -12vh;
} */

/* 화면이 1500px 이하일 때 */
@media (max-width: 1800px) {
  .card-content {
    transform: scale(0.6);
  }
}

/* 화면이 900px 이하일 때 */
@media (max-width: 900px) {
  .card-content {
    transform: scale(0.4);
  }
}

/* 화면이 600px 이하일 때 */
@media (max-width: 600px) {
  .card-content {
    transform: scale(0.3);
  }
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
  margin-top: 4vh;
}

.product-type-badge {
  margin-right: -2vh;
  padding: 0.5vh 1vw;
  border-radius: 1.2vw;
  font-size: clamp(15px, 0.9vw, 18px);
  font-weight: 600;
  color: white;
  transform: scale(1.1);
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
  margin-top: -5vh;
  margin-left: -1vh;
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
  transform: scale(0.9);
}

.bank-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bank-name {
  font-size: 1vw;
  font-weight: 500;
  margin-left: -0.5vh;
  color: #666;
}

.product-name {
  font-size: 1vw;
  font-weight: 700;
  color: #333;
  margin: 0 0 2vh 0;
  margin-top: 2vh;
  line-height: 2;
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
  margin-top: 1.5vh;
  padding: 1.2vw;
  /* background: #f8f9fa; */
  border-radius: 0.8vw;
  width: 16vw;
  height: 5vh;
}

.return-label {
  font-size: 1.5vw;
  font-weight: 600;
  color: #666;
}

.return-value {
  font-size: 2.5vw;
  font-weight: 700;
  color: #e91e63;
}

.detail-info {
  display: flex;
  flex-direction: column;
  margin-top: 5vh;
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
