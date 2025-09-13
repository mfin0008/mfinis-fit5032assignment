import { setDoc, doc, getDoc, addDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc, documentId, collectionGroup } from 'firebase/firestore';
import db from '../init';
import { hasRequiredFields, OrderDirection, splitArrayIntoBatchChunks } from '../utils';
import { userCollection } from './users';

const teamCollection = 'teams';
const playerCollection = 'players';
const joinRequestCollection = 'joinRequests';

export const RequestStatus = Object.freeze({
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REJECTED: 'rejected',
});

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
  const data = {
    name: teamName,
    coachId: coachId,
    createdAt: serverTimestamp(),
    nameLower: teamName.toLowerCase(),
  };
  const { hasFields, errorMsg } = hasRequiredFields(data, ['name', 'coachId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  await addDoc(collection(db, teamCollection), data);
}

export async function addRequestToJoinTeam(teamId, playerId) {
  const { hasFields, errorMsg } = hasRequiredFields({playerId: playerId, teamId: teamId}, ['playerId', 'teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const data = {
    playerId: playerId,
    status: RequestStatus.PENDING,
    createdAt: serverTimestamp(),
    resolvedAt: null,
  };
  const requestRef = doc(db, teamCollection, teamId, joinRequestCollection, playerId);
  await setDoc(requestRef, data);
}

export async function updateJoinTeamRequest(teamId, playerId, coachId, newStatus) {
  const requestRef = doc(db, teamCollection, teamId, joinRequestCollection, playerId);
  if (!(await getDoc(requestRef)).exists()) throw new Error(`Join team request does not exist between team ${teamId} and player ${playerId}.`);
  if (!Object.values(RequestStatus).includes(newStatus)) throw new Error(`Unrecognised status: ${newStatus}.`);
  const { hasFields, errorMsg } = hasRequiredFields({coachId: coachId}, ['coachId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  await setDoc(requestRef, {status: newStatus, resolvedAt: serverTimestamp()}, { merge: true });
}

export async function addPlayerToTeam(teamId, playerId) {
  const { hasFields, errorMsg } = hasRequiredFields({playerId: playerId, teamId: teamId}, ['playerId', 'teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const playerRef = doc(db, teamCollection, teamId, playerCollection, playerId);
  if ((await getDoc(playerRef)).exists()) {
    throw new Error(`Player ${playerId} already exists on team ${teamId}.`);
  }
  await setDoc(playerRef, {addedAt: serverTimestamp(), playerId: playerId});
}

export async function removePlayerFromTeam(teamId, playerId) {
  const { hasFields, errorMsg } = hasRequiredFields({playerId: playerId, teamId: teamId}, ['playerId', 'teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const playerRef = doc(db, teamCollection, teamId, joinRequestCollection, playerId);
  if (!(await getDoc(playerRef)).exists()) {
    throw new Error(`Player ${playerId} does not exist on team ${teamId}.`);
  }
  await deleteDoc(playerRef);
}

export async function getPendingRequests(teamId, playerId='') {
  const { hasFields, errorMsg } = hasRequiredFields({teamId: teamId}, ['teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  if (!playerId) {
    const requestsQuery = query(collection(db, teamCollection, teamId, joinRequestCollection), where('status', '==', RequestStatus.PENDING));
    return (await getDocs(requestsQuery)).docs.map(document => ({ id: document.id, ...document.data() }));
  }

  const requestSnapshot = await getDoc(doc(db, teamCollection, teamId, joinRequestCollection, playerId));

  if (!requestSnapshot.exists()) return [];
  return requestSnapshot.data().status === RequestStatus.PENDING ? [{ id: requestSnapshot.id, ...requestSnapshot.data() }] : [];
}

export async function getPlayersForTeam(teamId, {sortField, sortOrder}={sortField:PlayerSortOptions.NAME, sortOrder:OrderDirection.ASC}) {
  const { hasFields, errorMsg } = hasRequiredFields({teamId: teamId}, ['teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  if (!Object.values(PlayerSortOptions).includes(sortField)) throw new Error('Sort field not found.');
  if (!Object.values(OrderDirection).includes(sortOrder)) throw new Error('Sort order not found.');

  const playersSnapshot = await getDocs(collection(db, teamCollection, teamId, playerCollection));
  const playerIds = (playersSnapshot).docs.map(document => document.id);
  if (!playerIds.length) return [];

  const result = [];
  const chunkedPlayerIds = splitArrayIntoBatchChunks(playerIds);
  for (const idList of chunkedPlayerIds) {
    const playersQuery = query(collection(db, userCollection), where(documentId(), 'in', idList));
    result.push(...(await getDocs(playersQuery)).docs.map(document => ({ id: document.id, data: document.data() })));
  }

  result.sort((a, b) => {
    const aValue = a.data[sortField];
    const bValue = b.data[sortField];
    if (!Number.isNaN(aValue) || !Number.isNaN(bValue)) {
      return a.data[sortField].toString().localeCompare(b.data[sortField].toString());
    }
    return aValue - bValue;
  });
  return sortOrder === OrderDirection.ASC ? result : result.reverse();
}

export async function getTeamsForCoach(coachId) {
  const { hasFields, errorMsg } = hasRequiredFields({coachId: coachId}, ['coachId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const teamsQuery = query(collection(db, teamCollection), where('coachId', '==', coachId));
  return (await getDocs(teamsQuery)).docs.map(document => ({ id: document.id, ...document.data() }));
}

export async function getAllTeams() {
  const teamsSnapshot = await getDocs(collection(db, teamCollection));
  return (teamsSnapshot).docs.map(document => ({ id: document.id, ...document.data() }));
}

export async function getTeam(teamId) {
  const { hasFields, errorMsg } = hasRequiredFields({teamId: teamId}, ['teamId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const teamSnapshot = await getDoc(doc(db, teamCollection, teamId));
  if (!teamSnapshot.exists()) return;
  return { id: teamSnapshot.id, ...teamSnapshot.data() };
}

export async function getTeamsForPlayer(playerId) { 
  const { hasFields, errorMsg } = hasRequiredFields({playerId: playerId}, ['playerId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const teamsSnapshot = await getDocs(query(collectionGroup(db, playerCollection), where('playerId', '==', playerId)));
  if (teamsSnapshot.empty) return [];
  
  const result = [];
  const chunkedTeamIds = splitArrayIntoBatchChunks([...teamsSnapshot.docs.map(document => document.ref.parent.parent?.id)]);
  for (const idList of chunkedTeamIds) {
    const teamsQuery = query(collection(db, teamCollection), where(documentId(), 'in', idList));
    result.push(...(await getDocs(teamsQuery)).docs.map(document => ({ id: document.id, data: document.data() })));
  }
  return result;
}