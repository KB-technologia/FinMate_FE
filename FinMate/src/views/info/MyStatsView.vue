<script setup>
import Sidebar from "@/components/info/Sidebar.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
import UserStatsPanel from "@/components/info/UserStatsPanel.vue";
</script>

<template>
  <TopNavigationBar />
  <div class="mypage-container">
    <Sidebar />
    <RightPanel :scroll="true" class="stats-right-panel">
      <UserStatsPanel />
    </RightPanel>
  </div>
</template>

<style scoped>
.mypage-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  align-items: flex-start;
}

.stats-right-panel {
  background-color: var(--color-primary-yellow);
  padding: 2rem;
}
</style>
