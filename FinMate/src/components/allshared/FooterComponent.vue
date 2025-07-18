<template>
  <div class="footer-container">
    <div></div>
    <div class="footer-content">
      <div class="empty-content"></div>
      <div class="footer-content-top">
        <div class="footer-logo">
          <img
            class="footer-logo-image"
            src="@/assets/images/kiwiLogo_Footer.png"
            alt="FIN MATE Logo"
          />
          <p>FIN MATE</p>
        </div>
        <div class="footer-navigate">Navigate</div>
        <div class="footer-address">주소</div>
      </div>
      <p>Copyright © 2025 FIN MATE All rights reserved</p>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.footer-container {
  width: 100vw;
  height: 25vh;
  background-color: #89caa2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  width: 80vw;
  color: black;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 90%;
}

.empty-content {
  width: 100%;
  height: 12vh;
}

.footer-content-top {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.footer-logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
}
</style>
