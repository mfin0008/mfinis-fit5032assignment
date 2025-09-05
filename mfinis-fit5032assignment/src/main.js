import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './assets/material-theme.css';
import './assets/main.css';

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

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBjtaJGwEl3m1ETuNA9dTK_a4V63J3Wxo",
  authDomain: "mfinis-fit5032assignment-a61d8.firebaseapp.com",
  projectId: "mfinis-fit5032assignment-a61d8",
  storageBucket: "mfinis-fit5032assignment-a61d8.firebasestorage.app",
  messagingSenderId: "192018340728",
  appId: "1:192018340728:web:a3ce0b8ec9a25e746d468d"
};

// Initialize Firebase
initializeApp(firebaseConfig);
