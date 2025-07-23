<script setup>
import { ref, onMounted } from 'vue';
import { createPortfolio, updatePortfolio } from '@/api/portfolio/portfolio.js';

const emit = defineEmits(['close', 'save']); //부모 컴포넌트(PortfolioContainer에게 이벤트 전달)
const error = ref(false);

const props = defineProps({
  //mode를 통해 모달이 수정인지 작성인지 구분
  mode: {
    type: String,
    default: 'write',
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const form = ref({
  //사용자에게 입력받을 초깃값 세팅
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
  if (props.mode === 'edit' && props.initialData) {
    //부모가 전달한 데이터 (portfolio)가 있는지? 부모가 수정 모드로 열었는지 확인
    form.value = { ...props.initialData };
  }
});

const fields = [
  { name: 'age', label: '나이', unit: '세' },
  { name: 'annualIncome', label: '연 소득', unit: '원' },
  { name: 'cash', label: '현금 / 예금', unit: '원' },
  { name: 'bond', label: '채권', unit: '원' },
  { name: 'equity', label: '주식 / 펀드', unit: '원' },
  { name: 'other', label: '기타 자산', unit: '원' },
];
async function onSubmit() {
  //필수 데이터 검증 (없다면) error 메시지 출력
  const requiredFields = [
    'age',
    'annualIncome',
    'cash',
    'bond',
    'equity',
    'other',
  ];

  const hasEmpty = requiredFields.some(
    (key) =>
      form.value[key] === null ||
      form.value[key] === '' ||
      isNaN(form.value[key])
  );

  if (hasEmpty) {
    error.value = true;
    return;
  }
  error.value = false;

  const totalAssets = //DB에 POST 데이터 보내기 데이터 전처리 과정
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
  if (props.mode === 'edit') {
    //수정모달일 때만 DB에 id값을 전달
    fullData.id = form.value.id;
  }

  try {
    if (props.mode === 'edit') {
      //수정모드면 PATCH경로로 전달
      await updatePortfolio(fullData);
    } else {
      //작성모드면 POST경로로 전달
      await createPortfolio(fullData);
    }
    emit('save', fullData);
  } catch (err) {
    console.error('저장 실패', err);
  }
}

function onCancel() {
  emit('close');
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <img
        src="@/assets/images/totalassets.png"
        class="top-icon"
        alt="totalassets이미지"
      />
      <h2 class="modal-title">
        {{ mode === 'edit' ? '재무 정보 수정' : '재무 정보 작성' }}
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
  background: #fffdf0;
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
  border-bottom: 1px solid #aaa;
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
  justify-content: flex-end;
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
  right: 0.5vw;
  color: #abaaaa;
  pointer-events: none;
  font-size: 0.9rem;
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
  background-color: #fffdf0;
  color: #000;
  border: 1px solid #c4c0c0;
  border-radius: 20px;
}

.btn-submit {
  padding: 0.8rem 5rem;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  background-color: #2e404c;
  color: #ffffff;
  border-radius: 20px;
}

.submit:hover {
  background-color: #555;
}
</style>
