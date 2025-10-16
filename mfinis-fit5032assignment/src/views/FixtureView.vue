<script setup>
import { getAllTeams } from '@/firebase/collections/teams';
import { onMounted, ref } from 'vue';
import FixtureCreationForm from '@/components/FixtureCreationForm.vue';
import { isRole } from '@/firebase/collections/users';
import { useCurrentUser } from '@/composables/useCurrentUser';
import { Roles } from '../../shared/constants';

const teams = ref([]);
onMounted(async () => {
  teams.value = await getAllTeams();
});

const { user } = useCurrentUser();
const isAdmin = await isRole(user.value.uid, Roles.ADMIN);
</script>

<template>

  <div class="container">
    <div class="row">
      <div v-if="isAdmin" class="content-box col-10 col-xxl-6 mx-auto">
        <div class="flex-column d-flex h-100 w-100">
          <h2 class="mt-3">Create a new fixture</h2>
          <FixtureCreationForm :teams="teams" />
        </div>
      </div>
    </div>
  </div>
</template>
