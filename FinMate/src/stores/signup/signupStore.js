import { defineStore } from 'pinia';

export const useSignupStore = defineStore('signup', {
  state: () => ({
    // 일반 입력 항목
    email: '',
    accountId: '',
    name: '',
    password: '',
    passwordConfirm: '',
    birth: '',
    gender: '',

    // 설문 응답 항목
    isMarried: false,
    hasJob: false,
    usesPublicTransport: false,
    doesExercise: false,
    travelsFrequently: false,
    hasChildren: false,
    hasHouse: false,
    employedAtSme: false,
    usesMicroloan: false,
  }),
});
