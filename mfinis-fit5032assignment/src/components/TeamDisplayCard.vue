<script setup>
import { getPlayersForTeam } from '@/firebase/collections/teams';
import { onMounted, ref } from 'vue';

const props = defineProps({teamId: String, teamName: String});
const emits = defineEmits(['selectTeam']);

const numberOfPlayers = ref(0);
onMounted(async () => numberOfPlayers.value = (await getPlayersForTeam(props.teamId)).length);
</script>

<template>
  <div class="raised-card vstack gap-1" style="cursor: pointer;" @click="() => emits('selectTeam', props.teamId)">
    <span><strong>Name: </strong>{{ props.teamName }}</span>
    <span><strong>Number of players: </strong>{{ numberOfPlayers }}</span>
  </div>
</template>
