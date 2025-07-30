<template>
  <div>
    <form class="user-info-form" @submit.prevent="onSubmit">
      <div class="form-group">
        <label class="readonly-label">아이디</label>
        <input
          type="text"
          v-model="accountId"
          disabled
          class="readonly-input"
        />
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
          <button type="button" class="verify-btn" @click="onClickEmailVerify">
            인증
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>생년월일</label>
        <input
          type="text"
          placeholder="yyyymmdd"
          v-model="birthdate"
          maxlength="8"
          inputmode="numeric"
          @input="onBirthdateInput"
          @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd"
        />
        <p v-if="!isBirthdateValid" class="error-msg">
          생년월일은 yyyymmdd 형식으로 8자리 입력해주세요.
        </p>
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
    <EmailCodeModal
      v-if="isModalOpen"
      :request-id="emailVerificationUUID"
      @success="handleEmailVerifySuccess"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "@/composables/useToast";

import EmailCodeModal from "@/components/info/onClickEmailVerify.vue";
import {
  getMyInfo,
  updateUserInfo,
  sendEmailVerification,
} from "@/api/info/userInfoAPI";

const { toast } = useToast();

const accountId = ref("");
const password = ref("");
const passwordCheck = ref("");
const email = ref("");
const birthdate = ref("");
const emailVerificationUUID = ref("");
const isModalOpen = ref(false);
const isComposing = ref(false);
const isEmailVerified = ref(false);

const onSubmit = async () => {
  const payload = {};

  if (
    password.value &&
    passwordCheck.value &&
    password.value === passwordCheck.value
  ) {
    payload.password = password.value;
  }

  if (email.value) {
    payload.email = email.value;

    if (emailVerificationUUID.value) {
      payload.emailVerificationUUID = emailVerificationUUID.value;
    }
  }

  if (birthdate.value) {
    payload.birthdate = birthdate.value;
  }

  try {
    const res = await updateUserInfo(payload);
    if (res.status === 200 || res.status === 204) {
      toast("회원 정보가 성공적으로 수정되었습니다.", "success");

      password.value = "";
      passwordCheck.value = "";
      email.value = "";
      birthdate.value = "";
      emailVerificationUUID.value = "";
    } else {
      toast("회원 정보 수정에 실패했습니다.", "error");
    }
  } catch (e) {
    toast("회원 정보 수정 중 오류가 발생했습니다.", "error");
    console.error(e);
  }
};

onMounted(async () => {
  try {
    const user = await getMyInfo();
    accountId.value = user.accountId;
    email.value = user.email;
    birthdate.value = user.birthdate;
  } catch (e) {
    toast("회원 정보를 불러오는 데 실패했습니다.", "error");
  }
});

const onClickEmailVerify = async () => {
  if (!email.value) {
    toast("이메일을 입력해주세요.", "error");
    return;
  }

  try {
    const res = await sendEmailVerification(email.value);
    emailVerificationUUID.value = res.uuid;
    toast("이메일 인증 링크가 전송되었습니다!", "success");
    isModalOpen.value = true;
  } catch (e) {
    toast("이메일 인증 요청에 실패했습니다.", "error");
    console.error(e);
  }
};

const handleEmailVerifySuccess = () => {
  isEmailVerified.value = true;
  toast("이메일 인증이 완료되었습니다. 계속 진행해주세요!", "success");
};

const onCompositionStart = () => {
  isComposing.value = true;
};

const onCompositionEnd = (e) => {
  isComposing.value = false;
  const raw = e.target.value;
  const filtered = raw.replace(/[^0-9]/g, "");
  birthdate.value = filtered;
  e.target.value = filtered;
};

const onBirthdateInput = (e) => {
  if (isComposing.value) return;
  const raw = e.target.value;
  const filtered = raw.replace(/[^0-9]/g, "");
  birthdate.value = filtered;
  e.target.value = filtered;
};

const isPasswordMatch = computed(() => {
  return passwordCheck.value === "" || password.value === passwordCheck.value;
});

const isBirthdateValid = computed(() => {
  return birthdate.value === "" || /^\d{8}$/.test(birthdate.value);
});

const isDirty = computed(() => {
  return (
    (password.value !== "" &&
      passwordCheck.value !== "" &&
      isPasswordMatch.value) ||
    email.value !== "" ||
    birthdate.value !== ""
  );
});
</script>

<style scoped>
.user-info-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-family: var(--font-wanted);
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
  font-family: var(--font-wanted);
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
  font-family: var(--font-wanted);
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
  font-family: var(--font-wanted);
  font-weight: bold;
}
</style>
