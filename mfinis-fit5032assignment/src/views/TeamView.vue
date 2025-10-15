<script setup>
import CoachTeamDisplay from '@/components/CoachTeamDisplay.vue';
import PlayerTeamDisplay from '@/components/PlayerTeamDisplay.vue';
import { useCurrentUser } from '@/composables/useCurrentUser';
import { isRole } from '@/firebase/collections/users';

import { Roles } from '../../shared/constants.js';
import { ref, watch } from 'vue';

const { user } = useCurrentUser();
const isPlayerRole = ref(true);

watch(
  user,
  async (u) => {
    try {
      if (u) isPlayerRole.value = await isRole(u.uid, Roles.PLAYER);
    } catch (error) {
      alert('Oops! Something went wrong...');
      console.error(error);
    }
  },
  { immediate: true }
)
</script>

<template>
  <PlayerTeamDisplay v-if="isPlayerRole" :user-id="user.uid"/>
  <CoachTeamDisplay v-else :user-id="user.uid"/>
</template>
