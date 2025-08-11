<script setup>
import Sidebar from '@/components/info/Sidebar.vue';
import TopNavigationBar from '@/components/allshared/TopNavigationBar.vue';
import RightPanel from '@/components/info/RightPanel.vue';
import UserStatsPanel from '@/components/info/stats/UserStatsPanel.vue';
import FooterComponent from '../../components/allshared/FooterComponent.vue';
</script>

<template>
  <div class="mypage">
    <TopNavigationBar />
    <div class="scroll-able">
      <div class="mypage-container">
        <Sidebar />
        <RightPanel :scroll="true" class="stats-right-panel">
          <UserStatsPanel />
        </RightPanel>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
.mypage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.mypage::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/backgroundImage/background_myinfo.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: -1;
}
.scroll-able {
  padding-top: 1vh;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 2vh;
}
.mypage-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 4rem;
  align-items: flex-start;
}

.stats-right-panel {
  padding: 2rem;
}
</style>
