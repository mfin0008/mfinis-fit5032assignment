<script setup>
const props = defineProps({teamId: String, teamName: String, numberOfPlayers: Number});
const emits = defineEmits(['selectTeam']);
console.log(props)
</script>

<template>
  <div class="raised-card vstack gap-1" style="cursor: pointer;" @click="() => emits('selectTeam', props.teamId)">
    <span><strong>Name: </strong>{{ props.teamName }}</span>
    <span><strong>Number of players: </strong>{{ props.numberOfPlayers }}</span>
  </div>
</template>
