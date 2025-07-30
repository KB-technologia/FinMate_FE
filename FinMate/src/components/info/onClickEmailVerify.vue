<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <h2 class="modal-title">이메일 인증</h2>
      <p class="modal-desc">메일로 전송된 인증번호를 입력해주세요</p>
      <input
        type="text"
        v-model="authCode"
        placeholder="인증번호 6자리"
        maxlength="6"
        class="code-input"
      />
      <button class="submit-button" @click="submitCode">확인</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
import { verifyEmailCode } from "@/api/info/userInfoAPI";

const props = defineProps({
  requestId: String,
});

const emit = defineEmits(["success", "close"]);

const authCode = ref("");
const { toast } = useToast();

const submitCode = async () => {
  try {
    const result = await verifyEmailCode(props.requestId, authCode.value);
    if (result === true) {
      toast("이메일 인증이 완료되었습니다!", "success");
      emit("success");
      emit("close");
    } else {
      toast("인증번호가 일치하지 않습니다.", "error");
    }
  } catch (e) {
    toast("인증번호 확인 중 오류가 발생했습니다.", "error");
    console.error(e);
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  background-color: var(--color-primary-yellow);
  border-radius: 1.5rem;
  padding: 2rem;
  width: 90vw;
  max-width: 26rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-black);
}

.modal-desc {
  font-size: 1rem;
  color: var(--color-black);
}

.code-input {
  width: 100%;
  height: 3rem;
  border-radius: 1rem;
  border: 1px solid var(--color-light-gray);
  font-size: 1rem;
  padding: 0 1rem;
  outline: none;
}

.submit-button {
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  font-weight: bold;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
}

.submit-button:hover {
  background-color: var(--color-dark-gray);
}
</style>
