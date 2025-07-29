<template>
  <nav class="top-navigation-bar">
    <div class="empty-space"></div>
    <div class="top-navigation-bar-logo-container">
      <div class="top-navigation-bar-title" @click="$router.push('/')">
        FIN MATE
      </div>
    </div>
    <div class="top-navigation-menu-right">
      <div
        class="top-navigation-menu-right-item"
        @click="$router.push('/products')"
      >
        <PackageSearch class="icon-large" />
      </div>
      <!-- <div class="top-navigation-menu-right-item hvr-underline-from-center">
        추천 아이템
      </div>
      <div class="top-navigation-menu-right-item hvr-underline-from-center">
        자유게시판
      </div> -->
      <!-- <div
        class="top-navigation-menu-right-item hvr-underline-from-center"
        :class="{
          active: route.path === '/quizstart' || route.path === '/quiz',
        }"
        @click="$router.push('/quizstart')"
      >
        투자 성향 테스트
      </div> -->
      <div
        class="top-navigation-menu-right-item"
        :class="{ active: route.path === '/my-stats' }"
        @click="$router.push('/my-stats')"
      >
        <CircleUserRound class="icon-large" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import '@/styles/fonts.css';
import { CircleUserRound, PackageSearch } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<style scoped>
.top-navigation-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 95vw;
  height: 7vh;
  background-color: var(--color-primary-green);
  border-radius: 2vh;
  justify-content: space-between;
  font-family: var(--font-wanted);
  font-weight: var(--font-weight-bold);
}

.top-navigation-bar-logo-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 40vw;
  height: 10vw;
}

.top-navigation-bar-logo {
  width: 100vw;
  height: 10vw;
}
.empty-space {
  width: 85%;
  height: 100%;
}
.top-navigation-bar-title {
  font-size: 3rem;
  font-weight: bold;
  transition: all 0.2s ease;
}
.top-navigation-bar-title:hover {
  color: var(--color-white);
  cursor: pointer;
}

.top-navigation-menu-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 2vw;
  width: 50vw;
  height: 100%;
  margin-right: 5vw;
}

.top-navigation-menu-right-item {
  width: 2vw;
  height: 3vh;
  transition: all 0.2s ease;
}

.top-navigation-menu-right-item:hover {
  cursor: pointer;
  color: var(--color-white);
}
.icon-large {
  width: 3vw;
  height: 3vh;
}
</style>
