<template>
  <div>
    <form class="user-info-form" @submit.prevent="onSubmit">
      <div class="form-group">
        <label class="readonly-label">아이디</label>
        <input
          type="text"
          v-model="form.accountId"
          disabled
          class="readonly-input"
        />
      </div>

      <div class="form-group">
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
          v-model="form.password"
        />
      </div>

      <div class="form-group">
        <label>비밀번호 확인*</label>
        <input
          type="password"
          placeholder="비밀번호를 한 번 더 입력해주세요"
          v-model="form.passwordCheck"
        />
        <p v-if="form.passwordCheck && !isPasswordMatch" class="error-msg">
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <div class="form-group">
        <label>이메일</label>
        <div class="email-group">
          <input type="email" v-model="form.email" />
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
          v-model="form.birthdate"
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
        <button type="submit" class="common-button submit" :disabled="!isDirty">
          변경사항 저장
        </button>
      </div>
    </form>
    <LoadingOverlay
      v-if="ui.isLoading"
      :message="'인증 메일을 전송 중이에요...'"
    />
    <EmailCodeModal
      v-if="ui.isModalOpen"
      :request-id="form.emailVerificationUUID"
      @success="handleEmailVerifySuccess"
      @close="ui.isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useToast } from "@/composables/useToast";

import LoadingOverlay from "@/components/allshared/LoadingOverlay.vue";
import EmailCodeModal from "@/components/info/onClickEmailVerify.vue";
import {
  getMyInfo,
  updateUserInfo,
  sendEmailVerification,
} from "@/api/info/userInfoAPI";

const { toast } = useToast();

const form = reactive({
  accountId: "",
  password: "",
  passwordCheck: "",
  email: "",
  birthdate: "",
  emailVerificationUUID: "",
});

const ui = reactive({
  isModalOpen: false,
  isComposing: false,
  isLoading: false,
});

const onSubmit = async () => {
  const payload = {};

  if (
    form.password &&
    form.passwordCheck &&
    form.password === form.passwordCheck
  ) {
    payload.password = form.password;
  }

  if (form.email) {
    if (!form.emailVerificationUUID) {
      toast("이메일 인증을 먼저 완료해주세요.", "error");
      return;
    }
    payload.email = form.email;
    payload.emailVerificationUUID = form.emailVerificationUUID;
  }

  if (form.birthdate) {
    const b = form.birthdate;
    if (/^\d{8}$/.test(b)) {
      payload.birth = `${b.slice(0, 4)}-${b.slice(4, 6)}-${b.slice(6, 8)}`;
    } else {
      toast("생년월일 형식이 올바르지 않습니다.", "error");
      return;
    }
  }

  try {
    const res = await updateUserInfo(payload);
    if (res.status === 200 || res.status === 204) {
      toast("회원 정보가 성공적으로 수정되었습니다.", "success");
      form.password = "";
      form.passwordCheck = "";
      form.emailVerificationUUID = "";

      original.email = form.email;
      original.birthdate = form.birthdate;
    } else {
      toast("회원 정보 수정에 실패했습니다.", "error");
    }
  } catch (e) {
    toast("회원 정보 수정 중 오류가 발생했습니다.", "error");
    console.error(e);
  }
};

const original = reactive({
  email: "",
  birthdate: "",
});

onMounted(async () => {
  try {
    const user = await getMyInfo();
    form.accountId = user.accountId;
    form.email = user.email || "";
    form.birthdate = user.birth ? user.birth.replaceAll("-", "") : "";

    original.email = form.email;
    original.birthdate = form.birthdate;
  } catch (e) {
    toast("회원 정보를 불러오는 데 실패했습니다.", "error");
  }
});

const onClickEmailVerify = async () => {
  if (!form.email) {
    toast("이메일을 입력해주세요.", "error");
    return;
  }

  try {
    ui.isLoading = true;
    const res = await sendEmailVerification(form.email);
    form.emailVerificationUUID = res.uuid;
    ui.isModalOpen = true;
    toast("이메일 인증 링크가 전송되었습니다!", "success");
  } catch (e) {
    toast("이메일 인증 요청에 실패했습니다.", "error");
  } finally {
    ui.isLoading = false;
  }
};

const handleEmailVerifySuccess = () => {
  toast("이메일 인증이 완료되었습니다!", "success");
};

const onCompositionStart = () => {
  ui.isComposing = true;
};

const onCompositionEnd = (e) => {
  ui.isComposing = false;
  const raw = e.target.value;
  const filtered = raw.replace(/[^0-9]/g, "");
  form.birthdate = filtered;
  e.target.value = filtered;
};

const onBirthdateInput = (e) => {
  if (ui.isComposing) return;
  const raw = e.target.value;
  const filtered = raw.replace(/[^0-9]/g, "");
  form.birthdate = filtered;
  e.target.value = filtered;
};

const isPasswordMatch = computed(() => {
  return form.passwordCheck === "" || form.password === form.passwordCheck;
});

const isBirthdateValid = computed(() => {
  return form.birthdate === "" || /^\d{8}$/.test(form.birthdate);
});

const isDirty = computed(() => {
  const pwChanged =
    form.password !== "" && form.passwordCheck !== "" && isPasswordMatch.value;

  const emailChanged = form.email !== original.email;
  const birthChanged = form.birthdate !== original.birthdate;

  return pwChanged || emailChanged || birthChanged;
});
</script>

<style scoped>
.user-info-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  color: var(--color-black-gray);
}

input,
.email-group input {
  height: 3.3rem;
  padding: 0 1rem 0 1.2rem;
  border: 2px solid var(--color-black);
  border-radius: 20px;
  font-size: 0.9rem;
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
  font-weight: var(--font-weight-bold);
}

.submit {
  padding: 0.8rem 3.5rem;
  font-weight: var(--font-weight-bold);
}

.submit:disabled {
  background: var(--color-light-gray) !important;
  box-shadow: none;
  transform: none;
  cursor: not-allowed;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  width: var(--form-width);
  align-self: center;
}

.error-msg {
  color: var(--color-red);
  font-size: 0.75rem;
  margin-top: 0.3rem;
  margin-left: 0.2rem;
  font-weight: var(--font-weight-bold);
}

.user-info-form {
  --form-width: clamp(28rem, 70vw, 44rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}
</style>
