<template>
  <!-- 우측 고정 컨트롤러: 데스크탑에서만 노출, 모바일은 숨김 / 순수 CSS + JS 버전 -->
  <nav
    class="rsc"
    :style="{ top: offset + 'px', left: fixedLeft }"
    aria-label="섹션 바로가기"
  >
    <div class="rsc-card">
      <ul class="rsc-list" role="tablist">
        <li v-for="s in sections" :key="s.id">
          <button
            class="rsc-btn"
            :class="{ 'is-active': activeId === s.id }"
            role="tab"
            :aria-selected="activeId === s.id"
            @click="handleClick(s.id)"
          >
            <span class="rsc-btn-label">{{ s.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="js">
import {
  onMounted, onBeforeUnmount, onActivated, onDeactivated,
  ref, computed, nextTick, watch
} from 'vue'
import { useRoute } from 'vue-router'

const sections = [
  { id: 'summary', label: '개요' },
  { id: 'details', label: '상세 정보' },
  { id: 'chart',   label: '수익률/금리 차트' },
  { id: 'reviews', label: '상품 리뷰' },
]

// ===== 설정값 =====
let offset = 120                 // px 또는 'rem' 문자열 허용
const contentMaxWidthRem = 62.5  // 본문 max-width rem (1000px)
const gapRem = 2                 // 본문과 컨트롤러 간격 rem
const behavior = 'smooth'        // 스크롤 동작

const now = () => performance.now()

function getEl(id) {
    return document.getElementById(id)
}
function getScrollableParent(node) {
  let cur = node?.parentElement
  while (cur && cur !== document.body) {
    const st = getComputedStyle(cur)
    const oy = st.overflowY
    if ((oy === 'auto' || oy === 'scroll') && cur.scrollHeight > cur.clientHeight) return cur
    cur = cur.parentElement
  }
  return window
}
function elementsReady() {
  return sections.every(s => !!getEl(s.id))
}

// ===== 상태 =====
const activeId = ref('')
let scrollRoot = null
let rafId = 0
let programmaticUntil = 0   // 클릭 중 깜빡임 억제
let observer = null         // (옵션) IO를 보조 용도로 쓰고 싶을 때
let retryTimer = null       // 비동기 렌더 대기
const route = useRoute()

const fixedLeft = computed(() => `calc(50% + ${contentMaxWidthRem / 2}rem + ${gapRem}rem)`)

// ===== 스크롤/하이라이트 =====
function scrollToId(id) {
  const el = getEl(id)
  if (!el) return
  const root = getScrollableParent(el)
  const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - offset
  root.scrollTo({ top, behavior })
}

function pickActiveByScroll() {
  if (!sections.length) return

  const viewportTop = (scrollRoot === window || !scrollRoot) ? 0 : scrollRoot.getBoundingClientRect().top
  const EPS = 2
  const positions = sections.map(s => {
    const el = getEl(s.id)
    const top = el ? (el.getBoundingClientRect().top - viewportTop - offset) : Infinity
    return { id: s.id, top }
  })
  const passed = positions.filter(p => p.top <= EPS)
  let bestId
  if (passed.length > 0) bestId = passed[passed.length - 1].id
  else {
    const next = positions.reduce(
      (acc, cur) => (cur.top < acc.top ? cur : acc),
      { id: positions[0].id, top: Infinity }
    )
    bestId = next.id
  }
  if (activeId.value !== bestId) activeId.value = bestId
}

function onScroll() {
  if (now() < programmaticUntil) return
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => { pickActiveByScroll(); rafId = 0 })
}

function handleClick(id) {
  programmaticUntil = now() + 700   // ← 먼저 억제
  activeId.value = id               // 즉시 고정
  scrollToId(id)                    // 스크롤
  history.replaceState(null, '', `#${id}`)
}

function setupObserver() {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    if (now() < programmaticUntil) return
    for (const e of entries) {
      if (e.isIntersecting) {
        const id = e.target.id
        if (activeId.value !== id) activeId.value = id
        break
      }
    }
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] })
  sections.forEach(s => { const el = getEl(s.id); if (el) observer.observe(el) })
}

// 초기화
async function reinit() {
  // cleanup
  if (observer) { observer.disconnect(); observer = null }
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null }

  await nextTick()

  // 스크롤 루트 재탐지
  const firstEl = getEl(sections[3]?.id)
  scrollRoot = getScrollableParent(firstEl)
  const rootEl = (scrollRoot === window || !scrollRoot) ? window : scrollRoot
  rootEl.addEventListener('scroll', onScroll, { passive: true })

  // 섹션 DOM이 준비될 때까지 재시도
  let tries = 0
  const mountWhenReady = () => {
    if (elementsReady()) {
      setupObserver()
      const hash = decodeURIComponent(location.hash.replace('#', ''))
      if (hash) {
        programmaticUntil = now() + 700
        setTimeout(() => scrollToId(hash), 0)
      } else if (sections.length > 0) {
        activeId.value = sections[0].id
      }
      pickActiveByScroll()
    } else if (tries < 20) {
      tries++
      retryTimer = setTimeout(mountWhenReady, 100)
    }
  }
  mountWhenReady()
}

// ===== 라이프사이클 =====
onMounted(() => {
  reinit()
  window.addEventListener('hashchange', onHashChange)
})
onBeforeUnmount(() => {
  const rootEl = (scrollRoot === window || !scrollRoot) ? window : scrollRoot
  rootEl?.removeEventListener('scroll', onScroll)
  window.removeEventListener('hashchange', onHashChange)
  if (observer) observer.disconnect()
  if (retryTimer) clearTimeout(retryTimer)
  if (rafId) cancelAnimationFrame(rafId)
})

// keep-alive / 라우팅 전환 대응
onActivated(() => { reinit() })
onDeactivated(() => { if (observer) observer.disconnect() })

const onHashChange = () => {
  const id = decodeURIComponent(location.hash.replace('#', ''))
  if (id) scrollToId(id)
}

// 라우트 변경 시 재초기화 (다른 상품 진입 시)
watch(() => route.fullPath, () => { reinit() })
</script>

<style scoped>
.rsc {
  position: fixed;
  z-index: 40;
}

@media (max-width: 1023px) {
  .rsc {
    display: none;
  }
}

.rsc-card {
  width: 224px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}
.rsc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.rsc-btn {
  width: 100%;
  text-align: left;
  font-size: 14px;
  line-height: 1.2;
  padding: 8px 12px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}
.rsc-btn:hover {
  background: #f5f5f5;
}
.rsc-btn.is-active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
.rsc-btn-label {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
