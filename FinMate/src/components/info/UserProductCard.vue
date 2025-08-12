<template>
  <div class="product-box">
    <div class="product-header">
      <img :src="icon" :alt="type + ' 아이콘'" class="icon" />
      <div class="type-wrapper">
        <span class="type">{{ type }}</span>
      </div>
    </div>
    <ul>
      <li>
        <span class="label">상품명</span
        ><span class="value">{{ product.name }}</span>
      </li>
      <li>
        <span class="label">상품유형</span
        ><span class="value">{{ product.type }}</span>
      </li>
      <li>
        <span class="label">금융기관</span
        ><span class="value">{{ product.bank }}</span>
      </li>
      <li>
        <span class="label">가입금액</span
        ><span class="value">{{ product.amount }}</span>
      </li>
      <li>
        <span class="label">기대 수익률</span
        ><span class="value">{{ product.return }}%</span>
      </li>

      <li v-if="product.start">
        <span class="label">가입일</span
        ><span class="value">{{ product.start }}</span>
      </li>
      <li v-if="product.end">
        <span class="label">만기일</span
        ><span class="value">{{ product.end }}</span>
      </li>

      <li v-if="product.fundType">
        <span class="label">펀드유형</span
        ><span class="value">{{ product.fundType }}</span>
      </li>
      <li v-if="product.riskLevel">
        <span class="label">위험도</span
        ><span class="value">{{ riskLevelText }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: String,
  type: String,
  product: Object,
});

const riskLevelText = computed(() => {
  const level = props.product.riskLevel;
  const map = {
    2: '매우 낮음',
    3: '낮음',
    4: '중간',
    5: '다소 높음',
    6: '높음',
    7: '매우 높음',
  };
  return map[level];
});
</script>

<style scoped>
.product-box {
  flex: 1;
  min-width: 280px;
  border: 2px solid var(--color-primary-bluegray);
  border-radius: 16px;
  padding: 1.5rem;
  background-color: var(--color-white);
  font-family: var(--font-wanted);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  position: relative;
}

.icon {
  width: 60px;
  height: 60px;
}

.type-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.type {
  font-family: var(--font-wanted);
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.tag {
  font-size: 0.75rem;
  background-color: var(--color-green);
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-weight: bold;
  white-space: nowrap;
}

.tag-deposit {
  background-color: var(--color-deposit-blue);
  color: var(--color-white);
}

.tag-saving {
  background-color: var(--color-saving-orange);
  color: var(--color-white);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
}

li:not(:last-child) {
  border-bottom: 1px solid var(--color-primary-bluegray);
}

.label {
  font-family: var(--font-wanted);
  font-weight: bold;
}

.value {
  font-family: var(--font-wanted);
}
</style>
