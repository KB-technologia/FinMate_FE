<template>
  <div>카카오 로그인 처리 중입니다...</div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth/auth";
import { useToast } from "@/composables/useToast";
import { useSignupStore } from "@/stores/signup/signupStore";

const router = useRouter();
const authStore = useAuthStore();
const { toast } = useToast();

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    toast("로그인 인증에 실패했어요. 다시 시도해주세요.", "error");
    router.push("/login");
    return;
  }

  try {
    //백엔드에 code 보내고 JSON응답(token + user + isNewUser) 받기
    const res = await axios.get(`${BASE_URL}/auth/kakao/callback?code=${code}`);
    const { token, user, newUser, rewardClaimed, consecutiveDays } = res.data;

    // 토큰, 유저 정보 저장
    // authStore.setToken(token);
    // authStore.setIsFirst(newUser);
    authStore.setProvider("KAKAO");
    authStore.userInfo = user;

    if (newUser) {
      const signupStore = useSignupStore();

      signupStore.$patch({
        provider: "KAKAO",
        accountId: user.accountId,
        name: user.name,
        email: user.email,
        birth: user.birth,
        gender: user.gender,
      });
      sessionStorage.setItem("provider", "KAKAO");
    }
    await nextTick();

    toast("카카오 로그인 성공!", "success"); // TODO: 신규 유저랑 기존 유저 토스트 메세지 분리

    if (newUser) {
      router.push("/signup-survey"); // 신규 유저면 회원가입 설문 페이지로 이동
    } else {
      authStore.setToken(token);
      authStore.setIsFirst(!rewardClaimed);
      authStore.setUserName(user.name);
      authStore.setDays(consecutiveDays);
      router.push("/");
    }
  } catch (error) {
    toast("카카오 로그인 처리 중 오류가 발생했습니다.", "error");
    router.push("/login");
  }
});
</script>
