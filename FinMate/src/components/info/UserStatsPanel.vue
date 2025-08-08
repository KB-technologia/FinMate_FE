<template>
  <div class="stats-panel">
    <CharacterGachaModal
      v-if="showGachaModal"
      @confirm="handleGachaConfirm"
      @close="showGachaModal = false"
    />
    <button class="ticket-badge" @click="openTicketModal">
      <img
        src="@/assets/images/icons/ticket.png"
        alt="티켓"
        class="ticket-icon"
      />
      <span class="ticket-count">x{{ ticketCount }}</span>
    </button>
    <h2 class="level-title">Lv.3 - {{ characterName || "알 수 없음" }}</h2>

    <div class="character-section">
      <img
        v-if="characterImage"
        :src="characterImage"
        alt="캐릭터"
        class="character"
      />
      <!-- <div class="speech-bubble" v-if="showSpeech" @click="hideSpeech">
        <span class="speech-text">연속 n일 출석중!</span>
      </div> -->
    </div>

    <div class="bars">
      <UserStatBar
        v-for="stat in stats"
        :key="stat.name"
        :label="stat.name"
        :percent="stat.value"
        :color="stat.color"
        :active="activeStat === stat.name"
        :interactive="true"
        @click="selectStat(stat.name)"
      />
    </div>

    <p
      class="style-description"
      :style="{
        borderColor: activeStatColor,
        color: activeStat ? 'var(--color-black)' : 'gray',
      }"
    >
      <ScanSearch class="icon-scan" />
      {{ statDescription }}
    </p>

    <button class="explore-btn" @click="$router.push('/quizstart')">
      <PawPrint class="icon-paw" /> 새로운 동물 만나러 가기
    </button>
  </div>
  <ToastContainer ref="toastRef" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { PawPrint, ScanSearch } from "lucide-vue-next";

import defaultPenguin from "@/assets/images/animals/penguin.png";
import UserStatBar from "@/components/allshared/UserStatBar.vue";
import ToastContainer from "@/components/allshared/ToastContainer.vue";
import CharacterGachaModal from "@/components/info/gacha/CharacterGachaModal.vue";
import { getMemberCharacter } from "@/api/info/userStatsAPI.js";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const characterImage = ref(defaultPenguin);
const characterName = ref("");

// TODO: 티켓 개수 (임시 하드코딩, 추후 API 연동 가능)
const ticketCount = ref(2);

const activeStat = ref(null);
const toastRef = ref(null);
// const showSpeech = ref(true);
const showGachaModal = ref(false);

const stats = [
  {
    name: "가치관",
    value: 79,
    color: "var(--color-red)",
    description: "가치관에 따라 투자 방향을 신중히 결정하는 타입이에요.",
  },
  {
    name: "속도",
    value: 95,
    color: "var(--color-survey-blue)",
    description: "빠른 의사결정과 실행력을 갖춘 속도 중시형 투자자예요.",
  },
  {
    name: "운/전략",
    value: 70,
    color: "var(--color-survey-yellow)",
    description: "운도 전략도 중요하게 여기는 균형 잡힌 타입이에요.",
  },
  {
    name: "재정",
    value: 60,
    color: "var(--color-orange)",
    description: "재정 상태를 고려해 신중하게 계획하는 타입이에요.",
  },
  {
    name: "모험 성향",
    value: 40,
    color: "var(--color-survey-green)",
    description: "도전을 좋아하지만 적절한 리스크 조절도 아는 타입이에요.",
  },
];

const openTicketModal = () => {
  if (ticketCount.value <= 0) {
    toastRef.value?.addToast("티켓이 없어요 🥲", "warning");
    return;
  }
  showGachaModal.value = true;
};

const selectStat = (name) => {
  activeStat.value = name === activeStat.value ? null : name;
};

const activeStatColor = computed(() => {
  const stat = stats.find((s) => s.name === activeStat.value);
  return stat ? stat.color : "transparent";
});

const statDescription = computed(() => {
  const stat = stats.find((s) => s.name === activeStat.value);
  return stat ? stat.description : "스탯을 클릭하면 세부 설명을 볼 수 있어요!";
});

// const hideSpeech = () => {
//   showSpeech.value = false;
// };

onMounted(async () => {
  // toastRef.value?.addToast("구름을 클릭하면 사라져요!", "info");

  try {
    const characterData = await getMemberCharacter();
    console.log("✅ 캐릭터 정보:", characterData);

    if (characterData?.animalImage) {
      characterImage.value = `${BASE_API_URL}${characterData.animalImage}`;
    } else {
      characterImage.value = defaultPenguin;
    }

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
  font-family: var(--font-wanted);
}

.level-title {
  min-width: 200px;
  font-family: var(--font-wanted);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  border: 2px solid var(--color-primary-bluegray);
  text-align: center;
}

.character-section {
  position: relative;
  margin-bottom: 2rem;
}

.character {
  width: 150px;
}

.ticket-badge {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.ticket-badge:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.ticket-badge:active {
  transform: translateY(1px);
}
.ticket-badge:focus-visible {
  outline: 2px solid var(--color-primary-bluegray);
}

.ticket-icon {
  width: 30px;
  height: auto;
  margin-right: 4px;
}

.ticket-count {
  font-weight: var(--font-weight-bold);
  font-size: 0.9rem;
  color: var(--color-black);
}

/* .speech-bubble {
  position: absolute;
  bottom: 70px;
  right: -230px;
  width: 240px;
  height: 140px;
  background-image: url("@/assets/images/icons/speech-stat.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speech-text {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--color-black);
  padding: 0.5rem 1rem;
  text-align: center;
} */

.bars {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.style-description {
  margin-top: 2.5rem;
  font-weight: bold;
  font-style: italic;
  font-size: 1rem;
  background-color: var(--color-white);
  padding: 1rem;
  border: 2.8px dashed;
  border-radius: 8px;
  text-align: center;
  max-width: 600px;
  word-wrap: break-word;
  white-space: normal;
}

.explore-btn {
  margin-top: 2rem;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 10px;
  background-color: var(--color-primary-green);
  color: var(--color-white);
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.explore-btn:hover {
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.icon-paw {
  width: 24px;
  height: 24px;
  margin-right: 3px;
  transform: translate(-2px, -1px);
}

.icon-scan {
  width: 28px;
  height: 28px;
  transform: translate(-3px, -3px);
}
</style>
