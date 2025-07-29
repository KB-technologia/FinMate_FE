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
    maritalStatus: '',
    hasJob: false,
    usesPublicTransport: false,
    exercises: false,
    anniversaryFrequency: '',
    travelsFrequently: '',
    numberOfChildren: 0,
    housingType: '',
    employedAtSme: false,
    usesMicroloan: false,
  }),
});
