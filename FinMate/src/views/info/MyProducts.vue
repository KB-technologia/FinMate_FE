<template>
  <div class="mypage">
    <TopNavigationBar />
    <div class="scroll-able">
      <div class="mypage-container">
        <Sidebar />
        <RightPanel :scroll="true">
          <div class="panel-inner">
            <div class="my-products-header">
              <h1 class="title">My Products</h1>
              <CategoryFilterBar
                v-model="selectedCategory"
                :categories="categories"
              />
            </div>
            <p class="subtitle-left">
              총 <span class="highlight">{{ filteredProducts.length }}</span
              >개의 상품을 보유 중이에요!
            </p>

            <div class="product-container">
              <UserProductCard
                v-for="(item, index) in filteredProducts"
                :key="index"
                :icon="item.icon"
                :type="item.type"
                :product="item.product"
              />
            </div>
          </div>
        </RightPanel>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Sidebar from '@/components/info/Sidebar.vue';
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import RightPanel from '@/components/info/RightPanel.vue';
import CategoryFilterBar from '@/components/info/CategoryFilterBar.vue';
import UserProductCard from '@/components/info/UserProductCard.vue';
import FooterComponent from '@/components/allshared/FooterComponent.vue';
import depositIcon from '@/assets/images/products/deposit.png';
import savingIcon from '@/assets/images/products/saving.png';
import fundIcon from '@/assets/images/products/fund.png';

import { getMyProducts } from '@/api/info/userReviewAPI.js';

const selectedCategory = ref('all');
const products = ref([]);
const userProductList = ref([]);

function formatDate(ms) {
  if (!ms) return '-';
  const d = new Date(ms);
  return isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
}
function formatAmount(amt) {
  return amt ? `${amt.toLocaleString()}원` : '-';
}
function getTypeLabel(type) {
  return type === 'DEPOSIT'
    ? '예금'
    : type === 'SAVINGS'
    ? '적금'
    : type === 'FUND'
    ? '펀드'
    : '기타';
}
function getIcon(type) {
  if (type === 'DEPOSIT') return depositIcon;
  if (type === 'SAVINGS') return savingIcon;
  if (type === 'FUND') return fundIcon;
  return depositIcon;
}
function changeProductCard(apiData) {
  return apiData.map((item) => {
    const type = getTypeLabel(item.prod_type);
    const baseProduct = {
      name: item.prod_name,
      type,
      bank: item.bank_name,
      amount: formatAmount(item.balance_amt),
      return: item.expected_return ?? '-',
    };
    if (item.prod_type === 'DEPOSIT' || item.prod_type === 'SAVINGS') {
      baseProduct.start = formatDate(item.start_date);
      baseProduct.end = formatDate(item.end_date);
    }
    if (item.prod_type === 'FUND') {
      baseProduct.fundType = item.fund_type ?? '-';
      baseProduct.riskLevel = item.risk_level ?? '-';
    }
    return {
      type,
      icon: getIcon(item.prod_type),
      product: baseProduct,
    };
  });
}

onMounted(async () => {
  const data = await getMyProducts();
  products.value = data.registered_list;
  userProductList.value = changeProductCard(products.value);
});

const categories = [
  { label: '전체', value: 'all' },
  { label: '예금', value: '예금' },
  { label: '적금', value: '적금' },
  { label: '펀드', value: '펀드' },
];

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') return userProductList.value;
  return userProductList.value.filter(
    (item) => item.type === selectedCategory.value
  );
});
</script>

<style scoped>
.mypage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}
.mypage-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  align-items: flex-start;
}
.scroll-able {
  padding-top: 1vh;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 2vh;
}

.my-products-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.panel-inner {
  display: flex;
  flex-direction: column;
}

.subtitle-left {
  text-align: left;
  color: var(--color-dark-gray);
  font-size: 1.2rem;
  font-weight: var(--font-weight-bold);
  text-decoration: underline;
  font-style: italic;
  margin-bottom: 2rem;
  margin-left: 0.5rem;
}

.highlight {
  color: var(--color-orange);
  font-weight: var(--font-weight-bold);
  font-size: 1.25rem;
}

.product-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
</style>
