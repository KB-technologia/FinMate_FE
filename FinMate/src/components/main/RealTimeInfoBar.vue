<template>
  <div class="real-time-info-bar-wrapper">
    <div class="real-time-info-bar">
      <div class="real-time-info-bar-track">
        <div
          class="real-time-info-bar-item"
          v-for="(item, index) in scrollingData"
          :key="index"
        >
          <div class="real-time-info-bar-item-title">{{ item.name }}</div>
          <div class="real-time-info-bar-item-value">{{ item.value }}</div>
          <div
            class="real-time-info-bar-item-change"
            :class="{
              positive: item.change.startsWith('+'),
              negative: item.change.startsWith('-'),
            }"
          >
            {{ item.change }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { name: 'KOSPI', value: '3,194.55', change: '-20.35 (0.63%)' },
  { name: '달러 환율', value: '1,315.20', change: '+5.20 (0.41%)' },
  { name: 'NASDAQ', value: '14,105.00', change: '+120.35 (0.85%)' },
  { name: '비트코인', value: '61,200,000', change: '-1,350,000 (-2.2%)' },
  { name: 'S&P500', value: '4,328.21', change: '+12.31 (0.29%)' },
];

const scrollingData = [
  ...data,
  ...data,
  ...data,
  ...data,
  ...data,
  ...data,
  ...data,
  ...data,
  ...data,
];
</script>

<style scoped>
.real-time-info-bar-wrapper {
  overflow: hidden;
  width: 100%;
  border: 1px solid #89caa2;
  border-radius: 2vh;
  background-color: #f8fdfb;
}

.real-time-info-bar-wrapper:hover .real-time-info-bar-track {
  animation-play-state: paused;
}

.real-time-info-bar {
  width: 95vw;
  overflow: hidden;
}

.real-time-info-bar-track {
  display: flex;
  width: max-content;
  animation: scroll 20s linear infinite;
}

.real-time-info-bar-item {
  flex: 0 0 auto;
  width: 200px;
  padding: 1vh;
  text-align: center;
}

.real-time-info-bar-item-title {
  display: block;
  font-weight: bold;
  font-size: 1.1em;
}

.real-time-info-bar-item-value {
  font-size: 1em;
  color: #333;
}

.real-time-info-bar-item-change {
  font-size: 0.9em;
}

.real-time-info-bar-item-change.positive {
  color: #2ecc71;
}

.real-time-info-bar-item-change.negative {
  color: #e74c3c;
}

@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-20%);
  }
}
</style>
