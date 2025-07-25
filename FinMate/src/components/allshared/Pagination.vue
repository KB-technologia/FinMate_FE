<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <div class="pagination-controls">
      <!-- 이전 페이지 -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="pagination-btn prev-btn"
        :class="{ disabled: currentPage <= 1 }"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- 페이지 번호들 -->
      <div class="page-numbers">
        <!-- 첫 페이지 -->
        <button
          v-if="startPage > 1"
          @click="goToPage(1)"
          class="pagination-btn page-btn"
        >
          1
        </button>

        <!-- ... 표시 -->
        <span v-if="startPage > 2" class="pagination-dots">...</span>

        <!-- 현재 주변 페이지들 -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'pagination-btn',
            'page-btn',
            { active: page === currentPage },
          ]"
        >
          {{ page }}
        </button>

        <!-- ... 표시 -->
        <span v-if="endPage < totalPages - 1" class="pagination-dots">...</span>

        <!-- 마지막 페이지 -->
        <button
          v-if="endPage < totalPages"
          @click="goToPage(totalPages)"
          class="pagination-btn page-btn"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- 다음 페이지 -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="pagination-btn next-btn"
        :class="{ disabled: currentPage >= totalPages }"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 12,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['page-change', 'page-size-change']);

const pageSizeOptions = [6, 9, 12, 18, 24];

// Computed 속성들
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.pageSize);
});

const startItem = computed(() => {
  return props.totalItems === 0
    ? 0
    : (props.currentPage - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
  const end = props.currentPage * props.pageSize;
  return end > props.totalItems ? props.totalItems : end;
});

const startPage = computed(() => {
  const start = props.currentPage - Math.floor(props.maxVisiblePages / 2);
  return Math.max(
    1,
    Math.min(start, totalPages.value - props.maxVisiblePages + 1)
  );
});

const endPage = computed(() => {
  return Math.min(
    startPage.value + props.maxVisiblePages - 1,
    totalPages.value
  );
});

const visiblePages = computed(() => {
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    pages.push(i);
  }
  return pages;
});

// 메서드들
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page);
  }
};

const handlePageSizeChange = (event) => {
  const newSize = parseInt(event.target.value);
  emit('page-size-change', newSize);
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px 0;
  margin-top: 32px;
  border-top: 1px solid #f0f0f0;
}

.pagination-info {
  flex-shrink: 0;
}

.total-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #ffffff;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(.disabled):not(.active) {
  border-color: #4caf50;
  color: #4caf50;
  background: #f8fff8;
}

.pagination-btn.active {
  border-color: #4caf50;
  background: #4caf50;
  color: white;
  font-weight: 600;
}

.pagination-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f5f5f5;
}

.prev-btn,
.next-btn {
  padding: 0 8px;
}

.page-btn {
  min-width: 36px;
  padding: 0 4px;
}

.pagination-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  color: #999;
  font-size: 14px;
  font-weight: 500;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.page-size-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.page-size-select {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: var(--color-white);
  color: #333;
  font-size: 14px;
  cursor: pointer;
  min-width: 70px;
}

.page-size-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

/* 반응형 */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  .pagination-info {
    order: 3;
  }

  .pagination-controls {
    order: 1;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-size-selector {
    order: 2;
  }

  .pagination-btn {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
  }

  .total-info {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .page-numbers {
    gap: 2px;
  }

  .pagination-btn {
    min-width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .page-size-select {
    min-width: 60px;
    padding: 4px 8px;
    font-size: 13px;
  }
}
</style>
