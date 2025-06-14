// src/stores/projectsStore.js
import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [
      // ejemplos iniciales
      {
        id: 1,
        name: 'Proyecto Alpha',
        tasks: [
          { id: 'a', title: 'Tarea 1', done: false },
          { id: 'b', title: 'Tarea 2', done: true },
        ]
      },
      {
        id: 2,
        name: 'Proyecto Beta',
        tasks: [
          { id: 'x', title: 'Preparar briefing', done: false },
          { id: 'y', title: 'Reunión con el cliente', done: false },
          { id: 'z', title: 'Ajustes finales', done: false },
        ]
      }
    ]
  }),

  getters: {
    // { total, completed } para un proyecto
    projectProgress: (state) => (projectId) => {
      const proj = state.projects.find(p => p.id === projectId)
      if (!proj || proj.tasks.length === 0) return { total: 0, completed: 0 }
      const total     = proj.tasks.length
      const completed = proj.tasks.filter(t => t.done).length
      return { total, completed }
    }
  },

  actions: {
    toggleTask(projectId, taskId) {
      const proj = this.projects.find(p => p.id === projectId)
      const task = proj?.tasks.find(t => t.id === taskId)
      if (task) task.done = !task.done
    },

    addProject(payload) {
      // payload = { name: string, tasks: [{ title: string }] }
      const idRaw = Date.now()
      const tasks = (payload.tasks || []).map((t, i) => ({
        id:    `${idRaw}-${i}`,
        title: t.title,
        done:  false
      }))
      this.projects.push({
        id:    idRaw,
        name:  payload.name,
        tasks
      })
    },

    updateProject(payload) {
      // payload = { id, name, tasks?: [{ title: string }] }
      const idx = this.projects.findIndex(p => p.id === payload.id)
      if (idx === -1) return

      // 1) Actualizar nombre
      this.projects[idx].name = payload.name

      // 2) Reconstruir tareas por posición para preservar id y done
      if (Array.isArray(payload.tasks)) {
        const oldTasks = this.projects[idx].tasks
        const baseId   = String(payload.id)

        this.projects[idx].tasks = payload.tasks.map((t, i) => {
          const old = oldTasks[i]
          return {
            id:    old ? old.id : `${baseId}-${i}`,
            title: t.title,
            done:  old ? old.done : false
          }
        })
      }
    },

    deleteProject(projectId) {
      this.projects = this.projects.filter(p => p.id !== projectId)
    }
  }
})
