<template>
  <div class="product-detail-card" id="summary">
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
          :src="getBankLogo(product.bankName)"
          class="bank-logo"
          :alt="product.bankName"
        />
      </div>
      <h2 class="product-name">{{ product.name }}</h2>
      <div class="bank-name">{{ product.bankName }}</div>
    </div>

    <div class="rates">
      <div class="rate-box primary">
        <div class="rate-label">기본</div>
        <div class="rate-value">
          <strong>{{ formatRate(product.expectedReturn) }}</strong
          ><span class="unit">%</span>
        </div>
        <div class="rate-sub">
          (세전, {{ product.detail.defaultTermMonths ?? '-' }}개월)
        </div>
      </div>
      <div class="rate-box alt">
        <div class="rate-label">최고</div>
        <div class="rate-value">
          <strong>{{
            formatRate(product.detail.bonusRate + product.expectedReturn)
          }}</strong
          ><span class="unit">%</span>
        </div>
        <div class="rate-sub">우대 금리 포함</div>
      </div>
    </div>

    <div
      v-if="product.aiExplanation"
      class="character-message-wrapper"
      id="character-message"
    >
      <!-- 캐릭터 이미지 -->
      <img
        src="@/assets/images/animals/kiwibird.png"
        alt="AI 캐릭터"
        class="character-img"
      />

      <!-- 말풍선 -->

      <div class="speech-bubble" :class="{ 'is-typing': isTyping }">
        <div class="bubble-content">{{ typedText }}</div>
      </div>
    </div>
  </div>

  <div class="info-card info-grid" id="details">
    <!-- 태그 -->
    <div v-if="tags.length" class="pill-list">
      <span
        v-for="(tag, i) in tags"
        :key="i"
        class="pill"
        :class="`pill--${tag.tone}`"
        >{{ tag.text }}</span
      >
    </div>

    <dl class="kv-list">
      <div
        v-for="it in infoItems"
        :key="it.key"
        class="kv-row"
        :class="it.tone && `kv--${it.tone}`"
      >
        <dt>{{ it.label }}</dt>
        <dd v-html="it.value"></dd>
      </div>
    </dl>

    <div
      v-if="['DEPOSIT', 'SAVINGS'].includes(product.productType)"
      class="protection-note"
    >
      <p class="note-text">
        <strong>예금자 보호</strong>
        이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당
        5천만원까지 ({{ product.bankName }}의 여타 보호 상품과 합산) 보호됩니다.
      </p>
    </div>
    <div class="actions">
      <a :href="product.url" target="_blank" class="btn solid"
        >이 상품 보러가기 🔗</a
      >
    </div>
  </div>

  <ProductRateChart
    v-if="product.productRate"
    :product-rate="product.productRate"
    :title="product.productType === 'FUND' ? '수익률 추이' : '이율 추이'"
    :show-zero-line="product.productType === 'FUND'"
  />
</template>

<script setup>
import ProductRateChart from './ProductRateChart.vue';
import { Heart } from 'lucide-vue-next';
import { ref, computed, onBeforeUnmount, watch } from 'vue';
import { getBankLogo } from '../../utils/bank';

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

const getPaymentCycle = (cycle) => {
  const map = {
    DAILY: '매일',
    WEEKLY: '매주',
    MONTHLY: '매월',
  };
  return map[cycle] || cycle;
};

const detail = computed(() => props.product?.detail ?? {});

const tags = computed(() => {
  const d = detail.value;
  const t = [];

  // 연령/성별
  if (d.minAge != null || d.maxAge != null) {
    const label =
      d.minAge != null && d.maxAge != null
        ? `만 ${d.minAge}~${d.maxAge}세`
        : d.minAge != null
        ? `만 ${d.minAge}세 이상`
        : `만 ${d.maxAge}세 이하`;
    t.push({ text: label, tone: 'slate' });
  }
  if (d.gender) {
    const g =
      { MALE: '남성', FEMALE: '여성', ANY: '누구나' }[d.gender] || d.gender;
    if (g !== '누구나')
      t.push({ text: g, tone: g === '남성' ? 'indigo' : 'rose' });
  }

  // 불린 조건: key, label, tone
  [
    ['isMarried', '기혼', 'purple'],
    ['hasJob', '직장인', 'blue'],
    ['usesPublicTransport', '대중교통 이용', 'teal'],
    ['travelsFrequently', '여행/출장 잦음', 'orange'],
    ['doesExercise', '운동 습관', 'emerald'],
    ['hasChildren', '자녀 있음', 'amber'],
    ['hasHouse', '주택 보유', 'indigo'],
    ['employedAtSme', '중소기업 재직', 'green'],
    ['usesMicroloan', '미소금융 이용', 'rose'],
  ].forEach(([key, label, tone]) => {
    if (d[key] === true) t.push({ text: label, tone });
  });

  if (d.minAmount != null)
    t.push({
      text: `${Number(d.minAmount).toLocaleString()}원 이상`,
      tone: 'cyan',
    });
  if (d.defaultTermMonths != null)
    t.push({ text: `기본 ${d.defaultTermMonths}개월`, tone: 'lime' });

  return t;
});

const infoItems = computed(() => {
  const d = detail.value;
  const items = [
    {
      key: 'description',
      label: '상품 소개',
      value: props.product.description,
      show: props.product.description != null,
    },
    {
      key: 'minAmount',
      label: '최소 가입 금액',
      value: `${formatAmount(d.minAmount)}원`,
      show: d.minAmount != null,
      tone: 'money',
    },
    {
      key: 'minTerm',
      label: '최소 가입 기간',
      value: `${d.minTerm}개월`,
      show: d.minTerm != null,
    },
    {
      key: 'defaultTermMonths',
      label: '기본 가입 기간',
      value: `${d.defaultTermMonths}개월`,
      show: d.defaultTermMonths != null,
    },
    {
      key: 'interestType',
      label: '이자 유형',
      value: getInterestType(d.interestType),
      show: !!d.interestType,
    },
    {
      key: 'compoundingPeriod',
      label: '복리 주기',
      value: getCompoundingPeriod(d.compoundingPeriod),
      show: !!d.compoundingPeriod,
    },
    {
      key: 'earlyWithdrawalPenalty',
      label: '중도 해지 패널티',
      value: `${d.earlyWithdrawalPenalty}%`,
      show: d.earlyWithdrawalPenalty != null,
      tone: (d.earlyWithdrawalPenalty ?? 0) > 0 ? 'warn' : '',
    },
    {
      key: 'isFlexible',
      label: '자유 입출금',
      value: d.isFlexible ? '가능' : '불가능',
      show: d.isFlexible != null,
      tone: d.isFlexible ? 'ok' : '',
    },
  ];

  if (props.product.productType === 'SAVINGS') {
    items.push(
      {
        key: 'paymentCycle',
        label: '납입 주기',
        value: getPaymentCycle(d.paymentCycle),
        show: !!d.paymentCycle,
      },
      {
        key: 'maxMonthlyPayment',
        label: '최대 월 납입액',
        value: `${formatAmount(d.maxMonthlyPayment)}원`,
        show: d.maxMonthlyPayment != null,
        tone: 'money',
      }
    );
  }

  return items.filter((it) => it.show);
});

const sanitized = computed(() =>
  (props.product.aiExplanation ?? '').replace(/["]/g, '')
);

const typedText = ref('');
const isTyping = ref(false);
let timerId = null;

const startTyping = () => {
  clearInterval(timerId);
  const full = sanitized.value;
  typedText.value = '';

  if (!full) {
    isTyping.value = false;
    return;
  }

  const len = full.length;
  // 긴 문장은 살짝 가속
  const base = 30;
  const step = len > 300 ? Math.max(10, base - 6) : base;

  isTyping.value = true;
  let i = 0;
  timerId = setInterval(() => {
    typedText.value += full[i++];
    if (i >= len) {
      clearInterval(timerId);
      timerId = null;
      isTyping.value = false;
    }
  }, step);
};
watch(sanitized, startTyping, { immediate: true });
onBeforeUnmount(() => clearInterval(timerId));
</script>

<style scoped>
.product-detail-card {
  width: 62.5rem;
  max-width: 62.5rem;
  margin: 0 auto;
  padding: 2.5rem;
  border-radius: var(--card-radius);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  background-color: var(--color-white);
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

.info-card {
  width: 62.5rem;
  max-width: 62.5rem;
  margin: 1rem auto;
  padding: 2.5rem;
  position: relative;
  border-radius: var(--card-radius);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  background-color: var(--color-white);
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.kv-list {
  display: grid;
  gap: 0.25rem;
  border-top: 1px solid #eef2f7;
  padding-top: 0.75rem;
}
.kv-row {
  display: grid;
  grid-template-columns: 9rem 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}
.kv-row:not(:last-child) {
  border-bottom: 1px dashed #edf2f7;
}
.kv-row dt {
  color: #6b7280;
  font-weight: 600;
}
.kv-row dd {
  margin: 0;
  color: #111827;
  font-weight: 700;
}

/* 강조 톤 */
.kv--warn dd {
  color: #b91c1c;
} /* 패널티 붉은 기조 */
.kv--ok dd {
  color: #166534;
} /* 유연성 초록 기조 */
.kv--money dd {
  color: #0f766e;
} /* 금액 항목 청록 기조 */

.product-link {
  color: var(--color-blue);
  text-decoration: underline;
  font-weight: 500;
}

.rates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.25rem;
}
.rate-box {
  border: 1px solid var(--card-border);
  border-radius: 0.875rem;
  padding: 1rem 1.25rem;
  background: #fff;
}
.rate-box.primary {
  border-color: #dbeafe;
  background: #f8fbff;
}
.rate-box.alt {
  border-color: #dcfce7;
  background: #f6fdf9;
}
.rate-label {
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
.rate-value {
  display: flex;
  align-items: baseline;
  gap: 0.125rem;
}
.rate-value strong {
  font-size: 2rem;
  letter-spacing: -0.02em;
  color: var(--text-strong);
}
.unit {
  font-size: 1rem;
  color: var(--muted);
}
.rate-sub {
  margin-top: 0.25rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
.btn.solid {
  font-size: var(--btn-font-size);
  border-radius: var(--btn-radius);
  background: var(--btn-gradient);
  color: var(--color-white);
  border: none;
  transition: all 0.2s ease;
}
.btn.solid:hover {
  box-shadow: var(--btn-hover-shadow);
  transform: translateY(var(--btn-hover-translate));
}

.protection-note {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: #f8fafc; /* 연회색 배경 */
  border: 1px solid #e5e7eb; /* 연회색 테두리 */
  color: #4b5563; /* 텍스트 회색 */
  margin-top: 0.5rem;
}
.note-text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0 0;
}
.pill {
  padding: 0.375rem 0.6rem;
  border-radius: 999px;
  background: #f1f5f9; /* 연한 배경 */
  border: 1px solid #e5e7eb; /* 연한 테두리 */
  font-size: 0.84rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.pill--blue {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}
.pill--indigo {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}
.pill--purple {
  background: #f5f3ff;
  border-color: #ddd6fe;
  color: #7c3aed;
}
.pill--teal {
  background: #f0fdfa;
  border-color: #99f6e4;
  color: #0f766e;
}
.pill--emerald {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #059669;
}
.pill--green {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #16a34a;
}
.pill--amber {
  background: #fffbeb;
  border-color: #fde68a;
  color: #b45309;
}
.pill--orange {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #c2410c;
}
.pill--rose {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #e11d48;
}
.pill--cyan {
  background: #ecfeff;
  border-color: #a5f3fc;
  color: #0891b2;
}
.pill--lime {
  background: #f7fee7;
  border-color: #d9f99d;
  color: #65a30d;
}
.pill--slate {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #334155;
}

.character-message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 1rem; /* 캐릭터와 말풍선 간격 */
  max-width: 62.5rem;
  margin: 1rem auto;
}
.character-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  /* 튀는 느낌 제어용 변수 */
  --bounce-amp: 14px; /* 튀는 높이 */
  --bounce-duration: 1.6s; /* 한 사이클 시간 */
  transform-origin: 50% 100%; /* 바닥을 기준으로 찌그러짐 */
  animation: bounce var(--bounce-duration) cubic-bezier(0.34, 1.56, 0.64, 1)
    infinite;
  will-change: transform;
}

/* 통통 튀는 모션 (스쿼시&스트레치 포함) */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0) scale(1, 1);
  }
  20% {
    transform: translateY(calc(-1 * var(--bounce-amp))) scale(0.98, 1.02); /* 공중에서 살짝 늘어남 */
  }
  40% {
    transform: translateY(0) scale(1.06, 0.94); /* 바닥 착지: 납작+반동 */
  }
  55% {
    transform: translateY(calc(-0.5 * var(--bounce-amp))) scale(0.99, 1.01);
  }
  70% {
    transform: translateY(0) scale(1.03, 0.97);
  }
}

/* 약하게/강하게 버전 (원하면 클래스만 추가) */
.avatar-bounce--soft {
  --bounce-amp: 9px;
  --bounce-duration: 1.8s;
}
.avatar-bounce--hard {
  --bounce-amp: 18px;
  --bounce-duration: 1.3s;
}

/* 접근성: 움직임 최소화 환경 */
@media (prefers-reduced-motion: reduce) {
  .avatar-bounce {
    animation: none;
  }
}
.speech-bubble {
  position: relative;
  background: var(--color-white);
  border: var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  padding: 1.5rem 2rem;
  max-width: 100%;
  line-height: 1.5;
}
.bubble-content {
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
}
.bubble-content::after {
  content: '';
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 2px;
  background: currentColor;
  opacity: 0;
}
.speech-bubble.is-typing .bubble-content::after {
  animation: caret 1s steps(1) infinite;
  opacity: 1;
}
@keyframes caret {
  50% {
    opacity: 0;
  }
}

/* 말풍선 꼬리 */

/* 꼬리 테두리(바깥) */
.speech-bubble::before {
  content: '';
  position: absolute;
  top: 20px;
  left: -17px; /* 바깥 삼각형이 더 크니 조금 더 왼쪽 */
  border-width: 11px 16px 11px 0; /* 바깥이 한 사이즈 큼 */
  border-style: solid;
  border-color: transparent var(--color-light-gray) transparent transparent;
}

/* 꼬리 배경(안쪽) */
.speech-bubble::after {
  content: '';
  position: absolute;
  top: 20px;
  left: -15px; /* 안쪽이 살짝 덮도록 */
  border-width: 10px 15px 10px 0;
  border-style: solid;
  border-color: transparent var(--color-white) transparent transparent;
}
</style>
