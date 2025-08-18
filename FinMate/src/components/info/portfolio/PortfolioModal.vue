``
<script setup>
import { ref, onMounted } from "vue";
import { createPortfolio, updatePortfolio } from "@/api/portfolio/portfolio.js";
import { Info } from "lucide-vue-next";

const emit = defineEmits(["close", "save"]);
const error = ref(false);

const props = defineProps({
  mode: {
    type: String,
    default: "write",
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const form = ref({
  cash: null,
  other: null,
});

onMounted(() => {
  //
  if (props.mode === "edit" && props.initialData) {
    form.value = { ...props.initialData };
  }
});

const fields = [
  { name: "cash", label: "현금", unit: "원" },
  { name: "other", label: "기타 자산", unit: "원" },
];

async function onSubmit() {
  const requiredFields = ["cash", "other"];

  const hasEmpty = requiredFields.some(
    (key) =>
      form.value[key] === null ||
      form.value[key] === "" ||
      isNaN(form.value[key])
  );

  if (hasEmpty) {
    error.value = true;
    return;
  }
  error.value = false;

  const fullData = {
    cash: form.value.cash,
    other: form.value.other,
  };

  try {
    if (props.mode === "edit") {
      await updatePortfolio(fullData);
    } else {
      await createPortfolio(fullData);
    }
    emit("save");
  } catch (err) {
    toast(
      "포트폴리오 저장 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.",
      "warning"
    );
  } finally {
    onCancel();
  }
}

function onCancel() {
  emit("close");
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <img
        src="@/assets/images/products/totalassets.png"
        class="top-icon"
        alt="totalassets이미지"
      />
      <h2 class="modal-title">
        {{ mode === "edit" ? "재무 정보 수정" : "재무 정보 작성" }}
      </h2>
      <div class="form-group" v-for="field in fields" :key="field.name">
        <label :for="field.name">{{ field.label }}</label>
        <div class="input-wrapper">
          <input :id="field.name" v-model.number="form[field.name]" />
          <span class="unit-inside">
            {{ field.unit }}
          </span>
        </div>
      </div>
      <p v-if="error" class="error-text">모든 값을 입력해주세요</p>
      <div class="btn-group">
        <button class="btn-cancel" @click="onCancel">취소</button>
        <button class="btn-submit" @click="onSubmit">저장</button>
      </div>
      <div>
        <info size="3%" class="info-img" /> 기타자산은 예금, 적금, 채권, 펀드,
        주식을 제외한 금융자산을 의미합니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: var(--color-modal-bg);
  border-radius: 20px;
  padding: 1.5rem 1.5rem;
  width: 45vw;
  box-shadow: 0 1vh 1vw rgba(50, 50, 50, 0.15);
}

.top-icon {
  width: 10%;
  display: block;
  margin: 0 auto 1rem auto;
}

.modal-title {
  font-size: 2.3rem;
  text-align: center;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #aaaaaa;
  margin-bottom: 2.5rem;
  margin-top: 3rem;
}

label {
  font-size: 1.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

input {
  padding: 0.6rem 1.5rem 0.6rem 0.6rem;
  border-radius: 15px;
  border: 1px solid #abaaaa;
  font-size: 1rem;
  text-align: right;
  margin-bottom: 0.5rem;
}

.unit-inside {
  position: absolute;
  right: 0.25vw;
  color: #abaaaa;
  pointer-events: none;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.error-text {
  color: red;
  font-size: 1.2rem;
  text-align: right;
  margin-top: -1rem;
  margin-bottom: 1rem;
}

.btn-group {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  gap: 14rem;
}

.btn-cancel {
  padding: 0.8rem 5rem;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  background-color: var(--color-modal-bg);
  color: var(--color-black);
  border: 1px solid #c4c0c0;
  border-radius: 20px;
}

.btn-submit {
  padding: 0.8rem 5rem;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  background-color: var(--color-dark-gray);
  color: var(--color-white);
  border-radius: 20px;
}

.btn-submit:hover {
  background-color: var(--color-primary-bluegray);
}

.btn-cancel:hover {
  color: var(--color-white);
  background-color: var(--color-red);
}

.info-img {
  color: var(--color-dark-gray);
}
</style>
