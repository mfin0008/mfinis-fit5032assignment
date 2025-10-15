<script setup>
import { addPlayerToTeam, updateJoinTeamRequest } from '@/firebase/collections/teams';
import { RequestStatus } from '../../shared/constants.js';
import { getUser } from '@/firebase/collections/users';
import { onMounted, ref } from 'vue';

const props = defineProps({
  teamId: String,
  coachId: String,
  requestId: String,
  playerId: String,
});

const emits = defineEmits(['updateRequest']);

const playerName = ref('');
onMounted(async () => {
  try {
    playerName.value = (await getUser(props.playerId)).data.fullName;
  } catch(error) {
    alert('Oops! Something went wrong...');
    console.error(error);
  }
})

const acceptRequest = async () => {
  await updateJoinTeamRequest(props.teamId, props.playerId, props.coachId, RequestStatus.ACCEPTED);
  await addPlayerToTeam(props.teamId, props.playerId);
  emits('updateRequest');
}
const rejectRequest = async () => {
  await updateJoinTeamRequest(props.teamId, props.playerId, props.coachId, RequestStatus.REJECTED);
  emits('updateRequest');
}
</script>

<template>
  <div class="raised-card py-3">
    <span>Request from: <em>{{ playerName }}</em></span>
    <button class="mt-3 btn btn-primary rounded-pill" @click="acceptRequest()">Approve</button>
    <button class="mt-3 btn btn-secondary rounded-pill" @click="rejectRequest()">Reject</button>
  </div>
</template>
