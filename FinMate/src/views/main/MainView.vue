<template>
  <div class="main-view">
    <div class="main-view-navigation-bar">
      <TopNavigationBar />
    </div>
    <div class="main-view-content">
      <div class="main-view-real-time-info-bar">
        <!-- 현재 임의로 실시간 데이터 받아오는 거 처럼 보임 -->
        <RealTimeInfoBar />
      </div>
      <div class="main-view-show-stats-and-profile-container">
        <ShowStatsContainer />
        <div class="empty-space"></div>
        <ProfileContainer />
      </div>
      <div class="main-view-random-product-container">
        <RandomProductContainer />
      </div>
      <div class="main-view-footer">
        <FooterComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import RealTimeInfoBar from '../../components/main/RealTimeInfoBar.vue';
import ShowStatsContainer from '../../components/main/ShowStatsContainer.vue';
import ProfileContainer from '../../components/main/ProfileContainer.vue';
import RandomProductContainer from '../../components/main/RandomProductContainer.vue';
import FooterComponent from '../../components/allshared/FooterComponent.vue';
</script>

<style scoped>
.main-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.main-view-content {
  padding-top: 1vh;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 3vh;
}

.main-view-show-stats-and-profile-container {
  display: flex;
  flex-direction: row;
}
.empty-space {
  width: 5vw;
}

.main-view-random-product-container {
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: center;
}
.main-view-footer {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
