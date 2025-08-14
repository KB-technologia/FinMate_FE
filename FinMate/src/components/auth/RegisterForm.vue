<template>
  <div class="signup-wrapper">
    <h2>회원가입</h2>
    <form
      v-if="!isEmailVerified"
      class="form-section"
      @submit.prevent="handleEmailAuthSubmit"
    >
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
            :type="isCodeSent ? 'button' : 'submit'"
            class="action-btn"
            :disabled="!email || isCodeSent"
          >
            {{ isCodeSent ? "전송완료" : "인증" }}
          </button>
        </div>
        <div v-if="emailError" class="error">{{ emailError }}</div>
      </div>

      <div v-if="isCodeSent" class="field">
        <label>인증코드</label>
        <div class="input-group">
          <input v-model="authCode" placeholder="인증코드 입력" maxlength="6" />
          <button type="submit" class="action-btn">확인</button>
        </div>
      </div>
    </form>
    <form v-else class="form-section" @submit.prevent="handleSubmit">
      <div class="field">
        <label>이름</label>
        <input v-model="name" placeholder="이름 입력" />
      </div>

      <div class="field">
        <label>아이디</label>
        <div class="input-group">
          <input
            v-model="accountId"
            placeholder="아이디 입력"
            :disabled="isIdConfirmed"
          />
          <button type="button" class="action-btn" @click="checkIdDuplication">
            중복 확인
          </button>
        </div>
        <p v-if="idAvailable === true" class="success">
          사용 가능한 아이디입니다.
        </p>
        <p v-else-if="idAvailable === false" class="error">
          이미 사용 중인 아이디입니다.
        </p>
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
        <p v-if="confirmPassword && password !== confirmPassword" class="error">
          비밀번호가 일치하지 않습니다.
        </p>
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
      <button type="submit" class="submit-btn">완료</button>
    </form>

    <LoadingOverlay
      v-if="ui.isLoading"
      :message="'인증 메일을 전송 중이에요...'"
    />
  </div>
</template>

<script setup>
import LoadingOverlay from "@/components/allshared/LoadingOverlay.vue";
import { ref, computed, reactive } from "vue";
import { useSignupStore } from "@/stores/signup/signupStore";
import {
  verifyEmailAuth,
  checkAccountId,
  sendEmailAuthForSingUp,
} from "@/api/auth/auth";
import { useToast } from "@/composables/useToast";
import { useRouter } from "vue-router";

const router = useRouter();
const { toast } = useToast();
const store = useSignupStore();

const email = ref("");
const authCode = ref("");
const uuid = ref("");
const name = ref("");
const accountId = ref("");
const password = ref("");
const confirmPassword = ref("");
const birthYear = ref("");
const birthMonth = ref("");
const birthDay = ref("");
const gender = ref("");

const isCodeSent = ref(false);
const isEmailVerified = ref(false);
const verifySuccess = ref(false);
const emailError = ref("");
const idAvailable = ref(null);
const isIdConfirmed = ref(false);

const ui = reactive({
  isLoading: false,
});

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

const handleEmailAuthSubmit = async () => {
  if (ui.isLoading) return;

  if (!isCodeSent.value) {
    if (!email.value) {
      return;
    }
    emailError.value = "";
    await SendAuthCodeClick();
    return;
  }
  if (!authCode.value) {
    return;
  }
  await verifyAuthCode();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SendAuthCodeClick = async () => {
  emailError.value = "";

  if (!isValidEmail(email.value)) {
    emailError.value = "올바른 이메일 형식을 입력해주세요";
    return;
  }

  try {
    ui.isLoading = true;
    const response = await sendEmailAuthForSingUp(email.value);
    uuid.value = response.data;
    isCodeSent.value = true;
    toast("인증코드가 이메일로 전송되었습니다.", "success");
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 409 || error.response.status === 400)
    ) {
      toast("이미 가입된 이메일입니다.", "error");
    } else {
      emailError.value = "인증코드 전송에 실패했습니다. 다시 시도해주세요.";
    }
    isCodeSent.value = false;
  } finally {
    ui.isLoading = false;
  }
};

const verifyAuthCode = async () => {
  if (!authCode.value) {
    toast("인증코드를 입력해주세요.", "error");
    verifySuccess.value = false;
    return;
  }

  try {
    const response = await verifyEmailAuth(authCode.value, uuid.value.uuid);

    if (response.data === true) {
      toast("이메일 인증이 완료되었습니다.", "success");
      verifySuccess.value = true;
      isEmailVerified.value = true;
    } else {
      toast("인증코드가 올바르지 않습니다.", "error");
      verifySuccess.value = false;
    }
  } catch (error) {
    toast("인증 중 오류가 발생했습니다.", "error");
    verifySuccess.value = false;
  }
};
const checkIdDuplication = async () => {
  if (!accountId.value) {
    toast("아이디를 입력해주세요.", "warning");
    return;
  }

  try {
    const res = await checkAccountId(accountId.value);

    if (res.data === false) {
      idAvailable.value = true;
      isIdConfirmed.value = true;
      toast("사용 가능한 아이디입니다.", "success");
    } else {
      idAvailable.value = false;
      toast("이미 사용 중인 아이디입니다.", "error");
    }
  } catch (err) {
    idAvailable.value = false;
    toast("중복 확인 중 오류가 발생했습니다.", "error");
  }
};

const handleSubmit = () => {
  if (idAvailable.value !== true) {
    toast("아이디 중복 확인을 해주세요.", "error");
    return;
  }

  if (password.value !== confirmPassword.value) {
    toast("비밀번호가 일치하지 않습니다.", "error");
    return;
  }

  if (!birthYear.value || !birthMonth.value || !birthDay.value) {
    toast("생년, 월, 일을 모두 선택해주세요.", "warning");
    return;
  }

  if (gender.value !== "MALE" && gender.value !== "FEMALE") {
    toast("성별을 선택해주세요.", "warning");
    return;
  }

  store.provider = "LOCAL";
  store.email = email.value;
  store.name = name.value;
  store.accountId = accountId.value;
  store.password = password.value;
  store.passwordConfirm = confirmPassword.value;
  store.gender = gender.value;
  store.birth = `${birthYear.value}-${String(birthMonth.value).padStart(
    2,
    "0"
  )}-${String(birthDay.value).padStart(2, "0")}`;

  router.push("/signup-survey");
};
</script>

<style scoped>
.signup-wrapper {
  max-width: 40vw;
  width: 100%;
  margin: 5vh auto;
  padding: 3rem;
  background: var(--color-white);
  border-radius: var(--card-radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  padding: 0 16px;
  background: var(--color-primary-yellow);
  color: var(--color-black);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  border: 2px solid;
  background: var(--color-white);
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 500;
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
  color: var(--color-white);
}

.gender-btn.female.active {
  background: #f06595;
  border-color: #f06595;
  color: var(--color-white);
}

.gender-btn.male:hover {
  background: #7bcdf9;
  border-color: #3f94e3;
}

.gender-btn.female:hover {
  background: #eba7c5;
  border-color: #ec2097;
}

.gender-btn:focus {
  outline: none;
  box-shadow: none;
  border-color: inherit;
}

.submit-btn {
  width: 100%;
  height: 4vh;
  background: var(--color-dark-gray);
  color: var(--color-white);
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background: #555;
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
