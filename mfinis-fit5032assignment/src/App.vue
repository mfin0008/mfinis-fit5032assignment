<script setup>
import { RouterView } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
import './assets/main.css';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <header class="sticky-top"><SiteHeader /></header>
  <div class="site-content">
    <RouterView style="background-color: var(--color-secondary);"/>
  </div>
  <footer class="sticky-bottom"><SiteFooter /></footer>
</template>

<style scoped>
.site-content {
  background-color: var(--color-secondary);;
}
</style>
