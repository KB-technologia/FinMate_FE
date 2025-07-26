import { createRouter, createWebHistory } from "vue-router";

import MainView from "../views/main/MainView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Main
    {
      path: "/",
      name: "main",
      component: MainView,
    },
    // Auth
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/auth/kakao/redirect",
      name: "KakaoRedirect",
      component: () => import("../views/auth/KakaoRedirect.vue"),
    },
    {
      path: "/signup1",
      name: "signup1",
      component: () => import("../views/auth/SignUpView1.vue"),
    },
    {
      path: "/signup2",
      name: "signup2",
      component: () => import("../views/auth/SignUpView2.vue"),
    },
    {
      path: "/find-id",
      name: "findId",
      component: () => import("../views/auth/FindIdView.vue"),
    },
    {
      path: "/find-pw",
      name: "findPw",
      component: () => import("../views/auth/FindPwView.vue"),
    },

    {
      path: "/reset-pw",
      name: "resetPw",
      component: () => import("../views/auth/ResetPwView.vue"),
    },
    // Product
    {
      path: "/products",
      name: "allProducts",
      component: () => import("../views/product/AllProductView.vue"),
      meta: {
        allowScroll: true,
      },
    },
    {
      path: "/product/:id",
      name: "detailProduct",
      component: () => import("../views/product/DetailProductView.vue"),
    },
    {
      path: "/product/:id/reviews",
      name: "productReviewList",
      component: () => import("../views/product/ProductReviewListView.vue"),
      meta: {
        allowScroll: true,
      },
    },
    {
      path: "/recommend",
      name: "recommendProduct",
      component: () => import("../views/product/RecommendProductView.vue"),
    },
    // Info
    {
      path: "/my-info",
      name: "myInfo",
      component: () => import("../views/info/MyInfoView.vue"),
    },
    {
      path: "/my-portfolio",
      name: "myPortfolio",
      component: () => import("../views/info/MyPortfolioView.vue"),
    },
    {
      path: "/my-stats",
      name: "myStats",
      component: () => import("../views/info/MyStatsView.vue"),
    },
    {
      path: "/my-products",
      name: "myProducts",
      component: () => import("../views/info/MyProducts.vue"),
    },
    {
      path: "/my-reviews",
      name: "myReviews",
      component: () => import("../views/info/MyReviews.vue"),
    },
    // Board
    {
      path: "/board",
      name: "board",
      component: () => import("../views/board/BoardView.vue"),
    },
    {
      path: "/board/:id",
      name: "detailBoard",
      component: () => import("../views/board/DetailBoardView.vue"),
    },
    // Quiz
    {
      path: "/quizstart",
      name: "quizStart",
      component: () => import("../views/quiz/QuizStartView.vue"),
    },
    {
      path: "/quiz",
      name: "quiz",
      component: () => import("../views/quiz/QuizView.vue"),
    },

    // 404
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
