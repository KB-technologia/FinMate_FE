<template>
  <aside class="sidebar">
    <div class="top-area">
      <div class="user-info">
        <p class="username">홍길동</p>
        <p class="level">Lv.3 소심한 카피바라</p>
        <button class="edit-btn">정보 수정</button>
      </div>
    </div>

    <div class="bottom-area">
      <div class="menu-area">
        <div class="divider"></div>
        <ul>
          <li :class="{ active: current === 'products' }">PRODUCTS</li>
        </ul>
        <div class="divider"></div>
        <ul>
          <li :class="{ active: current === 'stat' }">STAT</li>
        </ul>
        <div class="divider"></div>
        <ul>
          <li :class="{ active: current === 'portfolio' }">PORTFOLIO</li>
        </ul>
        <div class="divider"></div>
      </div>

      <div class="exit">
        <p>서비스 탈퇴</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const current = computed(() => {
  const path = route.path;

  if (path.includes("/my-products")) return "products";
  if (path.includes("/my-stat")) return "stat";
  if (path.includes("/my-portfolio")) return "portfolio";
  return "";
});
</script>

<style scoped>
.sidebar {
  width: 300px;
  height: 60vh;
  padding: 0;
  border: 3px solid var(--color-primary-bluegray);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: var(--font-tmon);
}

.top-area {
  flex-shrink: 0;
  margin-top: 1.5rem;
}

.user-info {
  width: 100%;
  padding-left: 1rem;
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

.username,
.level {
  text-align: left;
}

.edit-btn {
  background-color: var(--color-primary-bluegray);
  color: var(--color-white);
  border: none;
  border-radius: 4px;
  padding: 0.6rem 2rem;
  cursor: pointer;
  text-align: center;
  width: 80%;
  margin: 0 auto;
  display: block;
  font-family: var(--font-inter);
  font-weight: bold;
}

.bottom-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  gap: 0;
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
  cursor: pointer;
}

.menu-area li.active {
  background-color: var(--color-black);
  color: var(--color-white);
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
  cursor: pointer;
}

.exit p {
  margin: 0;
}
</style>
