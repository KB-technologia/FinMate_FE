<!-- 테스트용 - 모달 적용 후 삭제할 파일 -->
<template>
  <div>
    <button @click="showModal = true">🎁 캐릭터 뽑기 시작</button>

    <CharacterGachaModal
      v-if="showModal"
      @confirm="handleConfirm"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import CharacterGachaModal from "@/components/info/gacha/CharacterGachaModal.vue";

const showModal = ref(false);

const handleConfirm = (url) => {
  console.log("뽑힌 알 이미지 URL:", url);
};
</script>
