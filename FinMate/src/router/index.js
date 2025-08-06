import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth/auth";

const routes = [
  // Main
  {
    path: "/",
    name: "main",
    component: () => import("@/views/main/MainView.vue"),
  },
  // Auth
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
  },
  {
    path: "/auth/kakao/callback",
    name: "KakaoRedirect",
    component: () => import("@/views/auth/KakaoRedirect.vue"),
  },
  {
    path: "/signup-survey",
    name: "signupSurvey",
    component: () => import("@/views/auth/SignupSurvey.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/signup1",
    name: "signup1",
    component: () => import("@/views/auth/SignUpView1.vue"),
  },
  {
    path: "/signup/complete",
    name: "signupComplete",
    component: () => import("@/views/auth/SignupComplete.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/signup2",
    name: "signup2",
    component: () => import("@/views/auth/SignUpView2.vue"),
  },
  {
    path: "/find-id",
    name: "findId",
    component: () => import("@/views/auth/FindIdView.vue"),
  },
  {
    path: "/find-pw",
    name: "findPw",
    component: () => import("@/views/auth/FindPwView.vue"),
  },
  {
    path: "/reset-pw",
    name: "resetPw",
    component: () => import("@/views/auth/ResetPwView.vue"),
  },
  // Product
  {
    path: "/products",
    name: "allProducts",
    component: () => import("@/views/product/AllProductView.vue"),
    meta: { allowScroll: true },
  },
  {
    path: "/product/:id",
    name: "detailProduct",
    component: () => import("@/views/product/DetailProductView.vue"),
  },
  {
    path: "/product/demo/reviews",
    name: "productReviewTest",
    component: () => import("@/views/product/DetailProductView.vue"),
  },
  {
    path: "/recommend",
    name: "recommendProduct",
    component: () => import("@/views/product/RecommendProductView.vue"),
    meta: { requiresAuth: true },
  },
  // Info
  {
    path: "/my-info",
    name: "myInfo",
    component: () => import("@/views/info/MyInfoView.vue"),
    meta: { requiresAuth: true },
  },
  // 테스트 나중에 지우기
  {
    path: "/gacha-test",
    name: "gachaTest",
    component: () => import("@/views/info/GachaTestView.vue"),
  },

  {
    path: "/my-portfolio",
    name: "myPortfolio",
    component: () => import("@/views/info/MyPortfolioView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/my-stats",
    name: "myStats",
    component: () => import("@/views/info/MyStatsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/my-products",
    name: "myProducts",
    component: () => import("@/views/info/MyProducts.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/my-reviews",
    name: "myReviews",
    component: () => import("@/views/info/MyReviews.vue"),
    meta: { requiresAuth: true },
  },
  // Board
  {
    path: "/board",
    name: "board",
    component: () => import("@/views/board/BoardView.vue"),
  },
  {
    path: "/board/:id",
    name: "detailBoard",
    component: () => import("@/views/board/DetailBoardView.vue"),
  },
  // Quiz
  {
    path: "/quizstart",
    name: "quizStart",
    component: () => import("@/views/quiz/QuizStartView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/quizsecond",
    name: "quizSecond",
    component: () => import("@/views/quiz/QuizSecondView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/quiz",
    name: "quiz",
    component: () => import("@/views/quiz/QuizView.vue"),
    meta: { requiresAuth: true },
  },
  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  console.log("[라우터 진입]", to.path, "isLoggedIn:", isLoggedIn);

  if (to.meta.requiresAuth && !isLoggedIn) {
    alert("로그인이 필요합니다.");
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
