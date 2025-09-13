<script setup>
const props = defineProps({players: Array});
</script>

<template>
  <div v-if="!props.players.length">Select a team to view players for.</div>
  <div v-else>
    <span>Will display as a table in future.</span>
    <div v-for="player of props.players" :key="player.id">{{ player.data.fullName }}</div>
  </div>
</template>