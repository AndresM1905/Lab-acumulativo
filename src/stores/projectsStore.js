// src/stores/projectsStore.js
import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [
      {
        id: 1,
        name: 'Proyecto Alpha',
        tasks: [
          { id: 'a', title: 'Tarea 1', done: false },
          { id: 'b', title: 'Tarea 2', done: true }
        ]
      },
      {
        id: 2,
        name: 'Proyecto Beta',
        tasks: [
          { id: 'c', title: 'Diseño UI',  done: false },
          { id: 'd', title: 'Backend',    done: false },
          { id: 'e', title: 'Deploy',     done: false }
        ]
      }
    ]
  }),

  getters: {
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

    updateTaskTitle(projectId, taskId, newTitle) {
      const proj = this.projects.find(p => p.id === projectId)
      const task = proj?.tasks.find(t => t.id === taskId)
      if (task) task.title = newTitle
    },

    addProject({ name, tasks = [] }) {
      const idRaw = Date.now()
      this.projects.push({
        id: idRaw,
        name,
        tasks: tasks.map((t, i) => ({
          id:    `${idRaw}-${i}`,
          title: t.title,
          done:  false
        }))
      })
    },

    updateProject({ id, name, tasks }) {
      const idx = this.projects.findIndex(p => p.id === id)
      if (idx === -1) return

      this.projects[idx].name = name

      if (Array.isArray(tasks)) {
        const oldTasks = this.projects[idx].tasks
        this.projects[idx].tasks = tasks.map((t, i) => {
          const old = oldTasks[i]
          return {
            id:    old ? old.id : `${id}-${i}`,
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
