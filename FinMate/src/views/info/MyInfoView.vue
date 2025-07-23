<script setup>
import Sidebar from "@/components/info/Sidebar.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
import UserInfoForm from "@/components/info/UserInfoForm.vue";
</script>

<template>
  <TopNavigationBar />
  <div class="mypage-container">
    <Sidebar />
    <RightPanel :scroll="false">
      <div class="panel-inner">
        <h2 class="title">회원 정보 수정</h2>
        <UserInfoForm />
      </div>
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

.panel-inner {
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
}
</style>
