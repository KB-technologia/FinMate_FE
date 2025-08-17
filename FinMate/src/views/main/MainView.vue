<template>
  <div class="main-view">
    <AttendanceCheckModal
      v-if="showModal"
      :userName="userName"
      :attendanceDays="attendanceDays"
      @close="closeModal"
    />

    <div class="main-view-navigation-bar">
      <TopNavigationBar />
    </div>

    <div class="main-view-content">
      <!-- <div class="main-view-real-time-info-bar">
        <RealTimeInfoBar />
      </div> -->

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
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth/auth';
import AttendanceCheckModal from '@/components/allshared/AttendanceCheckModal.vue';

import TopNavigationBar from '../../components/allshared/TopNavigationBar.vue';
import RealTimeInfoBar from '../../components/main/RealTimeInfoBar.vue';
import ShowStatsContainer from '../../components/main/ShowStatsContainer.vue';
import ProfileContainer from '../../components/main/ProfileContainer.vue';
import RandomProductContainer from '../../components/main/RandomProductContainer.vue';
import FooterComponent from '../../components/allshared/FooterComponent.vue';

const authStore = useAuthStore();

const showModal = ref(false);

const days = authStore.days;
const username = authStore.username;
const userName = ref(username);
const attendanceDays = ref(days);

onMounted(() => {
  if (authStore.isFirst === true) {
    showModal.value = true;
  }
});

const closeModal = () => {
  showModal.value = false;
  authStore.isFirst = false;
};
</script>

<style scoped>
.main-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.main-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/backgroundImage/background_main.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.4;
  z-index: -1;
}

.main-view-navigation-bar {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
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
  gap: 2vh;
}

.main-view-show-stats-and-profile-container {
  display: flex;
  flex-direction: row;
  margin-top: 2vh;
}
.empty-space {
  width: 2vw;
}

.main-view-random-product-container {
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: center;
  margin-top: 1vh;
}

.main-view-footer {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
