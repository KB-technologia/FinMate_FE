<template>
  <aside class="sidebar">
    <div class="top-area">
      <div class="user-info">
        <p class="username">홍길동</p>
        <p class="level">Lv.3 소심한 카피바라</p>
        <button class="edit-btn" @click="goToMyInfo">정보 수정</button>
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
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ConfirmModal from '@/components/allshared/ConfirmModal.vue';
import { withdraw } from '@/api/auth/auth.js';
import { useToast } from '@/composables/useToast';
import withdrawImage from '@/assets/images/logos/withdrawkiwi.png';

const route = useRoute();
const router = useRouter();
const { toast } = useToast();

const showWithdrawConfirm = ref(false);

const current = computed(() => {
  const path = route.path;
  if (path.includes('/my-products')) return 'products';
  if (path.includes('/my-stat')) return 'stat';
  if (path.includes('/my-portfolio')) return 'portfolio';
  if (path.includes('/my-reviews')) return 'reviews';
  return '';
});

const goTo = (target) => {
  if (target === 'stat') router.push('/my-stats');
  else if (target === 'products') router.push('/my-products');
  else if (target === 'portfolio') router.push('/my-portfolio');
  else if (target === 'reviews') router.push('/my-reviews');
};

const goToMyInfo = () => {
  router.push('/my-info');
};

const handleWithdrawClick = () => {
  showWithdrawConfirm.value = true;
};

const handleWithdrawConfirm = async (confirmed) => {
  showWithdrawConfirm.value = false;
  if (confirmed) {
    try {
      await withdraw();
      toast('회원 탈퇴가 완료되었습니다.', 'success');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error('회원 탈퇴 처리 실패:', error);
      toast('탈퇴 처리 중 오류가 발생했습니다.', 'error');
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 300px;
  height: 60vh;
  padding: 0;
  margin-left: -1.2vw;
  border: 3px solid var(--color-primary-bluegray);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: var(--font-wanted);
}

.top-area {
  flex-shrink: 0;
  margin-top: 1.5rem;
}

.user-info {
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
  background-color: var(--color-black);
  color: var(--color-white);
}

.hover-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.hover-item:hover {
  background-color: var(--color-primary-yellow);
  font-weight: bold;
}

.divider {
  height: 1px;
  background-color: var(--color-primary-bluegray);
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
</style>
