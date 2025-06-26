
import { defineStore } from 'pinia'

// Load data from localStorage on initialization
const loadProjects = () => {
  try {
    const saved = localStorage.getItem('projects')
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    console.error('Error loading projects from localStorage:', e)
    return null
  }
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    // Load projects from localStorage or use defaults if none exist
    projects: loadProjects() || [
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
    /* ---------- tareas ---------- */
    toggleTask(projectId, taskId) {
      const proj = this.projects.find(p => p.id === projectId)
      const task = proj?.tasks.find(t => t.id === taskId)
      if (task) task.done = !task.done
      this.saveToLocalStorage()
    },

    updateTaskTitle(projectId, taskId, newTitle) {
      const proj = this.projects.find(p => p.id === projectId)
      const task = proj?.tasks.find(t => t.id === taskId)
      if (task) task.title = newTitle
      this.saveToLocalStorage()
    },

   
    addTask(projectId, title) {
      const proj = this.projects.find(p => p.id === projectId)
      if (!proj) return
      const newId = `${projectId}-${Date.now()}`
      proj.tasks.push({ id: newId, title, done: false })
      this.saveToLocalStorage()
    },
    
    deleteTask(projectId, taskId) {
      const proj = this.projects.find(p => p.id === projectId)
      if (!proj) return
      proj.tasks = proj.tasks.filter(t => t.id !== taskId)
      this.saveToLocalStorage()
    },

    /* ---------- proyectos ---------- */
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
      this.saveToLocalStorage()
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
      this.saveToLocalStorage()
    },

    deleteProject(projectId) {
      this.projects = this.projects.filter(p => p.id !== projectId)
      this.saveToLocalStorage()
    },

    // Save all projects to localStorage
    saveToLocalStorage() {
      try {
        localStorage.setItem('projects', JSON.stringify(this.projects))
      } catch (e) {
        console.error('Error saving to localStorage:', e)
      }
    }
  }
})
