<!-- src/components/FloatingButton.vue -->
<template>
  <button :class="buttonClass" @click="$emit('click')">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="11.5" stroke="currentColor" stroke-width="1" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps({
  buttonClass: {
    type: String,
    default: 'btn btn-accent btn-circle fixed bottom-6 right-6 shadow-lg z-50',
  },
})

defineEmits(['click'])
</script>
