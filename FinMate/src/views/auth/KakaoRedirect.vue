<template>
  <div>카카오 로그인 처리 중입니다...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth/auth';
import { useToast } from '@/composables/useToast';
import { nextTick } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const { toast } = useToast();

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) {
    toast('카카오 로그인에 실패했습니다. 인가코드가 없습니다.', 'error');
    router.push('/login');
    return;
  }

  try {
    //백엔드에 code 보내고 JSON응답(token + user + isNewUser) 받기
    const res = await axios.get(
      `http://localhost:8080/auth/kakao/callback?code=${code}`
    );
    console.log('[DEBUG] 응답 전체:', res);
    console.log('[DEBUG] 응답 data:', res.data);
    const { token, user, newUser } = res.data;

    // 토큰, 유저 정보 저장
    authStore.setToken(token);
    authStore.setIsFirst(newUser);

    console.log('[DEBUG] 받은 token:', token);
    console.log(
      '[DEBUG] authStore.isLoggedIn (set 이후):',
      authStore.isLoggedIn
    );

    await nextTick();

    toast('카카오 로그인 성공!', 'success');

    if (newUser) {
      router.push('/signup-survey'); // 신규 유저면 회원가입 설문 페이지로 이동
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error(error);
    toast('카카오 로그인 처리 중 오류가 발생했습니다.', 'error');
    router.push('/login');
  }
});
</script>
