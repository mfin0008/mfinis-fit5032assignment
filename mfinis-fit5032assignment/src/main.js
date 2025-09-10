import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/material-theme.css';
import './assets/main.css';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};
initializeApp(firebaseConfig);

const setupApp = async () => {
  const auth = getAuth();
  if (auth.authStateReady) {
    await auth.authStateReady()
  }

  const app = createApp(App)
  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
  });
  app.mount('#app')
}

setupApp()
