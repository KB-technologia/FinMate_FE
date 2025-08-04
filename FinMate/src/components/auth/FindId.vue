<template>
  <div class="signup-wrapper">
    <h2>아이디 찾기</h2>

    <div v-if="!isEmailVerified" class="form-section">
      <div class="field">
        <label>이메일</label>
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="가입 시 사용한 이메일을 입력하세요"
            :disabled="isCodeSent"
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
          <input v-model="authCode" placeholder="인증코드 입력" maxlength="6" />
          <button class="action-btn" @click="verifyAuthCode">확인</button>
        </div>
      </div>
    </div>

    <div v-else class="form-section">
      <div class="result-section">
        <div class="success-alert">
          <!-- <div class="alert-icon">ℹ️</div>
          <div class="alert-text">
            이메일 인증이 완료되어 아이디 찾기 결과를 확인하실 수 있습니다.
          </div> -->
        </div>

        <div class="result-content">
          <div class="result-message">
            <strong>{{ foundName }}</strong
            >님의 아이디는 아래와 같습니다.
          </div>

          <div class="found-id-display">
            {{ foundAccountId }}
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-login" @click="goToLogin">로그인</button>
          <button class="btn-find-password" @click="goToFindPassword">
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  </div>

  <LoadingOverlay
    v-if="ui.isLoading"
    :message="'인증 메일을 전송 중이에요...'"
  />
</template>

<script setup>
import LoadingOverlay from '@/components/allshared/LoadingOverlay.vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  sendEmailAuth,
  verifyEmailAuth,
  findAccountIdByUuid,
} from '@/api/auth/auth';
import { useToast } from '@/composables/useToast';

const { toast } = useToast();
const router = useRouter();

const email = ref('');
const authCode = ref('');
const uuid = ref('');
const foundName = ref('');
const foundAccountId = ref('');
const joinDate = ref('');

const isCodeSent = ref(false);
const isEmailVerified = ref(false);
const emailError = ref('');

const ui = reactive({
  isLoading: false,
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sendAuthCode = async () => {
  emailError.value = '';

  if (!isValidEmail(email.value)) {
    emailError.value = '올바른 이메일 형식을 입력해주세요';
    return;
  }

  try {
    ui.isLoading = true;
    const response = await sendEmailAuth(email.value);
    uuid.value = response.data.uuid;
    isCodeSent.value = true;
    toast('인증코드가 이메일로 전송되었습니다.', 'success');
  } catch (error) {
    emailError.value = '인증코드 전송에 실패했습니다';
    isCodeSent.value = false;
    console.error('Auth code send error:', error);
  } finally {
    ui.isLoading = false;
  }
};

const verifyAuthCode = async () => {
  if (!authCode.value) {
    toast('인증코드를 입력해주세요.', 'error');
    return;
  }

  try {
    ui.isLoading = true;
    const response = await verifyEmailAuth(authCode.value, uuid.value);
    console.log('📦 인증 시 보내는 uuid:', uuid.value);
    console.log('📦 인증코드:', authCode.value);
    if (response.data === true) {
      toast('✅ 이메일 인증이 완료되었습니다.', 'success');
      // 인증 완료 후 아이디 찾기 API 호출
      await findUserAccountId();
    } else {
      toast('❌ 인증코드가 올바르지 않습니다.', 'error');
    }
  } catch (error) {
    toast('❌ 인증 중 오류가 발생했습니다.', 'error');
  } finally {
    ui.isLoading = false;
  }
};

const findUserAccountId = async () => {
  try {
    ui.isLoading = true;
    const response = await findAccountIdByUuid(uuid.value);
    foundName.value = response.name;
    foundAccountId.value = response.accountId;
    joinDate.value = response.joinDate || '정보 없음';
    isEmailVerified.value = true;

    toast('✅ 아이디를 찾았습니다!', 'success');
  } catch (error) {
    toast('❌ 해당 이메일로 가입된 계정을 찾을 수 없습니다.', 'error');
    console.error('Find account ID error:', error);
  } finally {
    ui.isLoading = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};

const goToFindPassword = () => {
  router.push('/find-password');
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
  border-radius: 12px;
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
  width: 4.5vw;
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

.action-btn:hover {
  background-color: #fff0cb;
}

.result-section {
  text-align: center;
}

/* .success-alert {
  background: #2196f3;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
} */

.alert-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.alert-text {
  font-size: 1.2rem;
  text-align: left;
  flex: 1;
}

.result-content {
  background: #f8f9fa;
  padding: 2rem;
  height: 15vh;
  border-radius: 8px;
  margin-bottom: 2rem;
  align-content: center;
}

.result-message {
  color: var(--color-dark-gray);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.found-id-display {
  color: #2196f3;
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.action-buttons {
  display: flex;
  gap: 0;
}

.btn-login,
.btn-find-password {
  flex: 1;
  height: 3.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-login {
  background: var(--color-dark-gray);
  color: var(--color-white);
  border-radius: 8px 0 0 8px;
}

.btn-login:hover {
  background: #555;
}

.btn-find-password {
  background: #2196f3;
  color: var(--color-white);
  border-radius: 0 8px 8px 0;
}

.btn-find-password:hover {
  background: #1976d2;
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
