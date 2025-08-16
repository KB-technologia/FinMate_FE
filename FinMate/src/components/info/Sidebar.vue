<template>
  <aside class="sidebar common-container">
    <div class="top-area">
      <div class="user-info">
        <p class="username">
          <span v-if="meLoading">로딩중…</span>
          <span v-else-if="meError">불러오기 실패</span>
          <span v-else>{{ displayAccountId }}</span>
        </p>
        <p class="level">
          <span v-if="statLoading">로딩중…</span>
          <span v-else-if="statError">정보 불러오기 실패</span>
          <span v-else-if="!hasAnalysis">테스트를 먼저 진행해주세요! </span>
          <span v-else>{{ levelTitle }}</span>
        </p>
        <div class="edit-icon-wrap">
          <Tooltip text="정보 수정" :offset="10" theme="naver">
            <button
              class="edit-icon-btn"
              @click="goToMyInfo"
              aria-label="정보 수정"
              type="button"
            >
              <UserRoundPen size="20" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>

    <div class="bottom-area">
      <div class="menu-area">
        <div class="divider"></div>
        <ul>
          <li
            class="hover-item"
            :class="{ active: current === 'stat' }"
            @click="goTo('stat')"
          >
            STAT
          </li>
        </ul>
        <div class="divider"></div>

        <ul>
          <li
            class="hover-item"
            :class="{ active: current === 'products' }"
            @click="goTo('products')"
          >
            PRODUCTS
          </li>
        </ul>
        <div class="divider"></div>

        <ul>
          <li
            class="hover-item"
            :class="{ active: current === 'reviews' }"
            @click="goTo('reviews')"
          >
            REVIEWS
          </li>
        </ul>
        <div class="divider"></div>

        <ul>
          <li
            class="hover-item"
            :class="{ active: current === 'portfolio' }"
            @click="goTo('portfolio')"
          >
            PORTFOLIO
          </li>
        </ul>
        <div class="divider"></div>
      </div>

      <div class="exit hover-item" @click="handleWithdrawClick">
        <p>서비스 탈퇴</p>
      </div>
    </div>

    <ConfirmModal
      v-if="showWithdrawConfirm"
      :firsttext="'정말 탈퇴하시겠습니까?'"
      :secondtext="'그동안의 기록은 모두 삭제됩니다.'"
      leftButtonText="취소"
      rightButtonText="탈퇴"
      @confirm="handleWithdrawConfirm"
      :images="withdrawImage"
    />
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserRoundPen } from "lucide-vue-next";

import Tooltip from "@/components/allshared/Tooltip.vue";
import ConfirmModal from "@/components/allshared/ConfirmModal.vue";
import { useToast } from "@/composables/useToast";
import withdrawImage from "@/assets/images/logos/withdrawkiwi.png";

import { withdraw } from "@/api/auth/auth.js";
import { getMyInfo } from "@/api/info/userInfoAPI";
import { getUserData } from "@/api/mypage/level.js";
import { getCharacter } from "@/api/mypage/character.js";

const route = useRoute();
const router = useRouter();
const { toast } = useToast();

const me = ref(null);
const meLoading = ref(false);
const meError = ref(false);

const showWithdrawConfirm = ref(false);

const userData = ref(null);
const characterData = ref(null);
const statLoading = ref(false);
const statError = ref(false);
const statEmpty = ref(false);

const current = computed(() => {
  const path = route.path;
  if (path.includes("/my-products")) return "products";
  if (path.includes("/my-stat")) return "stat";
  if (path.includes("/my-portfolio")) return "portfolio";
  if (path.includes("/my-reviews")) return "reviews";
  return "";
});

const goTo = (target) => {
  if (target === "stat") router.push("/my-stats");
  else if (target === "products") router.push("/my-products");
  else if (target === "portfolio") router.push("/my-portfolio");
  else if (target === "reviews") router.push("/my-reviews");
};

const goToMyInfo = () => {
  router.push("/my-info");
};

const handleWithdrawClick = () => {
  showWithdrawConfirm.value = true;
};

const handleWithdrawConfirm = async (confirmed) => {
  showWithdrawConfirm.value = false;
  if (confirmed) {
    try {
      await withdraw();
      toast("회원 탈퇴가 완료되었습니다.", "success");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      // TODO: 콘솔 로그 지우기
      console.error("회원 탈퇴 처리 실패:", error);
      toast("탈퇴 처리 중 오류가 발생했습니다.", "error");
    }
  }
};

onMounted(async () => {
  try {
    meLoading.value = true;
    const data = await getMyInfo();
    me.value = data;
  } catch (e) {
    meError.value = true;
    toast("사용자 정보를 불러오지 못했어요.", "error");
  } finally {
    meLoading.value = false;
  }

  try {
    statLoading.value = true;
    const [udRes, chRes] = await Promise.allSettled([
      getUserData(),
      getCharacter(),
    ]);

    if (udRes.status === "fulfilled") {
      userData.value = udRes.value;
      const lv = udRes.value?.currentLevel;
      const summary = udRes.value?.profileSummary;
      if (lv == null && !summary) statEmpty.value = true;
    } else {
      const code = udRes.reason?.response?.status;
      if (code === 404 || code === 204) statEmpty.value = true;
      else statError.value = true;
    }
    if (chRes.status === "fulfilled") {
      characterData.value = chRes.value;
    } else {
      const code = chRes.reason?.response?.status;
      if (code !== 404 && code !== 204) statError.value = true;
    }
  } finally {
    statLoading.value = false;
  }
});

const hasAnalysis = computed(() => {
  const summary = userData.value?.profileSummary?.trim();
  const animal = characterData.value?.animalName?.trim();
  return !!summary && !!animal;
});

const levelTitle = computed(() => {
  const lv = userData.value?.currentLevel;
  const summary = userData.value?.profileSummary;
  const name = characterData.value?.animalName;

  const left = lv != null ? `Lv.${lv}` : "Lv.-";
  const right = [summary, name].filter(Boolean).join(" ");
  return right ? `${left} ${right}` : left;
});

const displayAccountId = computed(() => me.value?.accountId ?? "...");
</script>

<style scoped>
.sidebar {
  width: 18.75rem;
  height: 60vh;
  margin-left: 0.5vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: visible;
  background-color: var(--color-white);
  box-shadow: var(--card-shadow);
}

.top-area {
  flex-shrink: 0;
  margin-top: 0.75rem;
}

.user-info {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 1rem;
}

.username {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  text-align: left;
}

.level {
  font-size: 0.95rem;
  color: var(--color-orange);
  margin-bottom: 0.75rem;
  text-align: left;
}

.edit-btn {
  align-self: center;
  padding: 0.6rem 0;
  width: 80%;
  max-width: 240px;
  margin-top: 0.5rem;
  font-family: var(--font-wanted);
  font-weight: bold;
  border: none;
  border-radius: 4px;
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  text-align: center;
}

.bottom-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
}

.menu-area ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.menu-area li {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1rem;
}

.menu-area li.active {
  background-color: var(--color-primary-green);
  color: var(--color-white);
}

.hover-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.hover-item:hover {
  background-color: rgba(137, 202, 162, 0.4);
  font-weight: bold;
}

.divider {
  height: 1px;
  background-color: var(--color-light-gray);
  width: 100%;
  margin: 0;
  padding: 0;
}

.exit {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1rem;
  color: var(--color-red);
}

.exit p {
  margin: 0;
}

.edit-icon-wrap {
  position: absolute;
  top: 0.1rem;
  right: 0.8rem;
}

.edit-icon-btn {
  background: transparent;
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-bluegray);
  transition: color 0.2s ease, transform 0.1s ease;
}

.sidebar {
  overflow: visible;
}

:deep(.edit-icon-wrap .tooltip-wrapper) {
  display: inline-flex;
}

:deep(.edit-icon-wrap .tooltip-bubble) {
  left: 50% !important;
  top: 100% !important;
  transform: translateX(-50%) !important;
  margin-top: 10px !important;
}
</style>
