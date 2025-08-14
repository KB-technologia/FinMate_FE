<template>
  <div class="signup-wrapper">
    <h2>비밀번호 변경</h2>

    <div v-if="!isEmailVerified" class="form-section">
      <div class="field">
        <label>이메일</label>
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="가입 시 이메일 입력"
            :disabled="isCodeSent"
            @keyup.enter="sendAuthCode"
          />
          <button
            class="action-btn"
            @click="sendAuthCode"
            :disabled="!email || isCodeSent"
          >
            {{ isCodeSent ? '전송완료' : '인증' }}
          </button>
        </div>
        <div v-if="emailError" class="error">{{ emailError }}</div>
      </div>

      <div v-if="isCodeSent" class="field">
        <label>인증코드</label>
        <div class="input-group">
          <input
            v-model="authCode"
            placeholder="인증코드 입력"
            maxlength="6"
            @keyup.enter="verifyAuthCode"
          />
          <button class="action-btn" @click="verifyAuthCode">확인</button>
        </div>
      </div>
    </div>

    <div v-else class="form-section">
      <div class="field">
        <label>새 비밀번호</label>
        <input
          v-model="newPassword"
          type="password"
          placeholder="새 비밀번호 입력"
        />
      </div>

      <div class="field">
        <label>새 비밀번호 확인</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="비밀번호 재입력"
          @keyup.enter="handleResetPassword"
        />
        <div v-if="passwordMismatch" class="error">
          비밀번호가 일치하지 않습니다
        </div>
      </div>

      <button class="btn-login" @click="handleResetPassword">확인</button>
    </div>
  </div>

  <LoadingOverlay v-if="ui.isLoading" :message="'처리 중입니다...'" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  sendEmailAuth,
  verifyEmailAuth,
  findAccountIdByUuid,
  resetPasswordByUuid,
} from '@/api/auth/auth';
import { useToast } from '@/composables/useToast';
import LoadingOverlay from '@/components/allshared/LoadingOverlay.vue';

const router = useRouter();
const { toast } = useToast();

const email = ref('');
const authCode = ref('');
const uuid = ref('');
const accountId = ref('');

const newPassword = ref('');
const confirmPassword = ref('');

const isCodeSent = ref(false);
const isEmailVerified = ref(false);
const emailError = ref('');
const ui = reactive({ isLoading: false });

const passwordMismatch = computed(
  () =>
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value !== confirmPassword.value
);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const sendAuthCode = async () => {
  emailError.value = '';
  if (!isValidEmail(email.value)) {
    emailError.value = '올바른 이메일 형식을 입력해주세요';
    return;
  }

  ui.isLoading = true;
  try {
    const response = await sendEmailAuth(email.value);
    uuid.value = response.data.uuid;
    isCodeSent.value = true;
    toast('인증코드를 전송했습니다.', 'success');
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 500 || error.response.status === 400)
    ) {
      toast('해당 이메일로 가입된 계정이 없습니다.', 'error');
    } else {
      emailError.value = '인증코드 전송에 실패했습니다. 다시 시도해주세요.';
    }
    isCodeSent.value = false;
  } finally {
    ui.isLoading = false;
  }
};

const verifyAuthCode = async () => {
  if (!authCode.value) {
    toast('인증코드를 입력해주세요.', 'error');
    return;
  }

  ui.isLoading = true;
  try {
    const verifyRes = await verifyEmailAuth(authCode.value, uuid.value);

    if (verifyRes.data === true) {
      const accountInfo = await findAccountIdByUuid(uuid.value);
      accountId.value = accountInfo.accountId;

      isEmailVerified.value = true;
      toast('인증 완료! 새 비밀번호를 입력하세요.', 'success');
    } else {
      toast('인증코드가 올바르지 않습니다.', 'error');
    }
  } catch (err) {
    toast('인증 중 오류가 발생했습니다.', 'error');
  } finally {
    ui.isLoading = false;
  }
};

const handleResetPassword = async () => {
  if (passwordMismatch.value || !newPassword.value) {
    toast('비밀번호를 확인해주세요.', 'error');
    return;
  }

  ui.isLoading = true;
  try {
    await resetPasswordByUuid(uuid.value, accountId.value, newPassword.value);

    toast('비밀번호 변경 완료! 로그인해주세요.', 'success');
    router.push('/login');
  } catch (err) {
    toast('비밀번호 변경에 실패했습니다.', 'error');
  } finally {
    ui.isLoading = false;
  }
};
</script>

<style scoped>
.signup-wrapper {
  max-width: 40vw;
  width: 100%;
  min-width: 37vw;
  margin: 5vh auto;
  padding: 3rem;
  background: var(--color-white);
  border-radius: var(--card-radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.signup-wrapper h2 {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-black);
}

.form-section {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.field {
  margin-bottom: 2rem;
}

.field label {
  display: block;
  font-weight: var(--font-weight-semibold);
  color: var(--color-signup-black);
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
}

input,
select {
  width: 100%;
  height: 6vh;
  padding: 0 1.2rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1.2rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: #4caf50;
}

input:disabled {
  background-color: #f5f5f5;
  color: #999;
}

.input-group {
  display: flex;
  gap: 8px;
}

.input-group input {
  flex: 1;
}

.action-btn {
  height: 6vh;
  width: 5.5vw;
  min-width: 6rem;
  padding: 0 16px;
  background: var(--color-primary-yellow);
  color: var(--color-black);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.2rem;
  white-space: nowrap;
  transition: background-color 0.2s ease;
}

.action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  pointer-events: none;
}

.action-btn:hover:not(:disabled) {
  background-color: #fff0cb;
}

.btn-login {
  width: 100%;
  height: 3.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: var(--color-dark-gray);
  color: var(--color-white);
  margin-top: 1rem;
}

.btn-login:hover {
  background-color: #555;
}

.error {
  color: var(--toast-icon-error);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.success {
  color: var(--toast-icon-success);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
