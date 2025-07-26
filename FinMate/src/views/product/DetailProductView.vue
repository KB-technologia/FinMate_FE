<template>
  <TopNavigationBar />

  <div class="product-page-container">
    <div class="scrollable-content">
      <div class="product-card-wrapper">
        <ProductDetailCard :product="mockProduct" />
      </div>
      <h1 class="page-title">Product Review</h1>
      <FooterComponent />
    </div>
  </div>
</template>

<script setup>
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import FooterComponent from "@/components/allshared/FooterComponent.vue";
import ProductDetailCard from "@/components/product/ProductDetailCard.vue";

// TODO: API 연동(테스트용 mock 데이터)
const mockProduct = {
  id: 1,
  name: "국민 퍼스트 예금1",
  bankName: "KB국민은행",
  productType: "DEPOSIT",
  expectedReturn: 1.8,
  riskLevel: 1,
  detail: {
    bonusRate: 1.0,
    minTerm: 12,
    minAmount: 1000000,
    defaultTermMonths: 12,
    interestType: "SIMPLE",
    compoundingPeriod: "MONTHLY",
    earlyWithdrawalPenalty: 0.5,
    isFlexible: false,
  },
};
</script>

<style scoped>
.product-page-container {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scrollable-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(1rem, 4vw, 2rem);
  gap: clamp(1rem, 4vh, 2rem);
}

.page-title {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  text-align: center;
  color: var(--color-black);
}

.product-card-wrapper {
  width: 100%;
  max-width: 62.5rem;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
}
</style>
