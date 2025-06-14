<template>
  <dialog
    id="project_modal"
    class="modal"
    @close="$emit('close')"
  >
    <div class="modal-box w-11/12 max-w-md">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</button>
      </form>

      <h3 class="text-lg font-bold mb-4">
        {{ isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
      </h3>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Nombre -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Nombre del proyecto</span>
          </label>
          <input
            type="text"
            placeholder="Ingresa el nombre del proyecto"
            class="input input-bordered w-full"
            v-model="localForm.name"
            required
          />
        </div>

        <!-- Tareas -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Tareas (una por línea)</span>
          </label>
          <textarea
            class="textarea textarea-bordered w-full"
            v-model="tasksText"
            rows="4"
            placeholder="Tarea #1&#10;Tarea #2&#10;Tarea #3&#10;…"
          ></textarea>
        </div>

       
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-outline"
            @click="handleClose"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!isFormValid"
          >
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  isEditing: Boolean,
  project: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['close','save'])

const localForm = ref({ id: null, name: '' })
const tasksText = ref('')


function resetForm() {
  localForm.value = { id: null, name: '' }
  tasksText.value = ''
}


watch(
  () => props.project,
  (p) => {
    if (p) {
      localForm.value = { id: p.id, name: p.name }
      tasksText.value = (p.tasks || []).map(t => t.title).join('\n')
    } else {
      resetForm()
    }
  },
  { immediate: true }
)


watch(
  () => props.show,
  (val) => {
    const modal = document.getElementById('project_modal')
    if (!modal) return

    if (val) {
  
      if (!props.isEditing) resetForm()
      modal.showModal()
    } else {
      modal.close()
    }
  }
)


const isFormValid = computed(() => localForm.value.name.trim().length > 0)


function submitForm() {
  if (!isFormValid.value) return

  const tasks = tasksText.value
    .split('\n')
    .map(l => l.trim())
    .filter(l => l)
    .map(title => ({ title }))

  emit('save', {
    id:   localForm.value.id,
    name: localForm.value.name.trim(),
    tasks
  })
}


function handleClose() {
  emit('close')
}
</script>
