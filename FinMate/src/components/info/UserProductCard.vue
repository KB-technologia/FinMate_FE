<template>
  <div class="product-box">
    <div class="product-header">
      <img :src="icon" :alt="type + ' 아이콘'" class="icon" />
      <div class="type-wrapper">
        <span class="type">{{ type }}</span>
      </div>
      <span v-if="showTag" class="tag" :class="tagClass">
        {{ isExpired ? "만기완료" : "만기전" }}
      </span>
    </div>

    <ul>
      <li v-for="(label, key) in infoList" :key="key">
        <span class="label">{{ label }}</span>
        <span class="value">{{ product[key] }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  icon: String,
  type: String,
  product: Object,
});

const infoList = {
  name: "상품명",
  bank: "금융기관명",
  amount: "가입금액",
  rate: "이자율/수익률",
  start: "가입일",
  end: "만기일",
};

const showTag = computed(() => props.type === "예금" || props.type === "적금");

const isExpired = computed(() => {
  if (!props.product.end || props.product.end === "제한 없음") return false;
  const today = new Date();
  const endDate = new Date(props.product.end);
  return endDate < today;
});

const tagClass = computed(() => {
  if (props.type === "예금") return "tag-deposit";
  if (props.type === "적금") return "tag-saving";
  return "";
});
</script>

<style scoped>
.product-box {
  flex: 1;
  min-width: 280px;
  border-radius: var(--card-radius);
  padding: 1.5rem;
  background-color: var(--color-white);
  box-shadow: var(--card-shadow);
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
