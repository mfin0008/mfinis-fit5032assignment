<script setup>
import { getAllTeams } from '@/firebase/collections/teams';
import { onMounted, ref } from 'vue';
import FixtureCreationForm from '@/components/FixtureCreationForm.vue';
import { isRole } from '@/firebase/collections/users';
import { useCurrentUser } from '@/composables/useCurrentUser';
import { Roles } from '../../shared/constants';
import { getAllVenues } from '@/firebase/collections/venues';

const teams = ref([]);
const isAdmin = ref(false);
const venues = ref([]);
onMounted(async () => {
  teams.value = await getAllTeams();
  const { user } = useCurrentUser();
  isAdmin.value = await isRole(user.value.uid, Roles.ADMIN);
  venues.value = await getAllVenues();
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div v-if="isAdmin" class="content-box col-10 col-xxl-5 mx-auto my-3">
        <div class="flex-column d-flex h-100 w-100">
          <h2 class="mt-3">Create a new fixture</h2>
          <FixtureCreationForm :teams="teams" />
        </div>
      </div>
      <div v-if="isAdmin" class="content-box col-10 col-xxl-5 mx-auto my-3">
        <span><h2 class="mt-3">Number of teams</h2>{{ teams.length }}</span>
        <span><h2 class="mt-3">Number of venues</h2>{{ venues.length }}</span>
      </div>
    </div>
  </div>
</template>