<script setup>
import TeamDisplayCard from '@/components/TeamDisplayCard.vue';
import { addTeam, getPendingRequests, getPlayersForTeam, getTeamsForCoach } from '@/firebase/collections/teams';
import { validateRequiredField } from '@/utils/validationHelpers';
import { onMounted, ref } from 'vue';
import TeamRequestCard from './TeamRequestCard.vue';
import PlayerTableList from './PlayerTableList.vue';

const props = defineProps({userId: String});

const selectedTeamId = ref('');
const requests = ref([]);
const players = ref([]);

const teamNameInput = ref('');
const errors = ref({teamNameInput: ''});
const validateTeamName = (blur) => {
  validateRequiredField(teamNameInput.value, 'teamNameInput', 'Team Name', errors.value, blur);
  if (teamNameInput.value.length > 12) errors.value.teamNameInput = 'Team name must be <= 12 characters';
}

const teams = ref([]);
const refresh = async () => {
  teams.value = await getTeamsForCoach(props.userId);
  
  if (selectedTeamId.value) {
    requests.value = await getPendingRequests(selectedTeamId.value);
    players.value = await getPlayersForTeam(selectedTeamId.value);
  }
}

onMounted(() => refresh());

const addNewTeam = async () => {
  validateTeamName(true);
  if (errors.value.teamNameInput) return;

  await addTeam(teamNameInput.value, props.userId);
  await refresh();
  teamNameInput.value = '';
}

const handleSelectTeam = async (teamId) => {
  selectedTeamId.value = teamId;
  await refresh();
}
</script>

<template>
  <div class="container">
    <div class="row gx-4">
      
      <div class="col-12 col-xxl-3 my-3">
        <div class="content-box h-100">
          <h3 class="py-3">Your Teams</h3>
          <div class="raised-card py-3 mx-auto my-3" style="width: 90%">
            <input
              type="text"
              class="form-control mx-auto"
              style="width: 90%;"
              id="teamNameInput"
              name="teamNameInput"
              v-model="teamNameInput"
              placeholder="Enter your new team name..."
              @input="validateTeamName(false)"
            />
            <div class="error-text">{{ errors.teamNameInput }}</div>
            <button class="mt-3 btn btn-primary rounded-pill" @click="addNewTeam()">Create New Team</button>
          </div>

          <div v-if="teams.length === 0" class="my-3">You have no teams to display</div>
          <div v-else>
            <TeamDisplayCard
              v-for="team of teams"
              :key="team.name"
              :team-id="team.id"
              :team-name="team.name"
              @select-team="(teamId) => handleSelectTeam(teamId)"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-xxl-3 my-3">
        <div class="content-box h-100">
          <h3 class="py-3">Team Requests</h3>
          <div v-if="!selectedTeamId">Select a team to view requests for.</div>
          <div v-else-if="!requests.length">You have no new requests to view for this team.</div>
          <div v-else>
            <TeamRequestCard 
              v-for="request of requests" 
              :key="request.requestId"
              :team-id="selectedTeamId"
              :coach-id="props.userId"
              :player-id="request.playerId"
              :request-id="request.id"
              @update-request="refresh()"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-xxl-6 my-3">
        <div class="content-box h-100">
          <h3 class="py-3">Players</h3>
          <PlayerTableList :players="players"/>
        </div>
      </div>

    </div>
  </div>
</template>
