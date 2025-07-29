<script setup>
import { ref, onMounted } from "vue";
import { createPortfolio, updatePortfolio } from "@/api/portfolio/portfolio.js";

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
  age: null,
  annualIncome: null,
  totalAssets: null,
  cash: null,
  bond: null,
  equity: null,
  other: null,
});

onMounted(() => {
  //
  if (props.mode === "edit" && props.initialData) {
    form.value = { ...props.initialData };
  }
});

const fields = [
  { name: "age", label: "나이", unit: "세" },
  { name: "annualIncome", label: "연 소득", unit: "원" },
  { name: "cash", label: "현금 / 예금", unit: "원" },
  { name: "bond", label: "채권", unit: "원" },
  { name: "equity", label: "주식 / 펀드", unit: "원" },
  { name: "other", label: "기타 자산", unit: "원" },
];
async function onSubmit() {
  const requiredFields = [
    "age",
    "annualIncome",
    "cash",
    "bond",
    "equity",
    "other",
  ];

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

  const totalAssets =
    form.value.cash + form.value.bond + form.value.equity + form.value.other;
  const cashRatio = (form.value.cash / totalAssets) * 100;
  const bondRatio = (form.value.bond / totalAssets) * 100;
  const equityRatio = (form.value.equity / totalAssets) * 100;
  const otherRatio = (form.value.other / totalAssets) * 100;
  const annualIncome = form.value.annualIncome;
  const age = form.value.age;

  const fullData = {
    userId: 1, // TODO: 실제 유저 ID로 대체
    age,
    annualIncome,
    totalAssets,
    cashRatio,
    bondRatio,
    equityRatio,
    otherRatio,
  };
  if (props.mode === "edit") {
    fullData.id = form.value.id;
  }

  try {
    if (props.mode === "edit") {
      await updatePortfolio(fullData);
    } else {
      await createPortfolio(fullData);
    }
    emit("save", fullData);
  } catch (err) {
    console.error("저장 실패", err);
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
          <input
            :id="field.name"
            v-model.number="form[field.name]"
            :class="field.name === 'age' ? 'input-short' : 'input-default'"
          />
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
  padding: 0.5rem 1.5rem;
  width: 45vw;
  max-height: 95vh;
  overflow-y: auto;
}

.top-icon {
  width: 100px;
  display: block;
  margin: 0 auto 1rem auto;
}

.modal-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #aaaaaa;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
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
}

.unit-inside {
  position: absolute;
  right: 0.25vw;
  color: #abaaaa;
  pointer-events: none;
  font-size: 1rem;
}

.input-short {
  width: 5vw;
}
.input-default {
  width: 10vw;
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
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border-radius: 20px;
}

.submit:hover {
  background-color: var(--color-dark-gray);
}
</style>
