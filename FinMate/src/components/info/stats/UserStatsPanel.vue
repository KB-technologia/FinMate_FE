<template>
  <div class="stats-panel">
    <CharacterGachaModal
      v-if="showGachaModal"
      @confirm="onGachaConfirmed"
      @close="showGachaModal = false"
      @reloading="mypagereloading"
    />
    <template v-if="hasAnalysis">
      <div class="header">
        <h2 class="level-title">
          {{
            userData.profileSummary + " " + characterData.animalName ||
            "소심한 펭귄"
          }}
        </h2>

        <div class="actions">
          <Tooltip text="캐릭터 다시 뽑기" placement="bottom">
            <button
              class="action-chip action-chip--ticket"
              @click="openTicketModal"
            >
              <img
                src="@/assets/images/icons/ticket.png"
                alt="티켓"
                class="ticket-icon"
              />
              <span class="ticket-count">x{{ userData?.characterTicket }}</span>
            </button>
          </Tooltip>

          <Tooltip text="다시 테스트 하러 가기" placement="bottom">
            <button
              class="action-chip action-chip--explore"
              @click="$router.push('/quizstart')"
            >
              <ScrollText class="icon-scroll" />
              <span>투자 성향 테스트</span>
            </button>
          </Tooltip>
        </div>
      </div>

      <div class="character-section">
        <img
          :src="`${FILE_BASE}${characterData?.animalImage}`"
          alt="캐릭터"
          class="character"
        />
      </div>

      <div class="level-section">Level {{ userData?.currentLevel }}</div>

      <div class="xp-bar">
        <div class="xp-fill" :style="{ width: fillPercentage + '%' }"></div>
        <span class="xp-text">{{ currentXp }}/{{ maxXp }}</span>
      </div>

      <div class="bars">
        <p class="stat-info">
          <Info class="stat-info__icon" />
          <span class="stat-info__text">
            각 항목을 클릭하시면 테스트 결과를 자세히 확인하실 수 있습니다.
          </span>
        </p>

        <ChoiceStatCard
          :index="0"
          title="가치관"
          :chips="descs.value.chips"
          v-model="selectedValueType"
          :summary="descs.value.summary"
          :descriptions="descs.value.descriptions"
          :expanded="activeCard === 'value'"
          :readonly="true"
          @toggle="toggle('value')"
        />

        <ChoiceStatCard
          :index="1"
          title="속도"
          :chips="descs.speed.chips"
          v-model="selectedSpeed"
          :summary="descs.speed.summary"
          :descriptions="descs.speed.descriptions"
          :rangeHint="descs.speed.rangeHint"
          :expanded="activeCard === 'speed'"
          :readonly="true"
          @toggle="toggle('speed')"
        />

        <ChoiceStatCard
          :index="2"
          title="운/전략"
          :chips="descs.luckStrategy.chips"
          v-model="selectedLuckOrStrategy"
          :summary="descs.luckStrategy.summary"
          :descriptions="descs.luckStrategy.descriptions"
          :expanded="activeCard === 'luckStrategy'"
          :readonly="true"
          @toggle="toggle('luckStrategy')"
        />

        <BarStatCard
          :index="3"
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

        <BarStatCard
          :index="4"
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
    </template>
    <template v-else>
      <div class="empty">
        <h3 class="empty-title">아직 테스트 결과가 없어요</h3>
        <p class="empty-desc">
          투자 성향 테스트를 완료하면 사용자의 성향 결과가 표시됩니다.
        </p>
        <button class="empty-btn" @click="$router.push('/quizstart')">
          테스트 하러 가기
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ScrollText, Info } from "lucide-vue-next";

import Tooltip from "@/components/allshared/Tooltip.vue";
import { useToast } from "@/composables/useToast";
import CharacterGachaModal from "@/components/info/gacha/CharacterGachaModal.vue";

import ChoiceStatCard from "@/components/info/stats/ChoiceStatCard.vue";
import BarStatCard from "@/components/info/stats/BarStatCard.vue";
import { userStatDescriptions as descs } from "@/constants/userStatDescriptions";

import { getMemberStat } from "@/api/main/main.js";
import { getUserData, FILE_BASE } from "@/api/mypage/level.js";
import { getCharacter } from "@/api/mypage/character.js";

const userData = ref(null);
const characterData = ref(null);

const { toast } = useToast();
const showGachaModal = ref(false);

const openTicketModal = () => {
  const currentTicket = userData.value?.characterTicket ?? 0;
  if (currentTicket <= 0) {
    toast("보유한 티켓이 없어요...!", "warning");
    return;
  }
  showGachaModal.value = true;
};

const onGachaConfirmed = () => {
  showGachaModal.value = false;
};

const activeCard = ref(null);
const toggle = (key) => {
  activeCard.value = activeCard.value === key ? null : key;
};

const selectedValueType = ref("");
const selectedSpeed = ref("");
const selectedLuckOrStrategy = ref("");

const financePercent = ref(0);
const adventurePercent = ref(0);

const maxXp = 1000;
const currentXp = computed(() => {
  const total = Number(userData.value?.totalExp ?? 0);
  return total % maxXp;
});

const fillPercentage = computed(() => {
  return Math.min(100, Math.max(0, (currentXp.value / maxXp) * 100));
});

const toLevel = (p) => (p >= 75 ? 3 : p >= 50 ? 2 : p >= 25 ? 1 : 0);
const financeLevel = computed(() => toLevel(financePercent.value));
const adventureLevel = computed(() => toLevel(adventurePercent.value));

const financeDesc = computed(
  () => descs.finance.getDescription(financeLevel.value) || ""
);

const adventureDesc = computed(
  () => descs.adventure.understandingDescriptions[adventureLevel.value] || ""
);

const hasAnalysis = computed(() => {
  const summary = userData.value?.profileSummary?.trim();
  const animal = characterData.value?.animalName?.trim();
  return !!summary && !!animal;
});

onMounted(async () => {
  try {
    const { data: stat } = await getMemberStat();
    financePercent.value = Math.max(
      0,
      Math.min(100, (stat.financeScore / 3) * 100)
    );
    adventurePercent.value = Math.max(
      0,
      Math.min(100, (stat.adventureScore / 3) * 100)
    );
    selectedValueType.value = descs.value.enumToLabel?.[stat.valueTag] ?? "";
    selectedSpeed.value = descs.speed.enumToLabel?.[stat.speedTag] ?? "";
    selectedLuckOrStrategy.value =
      descs.luckStrategy.enumToLabel?.[stat.strategyTag] ?? "";
  } catch (e) {
    toast("사용자 스탯을 불러오지 못했어요.", "warning");
  }

  try {
    const data = await getUserData();
    userData.value = data;
  } catch (e) {
    toast("레벨 정보를 불러오지 못했어요.", "warning");
  }

  try {
    const data = await getCharacter();
    characterData.value = data;
  } catch (e) {
    toast("캐릭터 정보를 불러오지 못했어요.", "warning");
  }
});

const mypagereloading = async () => {
  try {
    const user = await getUserData();
    userData.value = user;
    const character = await getCharacter();
    characterData.value = character;
  } catch (e) {
    toast("갱신 중 오류가 발생했어요.", "warning");
  }
};
</script>

<style scoped>
.stats-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
  max-width: 70rem;
  margin: 0 auto 1rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 0.75rem;
}

.level-title {
  grid-column: 2;
  justify-self: center;
  text-align: center;
  margin: 0;
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  padding: 0.5rem 1rem;
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
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.action-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--color-white);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 2.5rem;
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

.level-section {
  margin-bottom: 1rem;
  font-size: 1.6rem;
  font-weight: var(--font-weight-bold);
}

.xp-bar {
  position: relative;
  width: 240px;
  height: 30px;
  background-color: var(--color-light-gray);
  border-radius: 2.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
}
.xp-fill {
  height: 100%;
  background-color: var(--color-black);
  transition: width 0.5s ease;
}

.xp-text {
  position: absolute;
  top: 5px;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 13px;
  color: var(--color-white);
  font-weight: var(--font-weight-medium);
  text-align: center;
  z-index: 1;
}

.empty {
  width: 100%;
  max-width: 60rem;
  padding: 1.5rem 1rem 2.5rem;
  text-align: center;
  background: var(--color-white);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.empty-title {
  font-size: 1.4rem;
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.empty-desc {
  color: var(--color-chart-info);
  margin: 0 0 1rem;
}

.empty-title + .empty-desc {
  margin-top: 0.75rem;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 2rem;
  border-radius: var(--btn-radius);
  font-weight: var(--font-weight-semibold);
  background: var(--btn-gradient);
  color: var(--color-white);
  margin-top: 2rem;
}
.empty-btn:hover {
  filter: brightness(1.02);
  transform: translateY(-2px);
  transition: transform 0.15s ease, filter 0.15s ease;
}
</style>
