<template>
  <div class="container">
    <div class="signup-box">
      <h1 class="signup-title">회원가입</h1>

      <div class="terms-box">
        <div class="terms-content-wrapper">
          <textarea class="terms-content" readonly>
✅ [필수] 이용약관 동의

제1조(목적)
이 약관은 회사(이하 “회사”)가 제공하는 서비스(이하 “서비스”)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조(정의)
“회원”이란 이 약관에 따라 회사와 이용계약을 체결하고, 서비스를 이용하는 자를 말합니다.
“아이디(ID)”란 회원 식별과 서비스 이용을 위해 회원이 정하고 회사가 승인한 문자와 숫자의 조합을 말합니다.
“비밀번호”란 회원의 개인정보 보호 및 인증을 위해 설정한 문자와 숫자의 조합을 말합니다.

제3조(약관의 게시와 개정)
회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기화면 또는 연결화면에 게시합니다.
회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
개정 약관은 적용일자 및 개정사유를 명시하여 현행 약관과 함께 공지합니다.

제4조(회원가입)
회원가입은 이용자가 약관에 동의하고, 회사가 정한 가입 양식에 따라 정보를 입력하고, 가입을 완료함으로써 체결됩니다.
회사는 다음과 같은 사유가 있는 경우 가입 신청을 거절하거나 사후에 이용을 제한할 수 있습니다.

실명이 아닌 경우
타인의 정보를 도용한 경우
허위 정보를 입력한 경우

제5조(서비스의 제공 및 변경)
회사는 회원에게 아래의 서비스를 제공합니다.

콘텐츠 제공 서비스
회원관리 및 고객지원 서비스

회사는 기술적 사양 변경 등 필요한 경우 서비스 내용을 변경할 수 있으며, 이 경우 사전 공지합니다.

제6조(서비스의 중단)
회사는 설비 점검, 교체, 장애 발생 등의 사유로 서비스 제공을 일시적으로 중단할 수 있습니다.
이 경우 회사는 사전 또는 사후에 회원에게 공지합니다.

제7조(회원의 의무)
회원은 관계 법령, 약관, 이용 안내 및 회사가 통지하는 사항을 준수하여야 하며, 아래 행위를 해서는 안 됩니다.

타인의 개인정보 도용
회사 및 제3자의 지식재산권 침해
서비스 운영 방해 행위 등

제8조(계약 해지)
회원은 언제든지 서비스 내 탈퇴 기능을 통해 이용계약을 해지할 수 있으며, 회사는 관련 법령에 따라 필요한 정보를 일정 기간 보관할 수 있습니다.

제9조(책임의 한계)
회사는 천재지변, 불가항력적인 사유로 인한 서비스 장애에 대해서는 책임을 지지 않습니다.

제10조(준거법 및 관할)
이 약관은 대한민국 법령에 따라 해석되며, 분쟁은 회사 소재지를 관할하는 법원에 제기합니다.
위 이용약관에 동의합니다. (필수)
✅ [필수] 개인정보 수집 및 이용 동의

1. 수집 항목
이름, 이메일, 휴대전화 번호, 비밀번호
서비스 이용 기록, 접속 로그, 쿠키, IP 주소

2. 수집 목적
회원 가입 및 서비스 이용 관리
고객 상담, 민원 처리, 공지사항 전달
부정 이용 방지 및 비인가 사용 방지

3. 보유 및 이용 기간
회원 탈퇴 시 즉시 파기
단, 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보존
전자상거래 등에서의 소비자 보호에 관한 법률
계약 또는 청약철회 등에 관한 기록: 5년
대금결제 및 재화 등의 공급에 관한 기록: 5년
소비자 불만 또는 분쟁처리에 관한 기록: 3년

4. 동의를 거부할 권리 및 거부 시 불이익
귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 거부할 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.
개인정보 수집 및 이용에 동의합니다. (필수)
          </textarea>

          <label class="agree-checkbox">
            <input type="checkbox" v-model="agree" />
            [필수] 약관에 동의합니다
          </label>
        </div>
      </div>

      <button class="next-button" :disabled="!agree" @click="goToNext">
        다음으로
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const agree = ref(false);
const router = useRouter();

const goToNext = () => {
  router.push('/signup2');
};
</script>

<style scoped>
.signup-box {
  width: 80vw;
  max-width: 45vw;
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.signup-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.terms-box {
  border: 1px solid #ccc;
  padding: 1rem;
  height: 60vh;
  overflow-y: auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.terms-content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.terms-content {
  width: 100%;
  height: 55vh;
  border: none;
  resize: none;
  background-color: transparent;
  font-size: 1.2rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.agree-checkbox {
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.agree-checkbox input {
  margin-right: 0.5rem;
}

.next-button {
  display: block;
  margin: 1rem auto 0;
  width: 60%;
  height: 3.2rem;
  background-color: var(--color-dark-gray);
  color: var(--color-white);
  border-radius: 0.5rem;
  font-size: 1.2rem;
  margin-top: 1rem;
}
.next-button:hover {
  background: #555;
}

.next-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
