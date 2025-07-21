<template>
  <nav class="top-navigation-bar">
    <div class="top-navigation-bar-logo-container">
      <img
        class="top-navigation-bar-logo-image"
        src="../../assets/images/kiwiLogo.png"
        alt="logo"
      />
      <div
        class="top-navigation-bar-title hvr-underline-from-center"
        @click="$router.push('/')"
      >
        FIN MATE
      </div>
    </div>
    <div class="top-navigation-menu-right">
      <div class="top-navigation-menu-right-item hvr-underline-from-center">
        금융 아이템
      </div>
      <div class="top-navigation-menu-right-item hvr-underline-from-center">
        추천 아이템
      </div>
      <div class="top-navigation-menu-right-item hvr-underline-from-center">
        자유게시판
      </div>
      <div class="top-navigation-menu-right-item hvr-underline-from-center">
        투자 성향 테스트
      </div>
      <div
        class="top-navigation-menu-right-item hvr-underline-from-center"
        @click="$router.push('/my-info')"
      >
        내 정보
      </div>
    </div>
  </nav>
</template>

<script setup>
import '../../assets/fonts/font.css';
import 'hover.css/css/hover-min.css';
</script>

<style scoped>
.top-navigation-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
  height: 13vh;
  background-color: #89caa2;
  justify-content: space-between;
  font-family: 'TMONBlack';
}

.top-navigation-bar-logo-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 30vw;
  height: 10vw;
}

.top-navigation-bar-logo {
  width: 10vw;
  height: 10vw;
}

.top-navigation-bar-logo-image {
  width: 8vw;
  height: 100%;
  object-fit: contain;
}

.top-navigation-bar-title {
  font-size: 3rem;
  font-weight: bold;
}
.top-navigation-bar-title:hover {
  cursor: pointer;
  color: #fff;
  transition: all 0.2s ease-in-out;
}

.top-navigation-bar-title.hvr-underline-from-center::before {
  background-color: #fff;
}

.top-navigation-menu-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 50vw;
  height: 100%;
  margin-right: 5vw;
}

.top-navigation-menu-right-item {
  font-size: 1.5rem;
}

.top-navigation-menu-right-item:hover {
  cursor: pointer;
  color: #fff;
  transition: all 0.2s ease-in-out;
}

.top-navigation-menu-right-item.hvr-underline-from-center::before {
  background-color: #fff;
}
</style>
