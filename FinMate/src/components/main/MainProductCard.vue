<template>
  <div class="card-container">
    <div>카드</div>
  </div>
</template>

<script setup></script>

<style scoped>
.card-container {
  width: 20vw;
  height: 30vh;
  background-color: #a4c8e1;
  border-radius: 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-container:hover {
  border: 0.7vh solid #fff;
  transition: all 0.1s ease-in-out;
}
</style>
