<template>
  <div class="stats-panel">
    <h2 class="level-title">Lv.3</h2>
    <div class="character-section">
      <img src="@/assets/images/penguin.png" alt="캐릭터" class="character" />
      <div class="speech-bubble">스탯을 눌러보세요!</div>
    </div>

    <div class="bars">
      <div v-for="stat in stats" :key="stat.name" class="bar-wrapper">
        <div class="bar-label">{{ stat.name }}</div>
        <div
          class="bar-track"
          :class="{ active: activeStat === stat.name }"
          :style="{
            borderColor: activeStat === stat.name ? stat.color : 'transparent',
          }"
          @click="selectStat(stat.name)"
        >
          <div
            class="bar-fill"
            :style="{ width: stat.value + '%', backgroundColor: stat.color }"
          />
        </div>
      </div>
    </div>

    <p class="style-description" :style="{ borderColor: activeStatColor }">
      <ScanSearch class="icon-scan" />
      위험보다는 안정을 추구하는 신중 투자자 스타일이에요! 위험보다는 안정을
      추구하는 신중 투자자 스타일이에요! 위험보다는 안정을 추구하는 신중 투자자
      스타일이에요! 위험보다는 안정을 추구하는 신중 투자자 스타일이에요!
      위험보다는
    </p>

    <button class="explore-btn">
      <PawPrint class="icon-paw" /> 새로운 동물 만나러 가기
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { PawPrint, ScanSearch } from "lucide-vue-next";

const activeStat = ref(null);

const stats = [
  { name: "가치관", value: 80, color: "var(--color-red)" },
  { name: "속도", value: 95, color: "var(--color-survey-blue)" },
  { name: "운/전략", value: 70, color: "var(--color-survey-yellow)" },
  { name: "재정", value: 60, color: "var(--color-orange)" },
  { name: "모험 성향", value: 40, color: "var(--color-survey-green)" },
];

const selectStat = (name) => {
  activeStat.value = name === activeStat.value ? null : name;
};

const activeStatColor = computed(() => {
  const stat = stats.find((s) => s.name === activeStat.value);
  return stat ? stat.color : "transparent";
});
</script>

<style scoped>
.stats-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-inter);
}

.level-title {
  min-width: 200px;
  font-family: var(--font-tmon);
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

.speech-bubble {
  position: absolute;
  top: 10px;
  right: -140px;
  background-color: white;
  border-radius: 12px;
  border: 2px solid #ccc;
  padding: 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bars {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.bar-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.5rem;
}

.bar-label {
  font-weight: bold;
  width: 100px;
  font-size: 1.25rem;
  white-space: nowrap;
  overflow: hidden;
}

.bar-track {
  width: 100%;
  height: 26px;
  background-color: #f1f1f1;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid transparent;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.bar-fill {
  height: 100%;
  border-radius: 14px 0 0 14px;
  transition: width 0.5s ease;
}

.bar-track.active {
  border: 2px solid var(--color-survey-blue);
  padding: 2px;
  box-sizing: border-box;
}

.style-description {
  margin-top: 2rem;
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
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #89caa2;
  color: white;
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
