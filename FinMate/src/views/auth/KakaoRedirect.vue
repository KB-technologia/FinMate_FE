<template>
  <div>카카오 로그인 처리 중입니다...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const { toast } = useToast();

onMounted(() => {
  const token = new URLSearchParams(window.location.search).get('token');
  if (!token) {
    toast('카카오 로그인에 실패했습니다. 토큰이 없습니다.', 'error');
    return;
  }

  // 토큰 저장 (Pinia store 등)
  authStore.setToken(token);

  toast('카카오 로그인 성공!', 'success');
  router.push('/'); // 로그인 성공 후 메인으로 이동
});
</script>
