<script setup>
import CoachTeamDisplay from '@/components/CoachTeamDisplay.vue';
import PlayerTeamDisplay from '@/components/PlayerTeamDisplay.vue';
import { useCurrentUser } from '@/composables/useCurrentUser';
import { isRole, Roles } from '@/firebase/collections/users';
import { ref, watch } from 'vue';

const { user } = useCurrentUser();
const isPlayerRole = ref(true);

watch(
  user,
  async (u) => {
    if (u) isPlayerRole.value = await isRole(u.uid, Roles.PLAYER)
  },
  { immediate: true }
)
</script>

<template>
  <PlayerTeamDisplay v-if="isPlayerRole" :user-id="user.uid"/>
  <CoachTeamDisplay v-else :user-id="user.uid"/>
</template>
