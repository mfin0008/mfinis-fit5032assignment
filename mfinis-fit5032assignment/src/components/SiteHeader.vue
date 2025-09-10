<script setup>
import { useCurrentUser } from '@/composables/useCurrentUser';
import { RouterLink } from 'vue-router';

const { user, isLoggedIn } = useCurrentUser();
</script>

<template>
  <div>
    <nav class="navbar navbar-dark navbar-expand-xxl" style="background: var(--color-primary);">
      <div class="container-fluid">

        <RouterLink to="/" class="me-auto brand-long">
          <span class="emphasised-character">V</span>ictorial
          <span class="emphasised-character">S</span>ocial
          <span class="emphasised-character">F</span>ootball
          <span class="emphasised-character">L</span>eague
        </RouterLink>
        <RouterLink to="/" class="me-auto brand-short">
          <span class="emphasised-character">VSFL</span>
        </RouterLink>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-center gap-3">
            <li v-if="user===undefined"></li>
            <li class="nav-item" v-else-if="!isLoggedIn"><RouterLink to="/login" class="nav-link">LOGIN</RouterLink></li>
            <li class="nav-item" v-else><RouterLink to="/profile" class="nav-link">PROFILE</RouterLink></li>
            <li class="nav-item"><RouterLink to="/team" class="nav-link">TEAM</RouterLink></li>
            <li class="nav-item"><RouterLink to="/fixture" class="nav-link">FIXTURE</RouterLink></li>
            <li class="nav-item"><RouterLink to="/standings" class="nav-link">STANDINGS</RouterLink></li>
            <li class="nav-item"><RouterLink to="/statistics" class="nav-link">STATISTICS</RouterLink></li>
            <li class="nav-item"><RouterLink to="/venues" class="nav-link">VENUES</RouterLink></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<style>
.navbar .nav-link {
  color: var(--color-secondary);
}
.navbar .nav-link:hover {
  background-color: var(--color-secondary);
  color: var(--color-neutral);
}

header {
  line-height: 1.5;
  background-color: var(--color-primary);
}

.emphasised-character {
  font-size: 5vh
}

nav a, li {
  padding: 0 1rem;
  text-decoration: none;
  color: var(--color-secondary);
  font-size: 2.5vh;
  font-weight: bold;
}

nav a.router-link-exact-active.nav-link {
  color: var(--color-neutral);
}

.brand-long { display: none; }
.brand-short { display: inline; }

@media (min-width: 1900px) {
  .brand-long { display: inline; }
  .brand-short { display: none; }
}
</style>
