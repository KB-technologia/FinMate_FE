import axios from 'axios';

const API_BASE = import.meta.env.VITE_BASE_API_URL + '/api/quiz';

export const getDailyQuiz = () => {
  return axios.get(API_BASE);
};

export const getAnswerDailyQuiz = (quizId, answer) => {
  return axios.post(`${API_BASE}/check`, {
    quizId,
    answer,
  });
};
