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
const userName = ref('김현수'); // 실제 로그인 유저 이름 연동 시 바꿔주세요
const attendanceDays = ref(5); // 실제 데이터로 교체 가능

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.main-view-navigation-bar {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1vh;
  margin-bottom: 1vh;
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
  width: 4vw;
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
