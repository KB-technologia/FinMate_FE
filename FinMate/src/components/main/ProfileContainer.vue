<template>
  <div class="profile-container">
    <button class="custom-login-button">로그인 하러 가기</button>
  </div>
</template>

<script setup></script>

<style scoped>
.profile-container {
  width: 22vw;
  height: 30vh;
  background-color: #ffeab4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2vh;
  padding: 1rem;
}
.custom-login-button {
  width: 50%;
  height: 4rem;
  background-color: #eaddbb;
  color: black;
  font-size: 1.5rem;
  border-radius: 2vh;
  cursor: pointer;
}

.custom-login-button:hover {
  box-shadow: 0 1vh 1vw rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}
</style>
