<template>
  <div class="Product-Container">
    <span class="Product-Text">추천 상품</span>
    <div class="CardContainer">
      <MainProductCard />
      <MainProductCard />
      <MainProductCard />
      <MainProductCard />
    </div>
  </div>
</template>

<script setup>
import MainProductCard from './MainProductCard.vue';
</script>

<style scoped>
.Product-Container {
  width: 95vw;
  height: 50vh;
  background-color: #2e404c;
  border-radius: 2vh;
  display: flex;
  flex-direction: column;
}

.Product-Text {
  margin-top: 2vh;
  color: white;
  font-size: 2rem;
  text-align: center;
}
.CardContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
  gap: 2vw;
}
</style>
