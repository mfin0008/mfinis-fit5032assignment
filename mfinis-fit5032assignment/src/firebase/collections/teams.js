import { OrderDirection, RequestStatus } from '../../../shared/constants.js';
import { hasRequiredFields } from '../utils';
import axios from 'axios';

export const PlayerSortOptions = Object.freeze({
  NAME: 'fullName',
  DEFENDING: 'defending',
  GOALKICKING: 'goalkicking',
  HANDLING: 'handling',
  KICKING: 'kicking',
  MARKING: 'marking',
  NICKNAME: 'nickname',
  PACE: 'pace',
  POSITION: 'position',
  STRENGTH: 'strength',
  TACKLING: 'tackling',
});

export async function addTeam(teamName, coachId) {
  const { hasFields, errorMsg } = hasRequiredFields({ teamName, coachId }, ['teamName', 'coachId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  await axios.post('/api/addTeam', { teamName, coachId });
}

export async function addRequestToJoinTeam(teamId, playerId) {
  const { hasFields, errorMsg } = hasRequiredFields({ playerId, teamId }, ['playerId', 'teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  await axios.post('/api/addRequestToJoinTeam', { teamId, playerId });
}

export async function updateJoinTeamRequest(teamId, playerId, coachId, newStatus) {
  const { hasFields, errorMsg } = hasRequiredFields(
    { teamId, playerId, coachId, newStatus },
    ['teamId', 'playerId', 'coachId', 'newStatus']
  );
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  if (!Object.values(RequestStatus).includes(newStatus)) throw new Error(`Unrecognised status: ${ newStatus }.`);

  await axios.patch(
    '/api/updateJoinTeamRequest',
    { teamId, playerId, coachId, newStatus }
  );
}

export async function addPlayerToTeam(teamId, playerId) {
  const { hasFields, errorMsg } = hasRequiredFields({ playerId, teamId }, ['playerId', 'teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  await axios.post('/api/addPlayerToTeam', { playerId, teamId });
}

export async function removePlayerFromTeam(teamId, playerId) {
  const { hasFields, errorMsg } = hasRequiredFields({ playerId, teamId }, ['playerId', 'teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  await axios.delete('/api/removePlayerFromTeam', { playerId, teamId });
}

export async function getPendingRequests(teamId, playerId='') {
  const { hasFields, errorMsg } = hasRequiredFields({ teamId }, ['teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const res = await axios.get(
    '/api/getPendingRequests',
    {
      params: { teamId, playerId }
    }
  );
  return res.data.data;
}

export async function getPlayersForTeam(
  teamId,
  {sortField, sortOrder}={sortField:PlayerSortOptions.NAME, sortOrder:OrderDirection.ASC}
) {
  const { hasFields, errorMsg } = hasRequiredFields({ teamId }, ['teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  if (!Object.values(PlayerSortOptions).includes(sortField)) throw new Error('Sort field not found.');
  if (!Object.values(OrderDirection).includes(sortOrder)) throw new Error('Sort order not found.');

  const res = await axios.get('/api/getPlayersForTeam', { params : { teamId } });

  const data = res.data.data;
  data.sort((a, b) => {
    const aValue = a.data[sortField];
    const bValue = b.data[sortField];
    if (!Number.isNaN(aValue) || !Number.isNaN(bValue)) {
      return a.data[sortField].toString().localeCompare(b.data[sortField].toString());
    }
    return aValue - bValue;
  });

  return sortOrder === OrderDirection.ASC ? data : data.reverse();
}

export async function getTeamsForCoach(coachId) {
  const { hasFields, errorMsg } = hasRequiredFields({ coachId }, ['coachId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const res = await axios.get('/api/getTeamsForCoach', { params: { coachId } });
  return res.data.data;
}

export async function getAllTeams() {
  const res = await axios.get('/api/getAllTeams');
  return res.data.data;
}

export async function getTeam(teamId) {
  const { hasFields, errorMsg } = hasRequiredFields({ teamId }, ['teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const res = await axios.get('/api/getTeam', { params: { id: teamId } });
  return res.data.data;
}

export async function getTeamsForPlayer(playerId) {
  const { hasFields, errorMsg } = hasRequiredFields({ playerId }, ['playerId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const res = await axios.get('/api/getTeamsForPlayer', { params: { playerId } });
  return res.data.data;
}
