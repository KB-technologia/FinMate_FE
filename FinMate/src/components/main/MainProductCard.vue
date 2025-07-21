<template>
  <div class="card-container">
    <div class="card-content">
      <h3>{{ product.name }}</h3>
      <p><strong>은행:</strong> {{ product.bank }}</p>
      <p><strong>유형:</strong> {{ product.type }}</p>
      <p><strong>위험도:</strong> {{ product.risk }}</p>
      <p><strong>예상 수익률:</strong> {{ product.return }}</p>
    </div>
  </div>
</template>

<script setup>
import '../../assets/fonts/font.css';

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card-container {
  width: 20vw;
  height: 30vh;
  background-color: #a4c8e1;
  border-radius: 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
  font-family: 'TMONBlack';
}
.card-container:hover {
  border: 0.7vh solid #fff;
  transition: all 0.1s ease-in-out;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: center;
}
</style>
