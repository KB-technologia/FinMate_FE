import { defineStore } from 'pinia';

export const useSignupStore = defineStore('signup', {
  state: () => ({
    email: '',
    accountId: '',
    name: '',
    password: '',
    passwordConfirm: '',
    birth: '',
    gender: '',
    isMarried: false,
    hasJob: false,
    usesPublicTransport: false,
    doesExercises: false,
    travelsFrequently: false,
    hasChildren: false,
    hasHouse: false,
    employedAtSme: false,
    usesMicroloan: false,
  }),
});
