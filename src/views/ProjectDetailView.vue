
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
        <!-- Encabezado con edición inline del nombre del proyecto -->
        <h2 class="text-3xl font-bold flex items-center gap-3 mt-2">
          📁 
          <span v-if="!editingProjectName" @dblclick="startProjectEdit" class="cursor-pointer">
            {{ project.name }}
          </span>
          <input 
            v-else 
            v-model="editedProjectName" 
            @keyup.enter="saveProjectName" 
            @blur="saveProjectName" 
            class="input input-bordered max-w-xs" 
            ref="projectNameInput" 
            autofocus 
          />
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

            <!-- Boton para eliminar una tarea -->
            <button 
              v-if="editingId !== task.id" 
              @click="deleteTask(task.id)" 
              class="btn btn-xs btn-error btn-outline"
            >
              Eliminar
            </button>
  
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

  // Variables para la edición del nombre del proyecto
  const editingProjectName = ref(false)
  const editedProjectName = ref('')
  const projectNameInput = ref(null)

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

  // Funciones para editar el nombre del proyecto
  function startProjectEdit() {
    editingProjectName.value = true
    editedProjectName.value = project.value.name

    setTimeout(() => {
      if (projectNameInput.value) {
        projectNameInput.value.focus()
      }
    }, 10)
  }

  function saveProjectName() {
    const nuevoNombre = editedProjectName.value.trim()
    if (nuevoNombre && nuevoNombre !== project.value.name && project.value) {
      store.updateProject({
        id: project.value.id,
        name: nuevoNombre,
        tasks: project.value.tasks
      })
    }
    editingProjectName.value = false
  }
  
 
  const newTaskTitle = ref('')
  
  function addNewTask() {
    const title = newTaskTitle.value.trim()
    if (title && project.value) {
      store.addTask(project.value.id, title)
      newTaskTitle.value = ''
    }
  }
  
  // Funcion para eliminar una tarea
  function deleteTask(taskId) {
    if (confirm('¿Está seguro que desea eliminar esta tarea?')) {
      store.deleteTask(project.value.id, taskId)
    }
  }
  </script>
  