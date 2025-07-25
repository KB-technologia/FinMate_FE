<template>
  <div class="login-form-container">
    <div class="login-container">
      <h1>로그인</h1>
      <div class="login-form">
        <input v-model="id" type="text" placeholder="아이디 입력" class="" />
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호 입력"
          class=""
        />
        <button @click="login" class="login-button">로그인</button>
        <div class="kakao-login">
          <button @click="kakaoLogin" class="kakao-button">
            <img
              src="@/assets/images/speech.png"
              alt="speech"
              class="speech-icon"
            />
            카카오 로그인
          </button>
        </div>
        <div class="etc">
          <p>회원가입</p>
          <p>|</p>
          <p>아이디 찾기</p>
          <p>|</p>
          <p>비밀번호 찾기</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth';
import { useToast } from '@/composables/useToast';

import '../../assets/fonts/font.css';

const { toast } = useToast();
const id = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  const success = await authStore.login(id.value, password.value);

  if (success) {
    toast('환영합니다! 성공적으로 로그인되었어요.', 'success');
    router.push('/');
  } else {
    toast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
  }
};

const kakaoLogin = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  window.location.href = kakaoAuthUrl;

  console.log('카카오 로그인 URL : ', kakaoAuthUrl);
};
</script>

<style scoped>
.login-form-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 70vh;
  align-items: center;
  justify-content: center;
  font-family: var(--font-inter);
}

.login-container {
  width: 30vw;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3vh;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:hover {
  border-color: var(--color-primary-green);
  outline: none;
}

input:focus {
  border-color: var(--color-primary-green);
  outline: none;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-dark-gray);
  color: var(--color-white);
  border: none;
  border-radius: 1vh;
  cursor: pointer;
  height: 6vh;
}

.kakao-login button {
  width: 100%;
  padding: 10px;
  height: 6vh;
  background-color: #fee500;
  color: var(--color-black);
  border: none;
  border-radius: 1vh;
  cursor: pointer;
}

.speech-icon {
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
}

.etc {
  display: flex;
  justify-content: space-between;
  padding: 3vh;
}
</style>
