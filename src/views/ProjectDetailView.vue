<!-- src/views/ProjectDetailView.vue -->
<template>
    <div class="max-w-3xl mx-auto space-y-6">
  
      <RouterLink
        to="/"
        class="btn btn-sm btn-ghost hover:bg-base-200 flex items-center gap-1"
      >
        <span class="text-lg">←</span> Volver a proyectos
      </RouterLink>
  
      <!-- Si el proyecto existe -->
      <div v-if="project">
        <!-- Encabezado -->
        <h2 class="text-3xl font-bold flex items-center gap-3 mt-2">
          📁 {{ project.name }}
          <span class="text-sm font-normal text-gray-400">
            ({{ completed }}/{{ total }} tareas)
          </span>
        </h2>
  
        <!-- Progreso -->
        <progress
          class="progress progress-info w-full"
          :value="completed"
          :max="total"
        ></progress>
        <p class="text-sm text-gray-500">{{ progressPct }} % completado</p>
  
        <!-- Lista editable de tareas -->
        <ul class="space-y-3">
          <li
            v-for="task in project.tasks"
            :key="task.id"
            class="flex items-center gap-3"
          >
      
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              :checked="task.done"
              @change="store.toggleTask(project.id, task.id)"
            />
  
          
            <span
              v-if="editingId !== task.id"
              @click="startEdit(task)"
              class="flex-1 cursor-pointer"
              :class="{ 'line-through text-gray-400': task.done }"
            >
              {{ task.title }}
            </span>
  
            <input
              v-else
              v-model="editedTitle"
              class="input input-sm input-bordered flex-1"
              @keyup.enter="saveEdit(task)"
              @blur="saveEdit(task)"
            />
          </li>
        </ul>
  
    
        <form @submit.prevent="addNewTask" class="flex items-center gap-2 mt-5">
          <input
            v-model="newTaskTitle"
            class="input input-sm input-bordered flex-1"
            placeholder="Nueva tarea..."
          />
          <button type="submit" class="btn btn-sm btn-primary">Añadir</button>
        </form>
      </div>
  
   
      <div v-else class="text-center text-error text-xl font-semibold mt-10">
        Proyecto no encontrado
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useProjectsStore } from '@/stores/projectsStore'
  
  /* ---------- props ---------- */
  const props = defineProps({
    id: {
      type: String,
      required: true
    }
  })
  
  /* ---------- store ---------- */
  const store = useProjectsStore()
  
  /* ---------- datos del proyecto ---------- */
  const project = computed(() =>
    store.projects.find(p => p.id.toString() === props.id)
  )
  
  const prog = computed(() =>
    project.value ? store.projectProgress(project.value.id) : { total: 0, completed: 0 }
  )
  const total     = computed(() => prog.value.total)
  const completed = computed(() => prog.value.completed)
  
  const progressPct = computed(() =>
    total.value > 0 ? Math.round((completed.value / total.value) * 100) : 0
  )
  
 
  const editingId   = ref(null)
  const editedTitle = ref('')
  
  function startEdit(task) {
    editingId.value   = task.id
    editedTitle.value = task.title
  }
  
  function saveEdit(task) {
    const nuevo = editedTitle.value.trim()
    if (nuevo) {
      store.updateTaskTitle(project.value.id, task.id, nuevo)
    }
    editingId.value = null
  }
  
 
  const newTaskTitle = ref('')
  
  function addNewTask() {
    const title = newTaskTitle.value.trim()
    if (title && project.value) {
      store.addTask(project.value.id, title)
      newTaskTitle.value = ''
    }
  }
  </script>
  