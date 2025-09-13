<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllTeams } from '@/firebase/collections/teams';

const emit = defineEmits(['select-team']);

const search = ref('');
const teams = ref([]);
const selectedTeamId = ref('');

onMounted(async () => (teams.value = await getAllTeams()));

const filteredTeams = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return [];
  return teams.value.filter(team => (team.nameLower)?.includes(term));
})

function handleSelect() {
  if (selectedTeamId.value) {
    emit('select-team', selectedTeamId.value);
    search.value = '';
  }
}
</script>

<template>
  <div class="vstack gap-3">
    <input
      v-model="search"
      type="search"
      class="form-control"
      placeholder="Search teams to join…"
      @keyup.enter="handleSelect"
    />

    <select
      v-if="filteredTeams.length"
      class="form-select"
      v-model="selectedTeamId"
      :size="Math.min(8, Math.max(1, filteredTeams.length))"
      @change="handleSelect"
    >
      <option v-for="team in filteredTeams" :key="team.id" :value="team.id">
        {{ team.name }}
      </option>
    </select>

    <div v-if="!filteredTeams.length && search">No teams found</div>
  </div>
</template>
