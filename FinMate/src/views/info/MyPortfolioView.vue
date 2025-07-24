<script setup>
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import Sidebar from '@/components/info/Sidebar.vue';
import PortfolioContainer from '@/components/portfolio/PortfolioContainer.vue';
</script>

<template>
  <TopNavigationBar />
  <div class="myportfolio-container">
    <Sidebar />
    <div class="right-panel">
      <PortfolioContainer />
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
  background-color: var(--color-primary-yellow);
  max-height: 80vh;
}
</style>
