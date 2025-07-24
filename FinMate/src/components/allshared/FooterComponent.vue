<template>
  <div class="footer-container">
    <div class="footer-left">
      <div class="footer-logo-container">
        <span>FIN MATE</span>
        <img
          src="@/assets/images/kiwiLogo_Footer.png"
          alt="logo"
          class="footer-logo"
        />
      </div>
      <ul class="footer-text">
        <li>서울특별시 강남구 테헤란로 123</li>
      </ul>
      <ul class="footer-text">
        <li>대표전화: 02-1234-5678</li>
        <li>|</li>
        <li>qwer1234@gmail.com</li>
      </ul>
      <ul class="footer-text">
        <li class="footer-link">About</li>
        <li>|</li>
        <li class="footer-link">FAQ</li>
        <li>|</li>
        <li>Copyright © 2025 FinMate. All rights reserved.</li>
      </ul>
    </div>
    <div class="footer-right">
      <i class="fa-brands fa-instagram footer-icon"></i>
      <a
        href="https://github.com/KB-technologia"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="fa-brands fa-github footer-icon"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
import 'hover.css/css/hover-min.css';
import '../../assets/fonts/font.css';
</script>

<style scoped>
.footer-container {
  width: 100vw;
  height: 18vh;
  background-color: var(--color-primary-green);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 3vh;
  font-family: 'TMONBlack';
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
  margin-left: 4vw;
}

.footer-logo-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 3vh;
}
.footer-logo {
  width: 4vw;
  height: auto;
}
.footer-text {
  color: #808080;
  font-size: 0.8rem;
  display: flex;
  flex-direction: row;
  list-style: none;
  gap: 0.3rem;
  padding: 0;
  margin: 0;
}

.footer-link:hover {
  cursor: pointer;
  color: var(--color-white);
  transition: all 0.2s ease-in-out;
}
.footer-right {
  margin-right: 4vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2vw;
}
.footer-icon {
  font-size: 3rem;
  color: var(--color-white);
  margin-right: 1vw;
}

.footer-icon:hover {
  color: #636362;
  transition: all 0.2s ease-in-out;
}
</style>
