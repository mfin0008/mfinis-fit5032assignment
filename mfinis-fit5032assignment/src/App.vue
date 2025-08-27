<script setup>
import { RouterView } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
import './assets/main.css';
</script>

<template>
  <div class="display">
    <SiteHeader />
    <RouterView class="content"/>
  </div>
</template>

<style scoped>
.content {
  height: 75vh;
  background-color: transparent;
}
.display {
  background-color: var(--color-secondary);
}
</style>
