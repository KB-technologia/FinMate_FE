<template>
  <nav class="top-navigation-bar">
    <div class="empty-space"></div>
    <div class="top-navigation-bar-logo-container">
      <img
        src="@/assets/images/logos/kiwiLogo4.png"
        class="top-navigation-bar-logo"
      />
      <div class="top-navigation-bar-title" @click="$router.push('/')">
        FinMate
      </div>
    </div>
    <div class="top-navigation-menu-right">
      <div
        class="top-navigation-menu-right-item"
        :class="{ active: route.path === '/favorites' }"
        @click="$router.push('/favorites')"
      >
        <Tooltip text="즐겨찾기" theme="naver">
          <Heart class="icon-large heart-filled" />
        </Tooltip>
      </div>
      <div
        class="top-navigation-menu-right-item"
        :class="{ active: route.path === '/products' }"
        @click="$router.push('/products')"
      >
        <Tooltip text="상품 검색" theme="naver">
          <PackageSearch class="icon-large" />
        </Tooltip>
      </div>
      <div
        class="top-navigation-menu-right-item"
        :class="{ active: route.path === '/my-stats' }"
        @click="$router.push('/my-stats')"
      >
        <Tooltip text="마이페이지" theme="naver">
          <CircleUserRound class="icon-large" />
        </Tooltip>
      </div>
    </div>
  </nav>
</template>

<script setup>
import '@/styles/fonts.css';
import { CircleUserRound, PackageSearch, Heart } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import Tooltip from '@/components/allshared/Tooltip.vue';

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
  margin-top: 1vh;
  margin-bottom: 1vh;
}

.top-navigation-bar-logo-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10vw;
}

.top-navigation-bar-logo {
  width: 13%;
}
.empty-space {
  width: 100%;
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

  width: 100%;
  height: 100%;
}

.top-navigation-menu-right-item {
  width: 2vw;
  height: 3vh;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2vw;
}

.top-navigation-menu-right-item:hover {
  cursor: pointer;
  color: var(--color-white);
}
.top-navigation-menu-right-item.active {
  color: var(--color-white);
}
.icon-large {
  width: 3vw;
  height: 3vh;
}
</style>
