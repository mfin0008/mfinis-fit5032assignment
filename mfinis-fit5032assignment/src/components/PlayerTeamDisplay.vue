<script setup>
import { computed, onMounted, ref } from 'vue';
import TeamSearchBar from './TeamSearchBar.vue';
import { addRequestToJoinTeam, getTeamsForPlayer, getPendingRequests, getTeam, getPlayersForTeam } from '@/firebase/collections/teams';
import PlayerTableList from './PlayerTableList.vue';
import TeamDisplayCard from './TeamDisplayCard.vue';

const props = defineProps({userId: String});

const selectedTeamId = ref('');
const selectedTeamName = ref('');
const isMemberOfCurrentTeam = computed(() => players.value.map(player => player.id).includes(props.userId));
const handleSelectTeam = async (teamId) => {
  selectedTeamId.value = teamId;
  selectedTeamName.value = (await getTeam(teamId))?.data?.teamName;
  await refresh();
}

const teams = ref([]);
onMounted(async () => teams.value = await getTeamsForPlayer(props.userId));

const requests = ref([]);
const hasPendingRequest = computed(() => requests.value.length);
const players = ref([]);
const handleAddRequest = async () => {
  await addRequestToJoinTeam(selectedTeamId.value, props.userId);
  await refresh();
}

const refresh = async () => {
  if (!selectedTeamId.value) return;

  requests.value = await getPendingRequests(selectedTeamId.value, props.userId);
  players.value = await getPlayersForTeam(selectedTeamId.value);
}
</script>

<template>
  <div class="container">
    <div class="row gx-4">

      <div class="col-12 col-xxl-3 my-3">
        <div class="content-box h-100">
          <h3 class="py-3">Your Teams</h3>
          <TeamSearchBar @select-team="(teamId) => handleSelectTeam(teamId)"/>
          <div v-if="teams.length === 0" class="my-3">You have no teams to display</div>
          <div v-else class="my-3">
            <TeamDisplayCard
              v-for="team of teams"
              :key="team.id"
              :team-id="team.id"
              :team-name="team.data.teamName"
              :number-of-players="team.playerCount"
              @select-team="(teamId) => handleSelectTeam(teamId)"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-xxl-3 my-3">
        <div class="content-box h-100 py-3">
          <h3 class="py-3">Manage Requests</h3>
          <div v-if="!selectedTeamId">
            Select a team to manage requests for
          </div>
          <div v-else-if="isMemberOfCurrentTeam">
            You are already a member of this team
          </div>
          <button
            v-else-if="!hasPendingRequest"
            class="btn btn-primary rounded-pill"
            @click="handleAddRequest"
          >
            Request to join <em>{{ selectedTeamName }}</em>?
          </button>
          <div v-else>
            You have requested to join <em>{{ selectedTeamName }}</em>...
          </div>
        </div>
      </div>

      <div class="col-12 col-xxl-6 my-3">
        <div class="content-box h-100">
          <h3 class="py-3">Team Players</h3>
          <PlayerTableList :players="players"/>
        </div>
      </div>

    </div>
  </div>
</template>
