import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/quiz';

export const getDailyQuiz = () => {
  return axios.get(API_BASE);
};

export const getAnswerDailyQuiz = (quizId, answer) => {
  return axios.post(`${API_BASE}/check`, {
    quizId,
    answer,
  });
};
