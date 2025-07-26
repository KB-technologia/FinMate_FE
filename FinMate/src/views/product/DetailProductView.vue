<template>
  <TopNavigationBar />

  <div class="product-review-page">
    <div class="product-card-wrapper">
      <ProductDetailCard :product="mockProduct" />
    </div>
    <h1 class="page-title">Product Review</h1>
  </div>

  <FooterComponent />
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
.product-review-page {
  min-height: 80vh;
  padding: 4vh 2vw;
}

.page-title {
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin-bottom: 3vh;
  color: var(--color-black);
}

.product-card-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 3vh;
  width: 100%;
}
</style>
