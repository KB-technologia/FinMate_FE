<template>
  <div class="signup-form">
    <h2>회원가입</h2>
    <input v-model="email" placeholder="이메일" @blur="checkEmail" />
    <div v-if="emailError" class="error">{{ emailError }}</div>

    <input v-model="accountId" placeholder="아이디" />
    <input v-model="name" placeholder="이름" />

    <input v-model="password" placeholder="비밀번호" type="password" />
    <input
      v-model="confirmPassword"
      placeholder="비밀번호 확인"
      type="password"
    />
    <div v-if="password && password !== confirmPassword" class="error">
      비밀번호가 일치하지 않습니다
    </div>

    <div class="birth">
      <select v-model="birthYear">
        <option disabled value="">년</option>
        <option v-for="year in 100" :key="year">{{ 2025 - year }}</option>
      </select>
      <select v-model="birthMonth">
        <option disabled value="">월</option>
        <option v-for="m in 12" :key="m">{{ m }}</option>
      </select>
      <select v-model="birthDay">
        <option disabled value="">일</option>
        <option v-for="d in 31" :key="d">{{ d }}</option>
      </select>
    </div>

    <button @click="submitSignup">회원가입</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const accountId = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const emailError = ref('');

const checkEmail = async () => {
  try {
    const res = await axios.get(`/api/member/check-email?email=${email.value}`);
    if (!res.data.available) emailError.value = '이미 사용 중인 이메일입니다';
    else emailError.value = '';
  } catch (e) {
    emailError.value = '이메일 중복 확인 중 오류';
  }
};

const submitSignup = async () => {
  if (password.value !== confirmPassword.value) return;

  const requestBody = {
    email: email.value,
    accountId: accountId.value,
    name: name.value,
    password: password.value,
    birth: `${birthYear.value}-${birthMonth.value}-${birthDay.value}`,
  };

  try {
    await axios.post('/api/member/join', requestBody);
    alert('회원가입 완료!');
  } catch (e) {
    alert('회원가입 실패');
  }
};
</script>

<style scoped>
.signup-form {
  /* 스타일 설정 */
}
.error {
  color: red;
  font-size: 12px;
}
.birth {
  display: flex;
  gap: 8px;
}
</style>
