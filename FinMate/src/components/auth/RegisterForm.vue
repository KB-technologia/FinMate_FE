<template>
  <div class="signup-form">
    <h2>회원가입</h2>
    <div v-if="!isVerified">
      <!-- 이메일 + 인증버튼 -->
      <div class="field">
        <label>이메일</label>
        <div class="email-box">
          <input v-model="email" placeholder="이메일" />
          <button class="verify-btn" @click="sendAuthCode">인증</button>
        </div>
        <div v-if="emailError" class="error">{{ emailError }}</div>
      </div>

      <!-- 인증코드 입력 필드 (조건부 렌더링) -->
      <div class="field">
        <label>인증코드</label>
        <div class="email-box">
          <input v-model="authCode" placeholder="인증코드 입력" />
          <button class="verify-btn" @click="handleVerifyAuth">확인</button>
        </div>
        <div v-if="verifyMsg" :class="verifySuccess ? 'success' : 'error'">
          {{ verifyMsg }}
        </div>
      </div>
    </div>

    <div v-else>
      <label>이름</label>
      <input v-model="name" placeholder="이름 입력" />
      <div class="field" v-if="verifySuccess">
        <label>아이디</label>
        <input v-model="accountId" placeholder="아이디" />
      </div>

      <div class="field" v-if="verifySuccess">
        <label>비밀번호</label>
        <input v-model="password" type="password" placeholder="비밀번호" />
      </div>

      <div class="field" v-if="verifySuccess">
        <label>비밀번호 확인</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
        />
      </div>

      <div class="field birth" v-if="verifySuccess">
        <label>생년월일</label>
        <div class="birth-selects">
          <select v-model="birthYear">
            <option disabled value="">년</option>
            <option v-for="y in 100" :key="y">{{ 2025 - y }}</option>
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
        <div class="gender-wrapper">
          <label>성별</label>
          <div class="gender-select">
            <button
              :class="[
                'gender-button',
                gender === 'MALE' ? 'selected male' : '',
              ]"
              @click="gender = 'MALE'"
            >
              ♂ 남자
            </button>
            <button
              :class="[
                'gender-button',
                gender === 'FEMALE' ? 'selected female' : '',
              ]"
              @click="gender = 'FEMALE'"
            >
              ♀ 여자
            </button>
          </div>
        </div>
      </div>

      <button class="submit-btn" @click="handleNextStep">완료</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSignupStore } from '@/stores/signup/signupStore';
const store = useSignupStore();
import { sendEmailAuth, verifyEmailAuth } from '@/api/auth/auth';

const email = ref('');
const accountId = ref('');
const name = ref('');
const gender = ref('');
const password = ref('');
const confirmPassword = ref('');
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const emailError = ref('');
const authCode = ref('');
const uuid = ref('');
const showAuthInput = ref(false);

const verifyMsg = ref(''); // 인증 결과 메시지
const verifySuccess = ref(false); // 인증 성공 여부 스타일용
const isVerified = ref(false); // 실제 인증 통과 여부

// ✅ 이메일 인증코드 요청
const sendAuthCode = async () => {
  emailError.value = '';
  if (!email.value.includes('@')) {
    emailError.value = '올바른 이메일을 입력하세요';
    return;
  }

  try {
    const res = await sendEmailAuth(email.value);
    uuid.value = res.data; // 백엔드에서 받은 UUID 저장
    console.log('📌 sendAuthCode에서 받은 uuid:', uuid.value);
    console.log(res.data);
    showAuthInput.value = true;
    alert('인증 코드가 이메일로 전송되었습니다.');
  } catch (error) {
    emailError.value = '인증 코드 전송 실패';
    console.error(error);
  }
};

// ✅ 추가: 인증코드 확인 버튼 로직
const handleVerifyAuth = async () => {
  console.log('✅ 인증 시 사용하는 uuid:', uuid.value.uuid);
  try {
    const res = await verifyEmailAuth(authCode.value, uuid.value.uuid); // 순서 수정!!
    if (res.data === true) {
      verifyMsg.value = '✅ 이메일 인증 완료';
      verifySuccess.value = true;
      isVerified.value = true;
    } else {
      verifyMsg.value = '❌ 인증 실패. 코드를 다시 확인해주세요.';
      verifySuccess.value = false;
      isVerified.value = false;
    }
  } catch (error) {
    verifyMsg.value = '❌ 인증 중 오류 발생';
    verifySuccess.value = false;
    isVerified.value = false;
    console.error(error);
  }
};

const handleNextStep = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 통과 시 store에 값 저장 후 페이지 이동
  store.email = email.value;
  store.gender = gender.value;
  store.accountId = accountId.value;
  store.name = name.value;
  store.password = password.value;
  store.passwordConfirm = confirmPassword.value;
  store.birth = `${birthYear.value}-${String(birthMonth.value).padStart(
    2,
    '0'
  )}-${String(birthDay.value).padStart(2, '0')}`;

  console.log('📦 저장된 스토어:', {
    email: store.email,
    gender: store.gender,
    accountId: store.accountId,
    name: store.name,
    password: store.password,
    passwordConfirm: store.passwordConfirm,
    birth: store.birth,
  });

  // router.push('/signup2');
};
</script>

<style scoped>
.signup-form {
  width: 500px;
  margin: 3rem auto;
  padding: 2rem 2rem;
  background: #fff;
  border-radius: 8px;
  text-align: left;
}

.signup-form h2 {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 2rem;
}

.field {
  margin-bottom: 1.4rem;
}

.field label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
}

input,
select {
  width: 100%;
  height: 40px;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  box-sizing: border-box;
}

.email-box {
  display: flex;
}

.email-box input {
  flex: 1;
}

.verify-btn {
  width: 80px;
  margin-left: 10px;
  background-color: #ffe0a3;
  border: 2px solid #000;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.birth {
  display: flex;
  flex-direction: column;
}

.birth-selects {
  display: flex;
  gap: 10px;
}

.submit-btn {
  margin-top: 2rem;
  width: 100%;
  height: 45px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
.gender-select {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.gender-button {
  border: 2px solid #ccc;
  padding: 10px 20px;
  border-radius: 20px;
  background-color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.gender-button:hover {
  border-color: #999;
}

/* 선택된 상태 공통 */
.gender-button.selected {
  color: white;
}

/* 남자 선택 시 */
.gender-button.male.selected {
  background-color: #56ccf2;
  border-color: #56ccf2;
}

/* 여자 선택 시 */
.gender-button.female.selected {
  background-color: #f06595;
  border-color: #f06595;
}
</style>
