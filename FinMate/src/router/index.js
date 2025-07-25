import { createRouter, createWebHistory } from 'vue-router';

import MainView from '../views/main/MainView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Main
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    // Auth
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/signup1',
      name: 'signup1',
      component: () => import('../views/auth/SignUpView1.vue'),
    },
    {
      path: '/signup2',
      name: 'signup2',
      component: () => import('../views/auth/SingUpView2.vue'),
    },
    {
      path: '/find-id',
      name: 'findId',
      component: () => import('../views/auth/FindIdView.vue'),
    },
    {
      path: '/find-pw',
      name: 'findPw',
      component: () => import('../views/auth/FindPwView.vue'),
    },
    {
      path: '/reset-pw',
      name: 'resetPw',
      component: () => import('../views/auth/ResetPwView.vue'),
    },
    // Product
    {
      path: '/products',
      name: 'allProducts',
      component: () => import('../views/product/AllProductView.vue'),
    },
    {
      path: '/product/:id',
      name: 'detailProduct',
      component: () => import('../views/product/DetailProductView.vue'),
    },
    {
      path: '/recommend',
      name: 'recommendProduct',
      component: () => import('../views/product/RecommendProductView.vue'),
    },
    // Info
    {
      path: '/my-info',
      name: 'myInfo',
      component: () => import('../views/info/MyInfoView.vue'),
    },
    {
      path: '/my-portfolio',
      name: 'myPortfolio',
      component: () => import('../views/info/MyPortfolioView.vue'),
    },
    {
      path: '/my-stats',
      name: 'myStats',
      component: () => import('../views/info/MyStatsView.vue'),
    },
    // Board
    {
      path: '/board',
      name: 'board',
      component: () => import('../views/board/BoardView.vue'),
    },
    {
      path: '/board/:id',
      name: 'detailBoard',
      component: () => import('../views/board/DetailBoardView.vue'),
    },
    // Quiz
    {
      path: '/quiz/start',
      name: 'quizStart',
      component: () => import('../views/quiz/QuizStartView.vue'),
    },
    {
      path: '/quiz/0',
      name: 'quiz0',
      component: () => import('../views/quiz/Quiz0View.vue'),
    },
    {
      path: '/quiz/1',
      name: 'quiz1',
      component: () => import('../views/quiz/Quiz1View.vue'),
    },
    {
      path: '/quiz/2',
      name: 'quiz2',
      component: () => import('../views/quiz/Quiz2View.vue'),
    },
    {
      path: '/quiz/3',
      name: 'quiz3',
      component: () => import('../views/quiz/Quiz3View.vue'),
    },
    {
      path: '/quiz/4',
      name: 'quiz4',
      component: () => import('../views/quiz/Quiz4View.vue'),
    },
    {
      path: '/quiz/5',
      name: 'quiz5',
      component: () => import('../views/quiz/Quiz5View.vue'),
    },
    {
      path: '/quiz/6',
      name: 'quiz6',
      component: () => import('../views/quiz/Quiz6View.vue'),
    },
    {
      path: '/quiz/7',
      name: 'quiz7',
      component: () => import('../views/quiz/Quiz7View.vue'),
    },
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
});

export default router;
