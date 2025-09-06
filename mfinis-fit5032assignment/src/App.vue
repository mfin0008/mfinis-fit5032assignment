<script setup>
import { RouterView } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <div class="page">
    <header class="sticky-top vw-100"><SiteHeader /></header>
    <main class="site-content vw-100">
      <RouterView />
    </main>
    <footer class="sticky-bottom vw-100"><SiteFooter /></footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: var(--color-secondary);
  place-items: center;
}
@supports (height: 100dvh) {
  .page { min-height: 100dvh; }
}
</style>
