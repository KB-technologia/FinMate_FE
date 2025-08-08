<template>
  <div class="stats-panel">
    <CharacterGachaModal
      v-if="showGachaModal"
      @confirm="onGachaConfirmed"
      @close="showGachaModal = false"
    />
    <div class="actions">
      <button class="action-chip action-chip--ticket" @click="openTicketModal">
        <img
          src="@/assets/images/icons/ticket.png"
          alt="티켓"
          class="ticket-icon"
        />
        <span class="ticket-count">x{{ ticketCount }}</span>
      </button>

      <button
        class="action-chip action-chip--explore"
        @click="$router.push('/quizstart')"
      >
        <ScrollText class="icon-scroll" />
        <span>투자 성향 테스트</span>
      </button>
    </div>

    <h2 class="level-title">Lv.3 - {{ characterName || "알 수 없음" }}</h2>

    <div class="character-section">
      <img
        v-if="characterImage"
        :src="characterImage"
        alt="캐릭터"
        class="character"
      />
    </div>
    <div class="bars">
      <p class="stat-info">
        <Info class="stat-info__icon" />
        <span class="stat-info__text"
          >각 항목을 클릭하시면 테스트 결과를 자세히 확인하실 수 있습니다.</span
        >
      </p>
      <!-- 가치관 -->
      <ChoiceStatCard
        title="가치관"
        :chips="descs.value.chips"
        v-model="selectedValueType"
        :summary="descs.value.summary"
        :descriptions="descs.value.descriptions"
        :expanded="activeCard === 'value'"
        @toggle="toggle('value')"
      />

      <!-- 속도 -->
      <ChoiceStatCard
        title="속도"
        :chips="descs.speed.chips"
        v-model="selectedSpeed"
        :summary="descs.speed.summary"
        :descriptions="descs.speed.descriptions"
        :rangeHint="descs.speed.rangeHint"
        :expanded="activeCard === 'speed'"
        @toggle="toggle('speed')"
      />

      <!-- 운/전략 -->
      <ChoiceStatCard
        title="운/전략"
        :chips="descs.luckStrategy.chips"
        v-model="selectedLuckOrStrategy"
        :summary="descs.luckStrategy.summary"
        :descriptions="descs.luckStrategy.descriptions"
        :expanded="activeCard === 'luckStrategy'"
        @toggle="toggle('luckStrategy')"
      />

      <!-- 재정 (바) -->
      <BarStatCard
        label="재정"
        :percent="financePercent"
        color="var(--color-orange)"
        :summary="descs.finance.summary"
        :level="financeLevel"
        :description="financeDesc"
        :percentByLevel="descs.finance.percentByLevel"
        :expanded="activeCard === 'finance'"
        @toggle="toggle('finance')"
      />

      <!-- 모험 성향 (바) -->
      <BarStatCard
        label="모험 성향"
        :percent="adventurePercent"
        color="var(--color-survey-green)"
        :summary="descs.adventure.summary"
        :level="adventureLevel"
        :description="adventureDesc"
        :expanded="activeCard === 'adventure'"
        @toggle="toggle('adventure')"
      />
    </div>
  </div>

  <ToastContainer ref="toastRef" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ScrollText, Info } from "lucide-vue-next";

import defaultPenguin from "@/assets/images/animals/penguin.png";
import ToastContainer from "@/components/allshared/ToastContainer.vue";
import CharacterGachaModal from "@/components/info/gacha/CharacterGachaModal.vue";
import { getMemberCharacter } from "@/api/info/userStatsAPI.js";

import ChoiceStatCard from "@/components/info/stats/ChoiceStatCard.vue";
import BarStatCard from "@/components/info/stats/BarStatCard.vue";

import { userStatDescriptions as descs } from "@/constants/userStatDescriptions";

const characterImage = ref(defaultPenguin);
const characterName = ref("");

const ticketCount = ref(2);
const toastRef = ref(null);
const showGachaModal = ref(false);
const openTicketModal = () => {
  if (ticketCount.value <= 0) {
    toastRef.value?.addToast("보유한 티켓이 없어요 🥲", "warning");
    return;
  }
  showGachaModal.value = true;
};

const activeCard = ref(null);
const toggle = (key) => {
  activeCard.value = activeCard.value === key ? null : key;
};

// TODO: 선택값(임시)
const selectedValueType = ref("성장형");
const selectedSpeed = ref("중간");
const selectedLuckOrStrategy = ref("전략");

// TODO: 바 퍼센트(임시)
const financePercent = ref(60);
const adventurePercent = ref(40);

const toLevel = (p) => (p >= 75 ? 3 : p >= 50 ? 2 : p >= 25 ? 1 : 0);
const financeLevel = computed(() => toLevel(financePercent.value));
const adventureLevel = computed(() => toLevel(adventurePercent.value));

const financeDesc = computed(
  () => descs.finance.getDescription(financeLevel.value) || ""
);

const adventureDesc = computed(
  () => descs.adventure.understandingDescriptions[adventureLevel.value] || ""
);

onMounted(async () => {
  try {
    const characterData = await getMemberCharacter();
    characterImage.value = characterData?.animalImage
      ? `${BASE_API_URL}${characterData.animalImage}`
      : defaultPenguin;
    characterName.value = characterData?.animalName || "알 수 없음";
  } catch (e) {
    console.error("❌ 캐릭터 정보 요청 실패", e);
    characterImage.value = defaultPenguin;
    characterName.value = "알 수 없음";
  }
});
</script>

<style scoped>
.stats-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  text-align: center;
}

.character-section {
  position: relative;
  margin-bottom: 2rem;
}
.character {
  width: 10rem;
}

.ticket-count {
  font-weight: var(--font-weight-bold);
  font-size: 0.9rem;
}

.bars {
  width: 100%;
  max-width: 54rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

.actions {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
}

.action-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--color-white);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 0.45rem 0.8rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  line-height: 1;
}

.action-chip--ticket .ticket-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.action-chip--ticket .ticket-count {
  font-weight: var(--font-weight-bold);
  font-size: 0.9rem;
}

.icon-scroll {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

.action-chip:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.14);
  transform: translateY(-1px);
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.stat-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  margin: 0.25rem 0 0.75rem;
  color: var(--color-chart-info);
  line-height: 1;
}

.stat-info__icon {
  width: 1.1rem;
  height: 1.1rem;
  flex: 0 0 auto;
}
</style>
