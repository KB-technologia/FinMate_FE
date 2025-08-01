<script setup>
import { ref, watch } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: Date,
  placeholder: {
    type: String,
    default: '날짜 선택',
  },
});

const selected = ref(props.modelValue || null);

watch(selected, (newDate) => {
  emit('update:modelValue', newDate);
});
</script>

<template>
  <div class="date-selector">
    <Datepicker
      v-model="selected"
      :enable-time-picker="false"
      :format="'yyyy-MM-dd'"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped>
.date-selector {
  display: inline-block;
}
</style>
