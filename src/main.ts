import { createApp } from 'vue'
import App from './App.vue'
import './theme/core.css'
import router from './router';
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import BaseLayout from './components/base/BaseLayout.vue'
/* Theme variables */
import './theme/variables.css';
import { Component } from 'ionicons/dist/types/stencil-public-runtime';
const pinia = createPinia()
const app = createApp(App)
  .use(IonicVue)
  .use(router);
app.component('base-layout',BaseLayout)
router.isReady().then(() => {
  app.use(pinia)
  app.mount('#app');
});