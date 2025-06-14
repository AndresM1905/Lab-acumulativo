<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Proyectos</h2>
    <p class="text-sm text-gray-400">
      {{ projectsStore.projects.length }} proyecto(s)
    </p>

    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th>Proyecto</th>
            <th class="text-center">Tareas</th>
            <th class="text-center">Avance</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(project, index) in projectsStore.projects"
            :key="project.id"
          >
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ project.name }}</td>
            <td class="text-center">{{ project.tasks.length }} tarea(s)</td>
            <td class="text-center">
              <div class="flex items-center gap-2 justify-center">
                <div class="w-24 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="bg-purple-400 h-2.5 transition-all duration-300"
                    :style="`width: ${pctDone(project.id)}%`"
                  ></div>
                </div>
                <span class="text-sm font-medium text-purple-400">
                  {{ pctDone(project.id) }}%
                </span>
              </div>
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  class="btn btn-sm btn-outline btn-primary"
                  @click="editProject(project)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-sm btn-outline btn-error"
                  @click="confirmDelete(project.id)"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="projectsStore.projects.length === 0">
            <td colspan="5" class="text-center text-gray-500 py-8">
              No hay proyectos registrados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón flotante -->
    <button
      class="btn btn-circle btn-primary fixed bottom-6 right-6 text-white shadow-lg z-50"
      @click="openModal"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Modal -->
    <ProjectModal
      :show="modalVisible"
      :isEditing="isEditing"
      :project="selectedProject"
      @close="closeModal"
      @save="saveProject"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectsStore } from '@/stores/projectsStore'
import ProjectModal from '@/components/ProjectModal.vue'

const projectsStore   = useProjectsStore()
const modalVisible    = ref(false)
const isEditing       = ref(false)
const selectedProject = ref(null)

function openModal() {
  isEditing.value = false
  selectedProject.value = null
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  selectedProject.value = null
}

function editProject(project) {
  isEditing.value       = true
  selectedProject.value = { ...project }
  modalVisible.value    = true
}

function confirmDelete(id) {
  if (window.confirm('¿Seguro que quieres eliminar este proyecto?')) {
    projectsStore.deleteProject(id)
  }
}

function saveProject(payload) {
  if (isEditing.value && payload.id) {
    projectsStore.updateProject(payload)
  } else {
    projectsStore.addProject(payload)
  }
  closeModal()
}

function pctDone(projectId) {
  const { total, completed } = projectsStore.projectProgress(projectId)
  return total > 0 ? Math.round((completed / total) * 100) : 0
}
</script>
