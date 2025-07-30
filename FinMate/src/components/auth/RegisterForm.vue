<template>
  <div class="signup-wrapper">
    <h2>회원가입</h2>

    <div v-if="!isEmailVerified" class="form-section">
      <div class="field">
        <label>이메일</label>
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            placeholder="이메일 입력"
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
        <div v-if="verifyMsg" :class="verifySuccess ? 'success' : 'error'">
          {{ verifyMsg }}
        </div>
      </div>
    </div>

    <div v-else class="form-section">
      <div class="field">
        <label>이름</label>
        <input v-model="name" placeholder="이름 입력" />
      </div>

      <div class="field">
        <label>아이디</label>
        <input v-model="accountId" placeholder="아이디 입력" />
      </div>

      <div class="field">
        <label>비밀번호</label>
        <input v-model="password" type="password" placeholder="비밀번호 입력" />
      </div>

      <div class="field">
        <label>비밀번호 확인</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
        />
      </div>

      <div class="field">
        <label>생년월일</label>
        <div class="birth-group">
          <select v-model="birthYear">
            <option value="">년</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <select v-model="birthMonth">
            <option value="">월</option>
            <option v-for="month in 12" :key="month" :value="month">
              {{ month }}월
            </option>
          </select>
          <select v-model="birthDay">
            <option value="">일</option>
            <option v-for="day in days" :key="day" :value="day">
              {{ day }}일
            </option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>성별</label>
        <div class="gender-group">
          <button
            type="button"
            :class="['gender-btn', 'male', { active: gender === 'MALE' }]"
            @click="gender = 'MALE'"
          >
            ♂ 남자
          </button>
          <button
            type="button"
            :class="['gender-btn', 'female', { active: gender === 'FEMALE' }]"
            @click="gender = 'FEMALE'"
          >
            ♀ 여자
          </button>
        </div>
      </div>

      <button class="submit-btn" @click="handleSubmit">완료</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSignupStore } from '@/stores/signup/signupStore';
import { sendEmailAuth, verifyEmailAuth } from '@/api/auth/auth';

const email = ref('');
const authCode = ref('');
const uuid = ref('');
const name = ref('');
const accountId = ref('');
const password = ref('');
const confirmPassword = ref('');
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const gender = ref('');

const isCodeSent = ref(false);
const isEmailVerified = ref(false);
const verifySuccess = ref(false);
const emailError = ref('');
const verifyMsg = ref('');

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const yearList = [];
  for (let i = currentYear; i >= currentYear - 100; i--) {
    yearList.push(i);
  }
  return yearList;
});

const days = computed(() => {
  if (!birthYear.value || !birthMonth.value)
    return Array.from({ length: 31 }, (_, i) => i + 1);

  const daysInMonth = new Date(birthYear.value, birthMonth.value, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
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
    const response = await sendEmailAuth(email.value);
    uuid.value = response.data;
    isCodeSent.value = true;
    alert('인증코드가 이메일로 전송되었습니다.');
  } catch (error) {
    emailError.value = '인증코드 전송에 실패했습니다';
    console.error('Auth code send error:', error);
  }
};

const verifyAuthCode = async () => {
  if (!authCode.value) {
    verifyMsg.value = '인증코드를 입력해주세요';
    verifySuccess.value = false;
    return;
  }

  try {
    const response = await verifyEmailAuth(authCode.value, uuid.value.uuid);

    if (response.data === true) {
      verifyMsg.value = '✅ 이메일 인증이 완료되었습니다';
      verifySuccess.value = true;
      isEmailVerified.value = true;
    } else {
      verifyMsg.value = '❌ 인증코드가 올바르지 않습니다';
      verifySuccess.value = false;
    }
  } catch (error) {
    verifyMsg.value = '❌ 인증 중 오류가 발생했습니다';
    verifySuccess.value = false;
  }
};

const handleSubmit = () => {
  store.email = email.value;
  store.name = name.value;
  store.accountId = accountId.value;
  store.password = password.value;
  store.passwordConfirm = confirmPassword.value;
  store.gender = gender.value;
  store.birth =
    birthYear.value && birthMonth.value && birthDay.value
      ? `${birthYear.value}-${String(birthMonth.value).padStart(
          2,
          '0'
        )}-${String(birthDay.value).padStart(2, '0')}`
      : '';
  // 다음 페이지(설문)로 이동
  // router.push('/signup2');
};
</script>

<style scoped>
.signup-wrapper {
  max-width: 900px;
  width: 100%;
  margin: 5vh auto;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.signup-wrapper h2 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
}

.form-section {
  width: 100%;
}

.field {
  margin-bottom: 2rem;
}

.field label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

input,
select {
  width: 100%;
  height: 6vh;
  padding: 0 1.2rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1.1rem;
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
  background: #ffeab4;
  color: black;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
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

.birth-group {
  display: flex;
  gap: 8px;
}

.birth-group select {
  flex: 1;
}

.gender-group {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
}
.gender-btn {
  flex: none;
  width: 10rem;
  height: 5vh;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.gender-btn.male {
  border-color: #3f94e3;
}

.gender-btn.female {
  border-color: #ec2097;
}

.gender-btn.male.active {
  background: #56ccf2;
  border-color: #56ccf2;
  color: white;
}

.gender-btn.female.active {
  background: #f06595;
  border-color: #f06595;
  color: white;
}

.gender-btn.male:hover {
  background: #7bcdf9;
  border-color: #3f94e3;
}

.gender-btn.female:hover {
  background: #eba7c5;
  border-color: #ec2097;
}

.submit-btn {
  width: 100%;
  height: 4vh;
  background: #636362;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background: #555;
}

.error {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.success {
  color: #27ae60;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
</style>
