<!-- src/components/SideBar.vue -->
<template>
  <aside class="w-64 min-h-screen p-4 bg-base-200">
    <h2 class="text-lg font-bold mb-1">Proyectos</h2>
    <p class="text-sm text-gray-400 mb-4">
      {{ projects.length === 0
        ? 'No hay proyectos'
        : `${projects.length} proyecto(s)` }}
    </p>

    <ul class="space-y-3">
      <li v-for="project in projects" :key="project.id">
        <details class="bg-base-300 rounded-lg p-3">
          <summary class="flex justify-between items-center cursor-pointer select-none">
            <!-- ▶️ Nombre clickable para ir al detalle -->
            <RouterLink
              :to="`/projects/${project.id}`"
              class="flex items-center gap-2 hover:underline"
            >
              <span class="text-2xl">📁</span>
              <span class="font-medium">{{ project.name }}</span>
            </RouterLink>

            <!-- Barra de avance -->
            <progress
              class="progress progress-info w-24"
              :value="progress(project.id).completed"
              :max="progress(project.id).total"
            ></progress>
          </summary>

          <!-- Lista rápida de tareas con check -->
          <ul class="mt-3 space-y-2 pl-6">
            <li v-for="task in project.tasks" :key="task.id" class="flex items-center gap-2">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="task.done"
                @change="toggleTask(project.id, task.id)"
              />
              <span :class="{ 'line-through text-gray-400': task.done }">
                {{ task.title }}
              </span>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectsStore } from '@/stores/projectsStore'

const store      = useProjectsStore()
const projects   = computed(() => store.projects)
const toggleTask = store.toggleTask
const progress   = store.projectProgress
</script>
