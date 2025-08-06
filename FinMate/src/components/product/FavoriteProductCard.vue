<template>
  <div class="favorite-product-card">
    <!-- 즐겨찾기 제거 버튼 -->
    <button class="favorite-remove-btn" @click="handleRemoveFavorite">
      <Heart class="heart-icon" />
    </button>

    <!-- 상품 타입 배지 -->
    <div class="product-type-badge" :class="getTypeClass(product.productType)">
      {{ getTypeName(product.productType) }}
    </div>

    <!-- 은행 정보 -->
    <div class="bank-info">
      <div class="bank-icon">
        <img
          :src="getBankLogo(product.bankName)"
          :alt="product.bankName"
          class="bank-logo"
        />
      </div>
      <span class="bank-name">{{ product.bankName }}</span>
    </div>

    <!-- 상품명 -->
    <h3 class="product-name">{{ product.productName }}</h3>

    <!-- 금리/수익률 정보 -->
    <div class="interest-info">
      <div class="main-interest">
        <span class="interest-label">{{
          product.productType === 'FUND' ? '수익률' : '최고'
        }}</span>
        <span class="interest-rate">{{ product.maxInterestRate }}%</span>
      </div>

      <!-- 펀드가 아닌 경우 기본금리 표시 -->
      <div class="base-interest" v-if="product.productType !== 'FUND'">
        <span class="base-label">기본금리</span>
        <span class="base-rate">{{ product.baseInterestRate }}%</span>
      </div>

      <!-- 펀드인 경우 위험등급 표시 -->
      <div class="risk-info" v-if="product.productType === 'FUND'">
        <span class="risk-label">위험등급</span>
        <span class="risk-grade" :class="getRiskClass(product.riskGrade)">
          {{ getRiskName(product.riskGrade) }}
        </span>
      </div>

      <div class="special-condition" v-if="product.specialCondition">
        {{ product.specialCondition }}
      </div>
    </div>

    <!-- 액션 버튼들 -->
    <div class="action-buttons">
      <button class="detail-btn" @click="viewDetails">상세보기</button>
      <button class="apply-btn" @click="applyProduct">신청하기</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Heart, HeartHandshakeIcon } from 'lucide-vue-next';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['remove-favorite']);

// 메서드
const handleRemoveFavorite = () => {
  emit('remove-favorite', props.product.id);
};

const getBankLogo = (bankName) => {
  const bankLogos = {
    KB국민은행: '/src/assets/images/banks/kb.png',
    신한은행: '/src/assets/images/banks/shinhan.png',
    하나은행: '/src/assets/images/banks/hana.png',
    우리은행: '/src/assets/images/banks/woori.png',
    NH농협은행: '/src/assets/images/banks/nh.png',
    IBK기업은행: '/src/assets/images/banks/ibk.png',
    카카오뱅크: '/src/assets/images/banks/kakao.png',
    케이뱅크: '/src/assets/images/banks/kbank.png',
    SC제일은행: '/src/assets/images/banks/sc.png',
    토스뱅크: '/src/assets/images/banks/toss.png',
  };
  return bankLogos[bankName] || '/src/assets/images/banks/default.png';
};

const getTypeClass = (type) => {
  const classes = {
    SAVINGS: 'type-savings',
    DEPOSIT: 'type-deposit',
    FUND: 'type-fund',
  };
  return classes[type] || 'type-default';
};

const getTypeName = (type) => {
  const names = {
    SAVINGS: '예금',
    DEPOSIT: '적금',
    FUND: '펀드',
  };
  return names[type] || type;
};

// 위험등급 관련 메서드 (1~6등급)
const getRiskClass = (riskGrade) => {
  const classes = {
    1: 'risk-grade-1',
    2: 'risk-grade-2',
    3: 'risk-grade-3',
    4: 'risk-grade-4',
    5: 'risk-grade-5',
    6: 'risk-grade-6',
  };
  return classes[riskGrade] || 'risk-grade-3';
};

const getRiskName = (riskGrade) => {
  const names = {
    1: '매우낮은위험',
    2: '낮은위험',
    3: '보통위험',
    4: '다소높은위험',
    5: '높은위험',
    6: '매우높은위험',
  };
  return names[riskGrade] || '보통위험';
};

const viewDetails = () => {
  // 상세페이지로 이동
};

const applyProduct = () => {
  // 신청 페이지로 이동
};
</script>

<style scoped>
.favorite-product-card {
  width: 90%;
  position: relative;
  background: linear-gradient(135deg, #f1f8e9, #e8f5e8);
  border: 0.15vw solid #e8f5e8;
  border-radius: 1.5vw;
  padding: 2vh 2vw;
  transition: all 0.3s ease;
  overflow: hidden;
}

.favorite-product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.4vh;
  background: linear-gradient(90deg, #4caf50, #66bb6a, #4caf50);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.favorite-product-card:hover {
  transform: translateY(-0.5vh);
  box-shadow: 0 0.5vh 0.5vh rgba(76, 175, 80, 0.2);
  border-color: #66bb6a;
}

/* 즐겨찾기 제거 버튼 */
.favorite-remove-btn {
  position: absolute;
  top: 1vh;
  right: 1vw;
  background: rgba(255, 255, 255, 0.9);
  border: 0.15vw solid #e8f5e8;
  border-radius: 50%;
  width: 3.5vw;
  height: 3.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-remove-btn:hover {
  background: #4caf50;
  border-color: #4caf50;
  transform: scale(1.1);
}

.favorite-remove-btn:hover .heart-icon {
  color: white;
}

.heart-icon {
  width: 1.8vw;
  height: 1.8vw;
  color: #4caf50;
  transition: color 0.3s ease;
}

/* 상품 타입 배지 */
.product-type-badge {
  display: inline-block;
  padding: 0.5vh 1vw;
  border-radius: 1.5vw;
  font-size: 1.6vh;
  font-weight: bold;
  margin-bottom: 1vh;
  color: white;
}

.type-savings {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
}

.type-deposit {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
}

.type-fund {
  background: linear-gradient(135deg, #2196f3, #03dac6);
}

.type-default {
  background: linear-gradient(135deg, #9c27b0, #e91e63);
}

/* 은행 정보 */
.bank-info {
  display: flex;
  align-items: center;
  gap: 0.5vw;
  margin-bottom: 1.5vh;
}

.bank-logo {
  width: 2.8vw;
  height: 4vh;
  object-fit: contain;
}

.bank-name {
  font-weight: 600;
  color: #444;
  font-size: 1.9vh;
}

/* 상품명 */
.product-name {
  font-size: 2.5vh;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 2vh;
  margin-left: 0.5vw;
  line-height: 1.4;
}

/* 금리 정보 */
.interest-info {
  margin-bottom: 2vh;
  margin-left: 0.5vw;
}

.main-interest {
  display: flex;
  align-items: baseline;
  gap: 0.5vw;
  margin-bottom: 1vh;
}

.interest-label {
  font-size: 1.9vh;
  color: #666;
  font-weight: 500;
}

.interest-rate {
  font-size: 4vh;
  font-weight: bold;
  margin-left: 0.2vw;
  color: #4caf50;
}

.base-interest {
  display: flex;
  align-items: baseline;
  gap: 0.5vw;
  margin-bottom: 0.5vh;
}

.base-label {
  font-size: 1.5vh;
  font-weight: 500;
  color: #777;
}

.base-rate {
  font-size: 2.3vh;
  font-weight: 600;
  color: #666;
}

/* 위험등급 스타일 */
.risk-info {
  display: flex;
  align-items: baseline;
  gap: 0.5vw;
  margin-bottom: 0.5vh;
}

.risk-label {
  font-size: 1.5vh;
  font-weight: 500;
  color: #777;
}

.risk-grade {
  font-size: 2.3vh;
  font-weight: 600;
}

.risk-grade-1 {
  color: #388e3c;
}

.risk-grade-2 {
  color: #4caf50;
}

.risk-grade-3 {
  color: #8bc34a;
}

.risk-grade-4 {
  color: #ffc107;
}

.risk-grade-5 {
  color: #ff9800;
}

.risk-grade-6 {
  color: #f44336;
}

.special-condition {
  font-size: 1.7vh;
  color: #666;
  background: rgba(76, 175, 80, 0.08);
  padding: 0.8vh 1.2vw;
  border-radius: 1.2vw;
  border: 0.1vw solid rgba(76, 175, 80, 0.15);
  margin-top: 1vh;
}

/* 액션 버튼들 */
.action-buttons {
  display: flex;
  gap: 1vw;
}

.detail-btn,
.apply-btn {
  flex: 1;
  padding: 1.2vh 0;
  border-radius: 1vw;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 2vh;
}

.detail-btn {
  background: white;
  color: #4caf50;
  border: 0.15vw solid #4caf50;
}

.detail-btn:hover {
  background: #4caf50;
  color: white;
  transform: translateY(-0.2vh);
}

.apply-btn {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
}

.apply-btn:hover {
  background: linear-gradient(135deg, #66bb6a, #4caf50);
  transform: translateY(-0.2vh);
  box-shadow: 0 0.5vh 1.5vh rgba(76, 175, 80, 0.3);
}

/* 반응형 */
@media (max-width: 768px) {
  .favorite-product-card {
    padding: 2vh 4vw;
  }

  .bank-logo {
    width: 4.5vw;
    height: 4.5vw;
  }

  .heart-icon {
    width: 3vw;
    height: 3vw;
  }

  .favorite-remove-btn {
    width: 6vw;
    height: 6vw;
  }

  .interest-rate {
    font-size: 4vh;
  }

  .base-rate {
    font-size: 2.2vh;
  }

  .risk-info {
    margin-bottom: 0.5vh;
  }

  .action-buttons {
    flex-direction: column;
    gap: 1vh;
  }
}
</style>
