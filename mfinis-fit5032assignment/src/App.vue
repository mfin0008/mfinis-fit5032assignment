<script setup>
import { RouterView } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
import './assets/main.css';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <div class="page">
    <header class="sticky-top"><SiteHeader /></header>
    <main class="site-content">
      <RouterView style="background-color: var(--color-secondary);"/>
    </main>
    <footer class="sticky-bottom"><SiteFooter /></footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: var(--color-secondary);
}
@supports (height: 100dvh) {
  .page { min-height: 100dvh; }
}

.site-content { background: var(--color-secondary); }
</style>
