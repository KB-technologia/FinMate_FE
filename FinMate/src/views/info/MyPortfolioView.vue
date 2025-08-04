<script setup>
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import Sidebar from '@/components/info/Sidebar.vue';
import PortfolioDataView from '@/components/info/portfolio/PortfolioData.vue';
import PortfolioEmptyView from '@/components/info/portfolio/PortfolioEmpty.vue';
import { ref, onMounted } from 'vue';
import { getPortfolio } from '@/api/portfolio/portfolio.js';

const portfolio = ref(null);

async function fetchPortfolio() {
  try {
    const res = await getPortfolio();
    portfolio.value = res.data;
    console.log('포트폴리오 로딩 성공');
  } catch (e) {
    console.error('포트폴리오 로딩 실패', e);
    portfolio.value = null;
  }
}
onMounted(fetchPortfolio);
</script>

<template>
  <TopNavigationBar />
  <div class="myportfolio-container">
    <Sidebar />
    <div class="right-panel">
      <PortfolioDataView
        v-if="portfolio"
        :portfolio="portfolio"
        @requestRefresh="fetchPortfolio"
      />
      <PortfolioEmptyView v-else @save="fetchPortfolio" />
    </div>
  </div>
</template>
<style scoped>
.myportfolio-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  align-items: flex-start;
}
.right-panel {
  flex-grow: 1;
  padding: 2rem;
  border: 3px solid var(--color-primary-bluegray);
  border-radius: 4px;
  min-height: 80vh;
  overflow-y: auto;
}
</style>
