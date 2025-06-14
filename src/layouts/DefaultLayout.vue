<template>
  <div class="flex min-h-screen">

    <SideBar />

  
    <main class="flex-1 bg-base-100 p-6 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue'
</script>
