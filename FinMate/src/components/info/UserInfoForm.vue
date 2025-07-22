<script setup>
import { ref, computed } from "vue";

const password = ref("");
const passwordCheck = ref("");
const email = ref("");
const birthdate = ref("");

const isDirty = computed(() => {
  return (
    (password.value !== "" &&
      passwordCheck.value !== "" &&
      isPasswordMatch.value) ||
    email.value !== "" ||
    birthdate.value !== ""
  );
});

const isPasswordMatch = computed(() => {
  return passwordCheck.value === "" || password.value === passwordCheck.value;
});
</script>

<template>
  <form class="user-info-form">
    <div class="form-group">
      <label class="readonly-label">아이디</label>
      <input type="text" value="abc1234" disabled class="readonly-input" />
    </div>

    <div class="form-group">
      <label>비밀번호</label>
      <input
        type="password"
        placeholder="새 비밀번호를 입력해주세요"
        v-model="password"
      />
    </div>

    <div class="form-group">
      <label>비밀번호 확인*</label>
      <input
        type="password"
        placeholder="비밀번호를 한 번 더 입력해주세요"
        v-model="passwordCheck"
      />
      <p v-if="passwordCheck && !isPasswordMatch" class="error-msg">
        비밀번호가 일치하지 않습니다.
      </p>
    </div>

    <div class="form-group">
      <label>이메일</label>
      <div class="email-group">
        <input type="email" v-model="email" />
        <button type="button" class="verify-btn">인증</button>
      </div>
    </div>

    <div class="form-group">
      <label>생년월일</label>
      <input type="text" placeholder="yyyymmdd" v-model="birthdate" />
    </div>

    <div class="btn-group">
      <button
        type="submit"
        class="submit"
        :class="{ inactive: !isDirty }"
        :disabled="!isDirty"
      >
        변경사항 저장
      </button>
    </div>
  </form>
</template>

<style scoped>
.user-info-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: var(--font-tmon);
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 70%;
}

.form-group label {
  margin-bottom: 0.5rem;
}

.readonly-label {
  color: var(--color-light-gray);
}

input,
.email-group input {
  height: 3.3rem;
  padding: 0 1rem 0 1.2rem;
  border: 2px solid var(--color-black);
  border-radius: 20px;
  font-family: var(--font-tmon);
  font-size: 0.8rem;
  color: var(--color-black);
  width: 100%;
}

input::placeholder,
.email-group input::placeholder {
  color: var(--color-light-gray);
}

input:focus,
.email-group input:focus {
  outline: none;
  border-color: var(--color-orange);
}

.readonly-input {
  font-size: 1.1rem;
  color: var(--color-light-gray);
}

.email-group {
  position: relative;
  width: 100%;
  margin-top: 0;
}

.email-group input {
  padding-right: 6rem;
}

.verify-btn {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  padding: 0 1.2rem;
  background-color: var(--color-primary-yellow);
  border: 2px solid black;
  border-left: 2px solid black;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  font-family: "Inter", sans-serif;
  font-weight: bold;
  cursor: pointer;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
}

.submit {
  background-color: var(--color-primary-green);
  border: none;
  padding: 0.8rem 2.5rem;
  border-radius: 10px;
  cursor: pointer;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s ease;
}

.submit:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.25);
}

.submit.inactive {
  background-color: #cfcfcf;
  cursor: not-allowed;
}

.error-msg {
  color: var(--color-red);
  font-size: 0.75rem;
  margin-top: 0.3rem;
  margin-left: 0.2rem;
  font-family: "Inter", sans-serif;
  font-weight: bold;
}
</style>
