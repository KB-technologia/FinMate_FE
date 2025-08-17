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
          @error="handleImageError($event, product.bankName)"
        />
      </div>
      <h2 class="product-name">{{ product.name }}</h2>
      <div class="bank-name">{{ product.bankName }}</div>
    </div>

    <div class="fund-stats">
      <div class="stat primary">
        <div class="stat-label">대표 수익률</div>
        <div class="stat-value">
          <strong>{{ formatRate(fundHeadline.rate) }}</strong
          ><span class="unit">%</span>
        </div>
        <div class="stat-sub">{{ fundHeadline.label }}</div>
      </div>

      <div class="stat emerald">
        <div class="stat-label">기준가</div>
        <div class="stat-value">
          <strong>{{ formatAmount(detail.nav) }}</strong
          ><span class="unit">{{ navUnit }}</span>
        </div>
        <div class="stat-sub">
          최초가
          {{
            detail.initialNav != null
              ? `${formatAmount(detail.initialNav)}${navUnit}`
              : '-'
          }}
        </div>
      </div>
      <div class="stat alt">
        <div class="stat-label">순자산(AUM)</div>
        <div class="stat-value">
          <strong>{{ formatAum(detail.aum) }}</strong>
        </div>
        <div class="stat-sub" v-if="detail.baseDate">
          기준일 {{ formatDate(detail.baseDate) }}
        </div>
      </div>
    </div>

    <div v-if="product.aiExplanation" class="character-message-wrapper">
      <!-- 캐릭터 이미지 -->
      <img
        src="@/assets/images/animals/kiwibird.png"
        alt="AI 캐릭터"
        class="character-img avatar-bounce"
      />

      <!-- 말풍선 -->
      <div class="speech-bubble" :class="{ 'is-typing': isTyping }">
        <div class="bubble-content">{{ typedText }}</div>
      </div>
    </div>
  </div>

  <div class="info-card info-grid" id="details">
    <div>
      <span :class="`pill pill-risk ${riskTone(detail.riskGrade)}`"
        >{{ 7 - detail.riskGrade }}등급 ·
        {{ riskLabel(detail.riskGrade) }}</span
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
import { Heart } from 'lucide-vue-next';
import ProductRateChart from './ProductRateChart.vue';
import { ref, computed, toRaw, watch, onBeforeUnmount } from 'vue';
import { getBankLogo, handleImageError } from '../../utils/bank';

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

const detail = computed(() => props.product.detail ?? {});

// NAV 단위(원/좌로 쓰고 싶으면 '원/좌'로 바꿔)
const navUnit = '원';

// 숫자 포맷
const formatAmount = (n) =>
  n == null ? '-' : Number(n).toLocaleString('ko-KR');

// AUM은 억/조 단위로 축약
const formatAum = (n) => {
  if (n == null || !Number.isFinite(+n)) return '-';
  const v = +n;
  const abs = Math.abs(v);
  if (abs >= 1e12) return `${(v / 1e12).toFixed(2).replace(/\\.00$/, '')}조원`;
  if (abs >= 1e8) return `${(v / 1e8).toFixed(2).replace(/\\.00$/, '')}억원`;
  return `${v.toLocaleString('ko-KR')}원`;
};

// 날짜 YYYY.MM.DD
const formatDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}.${mm}.${dd}`;
};

const pr = computed(() => toRaw(props.product.productRate) ?? {});

const numOrNull = (v) =>
  v == null || v === '' ? null : Number.isFinite(+v) ? +v : null;
const R = computed(() => ({
  '1m': numOrNull(pr.value?.returnRate1m),
  '3m': numOrNull(pr.value?.returnRate3m),
  '6m': numOrNull(pr.value?.returnRate6m),
  '12m': numOrNull(pr.value?.returnRate12m),
}));

const fundHeadline = computed(() => {
  const r = R.value;
  if (Number.isFinite(r['3m'])) return { rate: r['3m'], label: '최근 3개월' };
  if (Number.isFinite(r['6m'])) return { rate: r['6m'], label: '최근 6개월' };
  if (Number.isFinite(r['12m']))
    return { rate: r['12m'], label: '최근 1년(단순)' };
  if (Number.isFinite(r['1m'])) return { rate: r['1m'], label: '최근 1개월' };
  return { rate: 0, label: '데이터 없음' };
});

const fundPills = computed(() => {
  const r = R.value;
  const pills = [
    { key: '1m', label: '1M', value: r['1m'] },
    { key: '3m', label: '3M', value: r['3m'] },
    { key: '6m', label: '6M', value: r['6m'] },
    { key: '12m', label: '1Y', value: r['12m'] },
  ];
  return pills.filter((p) => Number.isFinite(p.value));
});

const fundTypeLabel = (t) =>
  ({
    STOCK: '주식형',
    BOND: '채권형',
    MIXED_EQUITY_BOND: '혼합형',
    REAL_ESTATE: '부동산형',
    SPECIAL_ASSET: '특별자산형',
    HYBRID_ASSET: '혼합자산형',
  }[t] || t);
const riskLabel = (n) =>
  ({
    1: '매우 낮은 위험',
    2: '낮은 위험',
    3: '보통 위험',
    4: '다소 높은 위험',
    5: '높은 위험',
    6: '매우 높은 위험',
  }[n] || `${n}`);
const riskTone = (n) =>
  ({
    1: 'risk--verylow', // 초록
    2: 'risk--low', // 청록
    3: 'risk--medium', // 하늘/슬레이트
    4: 'risk--modhigh', // 앰버
    5: 'risk--high', // 오렌지
    6: 'risk--veryhigh', // 로즈
  }[n]);

const infoItems = computed(() => {
  const d = detail.value;
  const items = [
    {
      key: 'description',
      label: '상품 소개',
      value: props.product.description,
      show: props.product.description != null,
      tone: '',
    },
    {
      key: 'bankName',
      label: '판매회사',
      value: props.product.bankName,
      show: !!props.product.bankName,
    },
    {
      key: 'fundType',
      label: '펀드 유형',
      value: fundTypeLabel(d.fundType),
      show: !!d.fundType,
    },

    // 대표 수익률(요건: 3M 기준이라고 했으니 expectedReturn을 3M로 노출)
    {
      key: 'headlineReturn',
      label: '대표 수익률',
      value: `${formatRate(props.product.expectedReturn)}% (3M)`,
      show: props.product.expectedReturn != null,
      tone: 'ok',
    },

    { key: 'manager', label: '운용사', value: d.manager, show: !!d.manager },
    {
      key: 'inceptionDate',
      label: '최초 설정일',
      value: formatDate(d.inceptionDate),
      show: !!d.inceptionDate,
    },

    {
      key: 'nav',
      label: '기준가',
      value: `${formatAmount(d.nav)} 원/좌`,
      show: d.nav != null,
      tone: 'money',
    },
    {
      key: 'initialNav',
      label: '최초가',
      value: `${formatAmount(d.initialNav)} 원/좌`,
      show: d.initialNav != null,
    },
    {
      key: 'baseDate',
      label: '기준일',
      value: formatDate(d.baseDate),
      show: !!d.baseDate,
    },

    {
      key: 'aum',
      label: '순자산(AUM)',
      value: formatAum(d.aum),
      show: d.aum != null,
      tone: 'money',
    },
    {
      key: 'expenseRatio',
      label: '총비용비율(TER)',
      value: `${formatRate(d.expenseRatio)}%`,
      show: d.expenseRatio != null,
    },
    {
      key: 'redemptionPeriod',
      label: '환매 소요일',
      value: `${d.redemptionPeriod} 영업일`,
      show: d.redemptionPeriod != null,
    },
    {
      key: 'productClassCode',
      label: '분류코드',
      value: d.productClassCode,
      show: !!d.productClassCode,
    },
    {
      key: 'associationCode',
      label: '협회코드',
      value: d.associationCode,
      show: !!d.associationCode,
    },
  ];

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

.fund-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .fund-stats {
    grid-template-columns: 1fr;
  }
}

.stat {
  border-radius: 0.875rem;
  padding: 1rem 1.25rem;
}
.stat.primary {
  border-color: #dbeafe;
  background: #f8fbff;
}
.stat.emerald {
  border-color: #bbf7d0;
  background: #ecfdf5;
}
.stat.alt {
  border-color: #fecdd3;
  background: #fff1f2;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}
.stat-value {
  display: flex;
  align-items: baseline;
  gap: 0.125rem;
}
.stat-value strong {
  font-size: 1.6rem;
  color: #111827;
}
.unit {
  font-size: 1rem;
  color: #6b7280;
}
.stat-sub {
  margin-top: 0.2rem;
  color: #6b7280;
  font-size: 0.85rem;
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

.pill {
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #111827;
}

/* 위험등급 전용 색상 6종 */
.pill-risk.risk--verylow {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #065f46;
} /* 매우 낮음: 에메랄드 */
.pill-risk.risk--low {
  background: #f0fdfa;
  border-color: #99f6e4;
  color: #0f766e;
} /* 낮음: 틸 */
.pill-risk.risk--medium {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
} /* 보통: 스카이/블루 */
.pill-risk.risk--modhigh {
  background: #fffbeb;
  border-color: #fde68a;
  color: #b45309;
} /* 다소 높음: 앰버 */
.pill-risk.risk--high {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #c2410c;
} /* 높음: 오렌지 */
.pill-risk.risk--veryhigh {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #e11d48;
} /* 매우 높음: 로즈 */

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

.kv--caution dd {
  color: #b45309;
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
