import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import MemoriesPage from '../pages/MemoriesPage.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/files/add'
  }, 
  {
    path: '/memories',
    component: MemoriesPage
  }
  ,
  {
    path: '/files',
    component: ()=>import('../pages/Files.vue')
  },
  {
    path: '/sign',
    component: ()=>import('../pages/SignaturePage.vue')
  },
  {
    path: '/files/add',
    component: ()=>import('../pages/AddFiles.vue')
  },
  {
    path: '/memories/add',
    component: ()=>import('../pages/AddMemoryPage.vue')
  },
  {
    path: '/file/:id',
    component:  ()=>import('../pages/PreviewPage.vue')
  },
   {
    path: '/memories/:id',
    component:  ()=>import('../pages/MemoryDetailsPage.vue')
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
