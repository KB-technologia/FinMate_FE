<template>
  <div class="main-view">
    <div class="main-view-navigation-bar">
      <TopNavigationBar />
    </div>

    <div class="main-view-content">
      <div class="mypage-container">
        <Sidebar />
        <RightPanel :scroll="false">
          <div class="panel-inner">
            <h2 class="title">회원 정보 수정</h2>
            <UserInfoForm />
          </div>
        </RightPanel>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/info/Sidebar.vue";
import TopNavigationBar from "@/components/allshared/TopNavigationBar.vue";
import RightPanel from "@/components/info/RightPanel.vue";
import UserInfoForm from "@/components/info/UserInfoForm.vue";
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
  width: 100%;
  padding: 2vh 0;
}

.mypage-container {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  align-items: flex-start;
  width: 95vw;
  margin-left: 4vw;
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
