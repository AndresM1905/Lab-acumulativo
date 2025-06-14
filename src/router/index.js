import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'

const routes = [
  { path: '/',              name: 'home',            component: HomeView },
  { path: '/projects/:id',  name: 'project-detail',  component: ProjectDetailView, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
