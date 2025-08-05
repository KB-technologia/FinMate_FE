<template>
  <div class="card-container">
    <div class="card-content">
      <h3>{{ product.name }}</h3>
      <p>은행: {{ product.bankName }}</p>
      <p>유형: {{ product.productType }}</p>
      <p>위험도: {{ product.riskLevel }}</p>
    </div>
  </div>
</template>

<script setup>
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
  background-color: var(--color-white);
  border: 0.2vh solid var(--color-light-gray);
  border-radius: 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  transition: all 0.1s ease;
  font-family: var(--font-wanted);
}

.card-container:hover {
  border: 0.2vh solid var(--color-light-blue);
  cursor: pointer;
  transform: translateY(-0.8vh);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.6px;
  text-align: left;
  align-items: flex-start;
}

.card-content p {
  font-size: 1.1rem;
  font-weight: var(--font-weight-regular);
}

.card-content h3 {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: 1.4rem;
  width: 100%;
  text-align: center;
}

.card-info-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: var(--font-weight-regular);
}

.card-info-row .label {
  width: 6rem;
  text-align: right;
  font-weight: var(--font-weight-medium);
}

.card-info-row .value {
  text-align: left;
  font-weight: var(--font-weight-regular);
}
</style>
