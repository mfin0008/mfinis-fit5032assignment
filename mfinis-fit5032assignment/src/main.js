import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.mount('#app')
