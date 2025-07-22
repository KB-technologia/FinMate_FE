<script setup>
import Sidebar from "@/components/info/Sidebar.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
</script>

<template>
  <TopNavigationBar />
  <div class="mypage-container">
    <Sidebar />
    <RightPanel>
      <h2>회원 정보 수정</h2>
      <!-- TODO: UserInfoForm 추가 -->
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
</style>
