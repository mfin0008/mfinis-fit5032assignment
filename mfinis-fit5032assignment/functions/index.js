import { setGlobalOptions } from 'firebase-functions/v2';
setGlobalOptions({ region: 'australia-southeast1', maxInstances: 10 });

import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';
import admin from 'firebase-admin';
import { FieldPath } from 'firebase-admin/firestore';

import { OrderDirection, ReviewsOrderByColumns, Roles, RequestStatus } from './shared/constants.js';
import { splitArrayIntoBatchChunks } from './utils.js';

const userCollection = 'users';
const venueCollection = 'venues';
const reviewCollection = 'reviews';
const teamCollection = 'teams';
const joinRequestCollection = 'joinRequests';
const playerCollection = 'players';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({ origin: true });

const isValidEnumValue = (value, enumRef) => Object.values(enumRef).includes(value);

const getGenericSnapshot = async (collectionName, id) => await db.collection(collectionName).doc(id).get();
const getGenericBatchSnapshot = async (collectionName) => await db.collection(collectionName).get();
const listDocuments = (snapshot) => snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

const ok = (res, data) => res.status(200).json({ data });
const badInput = (res) => res.status(400).json({ error: { code: 400, message: 'Invalid request inputs' } });
const notFound = (res) => res.status(404).json({ error: { code: 404, message: 'Not found' } });

const makeHttpRequest = (methodType, handlerFunction) => onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== methodType) return res.status(405).json({ error: { code: 405, message: 'Method is not allowed' } });
      await handlerFunction(req, res);
    } catch (error) {
      return res.status(500).json({ error: { code: 500, message: error?.message ?? 'Unknown server error' } });
    }
  })
});

const genericGetRequestHandler = (collectionName) => makeHttpRequest(
  'GET',
  async (req, res) => {
    const id = req.query.id;
    if (!id) return badInput(res);
    const snapshot = await getGenericSnapshot(collectionName, id);
    if (!snapshot.exists) return notFound(res);

    return ok(res, { id: snapshot.id, data: snapshot.data() });
  }
);

const genericGetBatchRequestHandler = (collectionName) => makeHttpRequest(
  'GET',
  async (req, res) => {
    const snapshot = await getGenericBatchSnapshot(collectionName);
    return ok(res, listDocuments(snapshot));
  }
);

const addPlayerCountToTeamDocuments = async (teamDocs) =>
  Promise.all(teamDocs.map(async doc => {
    const playerCount = (await doc.ref.collection(playerCollection).count().get()).data().count;
    return { id: doc.id, data: doc.data(), playerCount };
  }));

// ---------------------------------------------------------------------------------------------------

export const getUser = genericGetRequestHandler(userCollection);

// ---------------------------------------------------------------------------------------------------

export const userIsRole = makeHttpRequest(
  'GET',
  async (req, res) => {
    const userId = req.query.userId;
    const role = req.query.role;
    if (!userId || !role || !isValidEnumValue(role, Roles)) return badInput(res);
    const userSnapshot = await getGenericSnapshot(userCollection, userId);
    if (!userSnapshot.exists) return notFound(res);

    return ok(res, role === userSnapshot?.get('role'));
  }
);

// ---------------------------------------------------------------------------------------------------

export const setUser = makeHttpRequest(
  'POST',
  async (req, res) => {
    const { role, userId, userData }  = req.body;
    if (
      !userId ||
      !role ||
      !isValidEnumValue(role, Roles) ||
      !userData?.firstName ||
      !userData?.lastName
    )
      return badInput(res);

    userData.role = role;
    userData.fullName = `${userData?.firstName} ${userData?.lastName}`;
    await db.collection(userCollection).doc(userId).set(userData, { merge: true });
    return ok(res, { id: userId });
  }
);

// ---------------------------------------------------------------------------------------------------

// NOT YET IMPLEMENTED IN CODE
export const createVenue = makeHttpRequest(
  'POST',
  async (req, res) => {
    const { name, location } = req.body;
    if (!name || !location ) return badInput(res);

    const id = (await db.collection(venueCollection).add({ name, location })).id;
    return ok(res, { id });
  }
);

// ---------------------------------------------------------------------------------------------------

// NOT YET IMPLEMENTED IN CODE
export const getVenue = genericGetRequestHandler(venueCollection);

// ---------------------------------------------------------------------------------------------------

export const getAllVenues = genericGetBatchRequestHandler(venueCollection);

// ---------------------------------------------------------------------------------------------------

export const getVenueReviews = makeHttpRequest(
  'GET',
  async (req, res) => {
    const venueId = req.query.venueId;
    const orderByColumn = req.query.orderByColumn;
    const orderDirection = req.query.orderDirection;
    if (
      !venueId ||
      !orderByColumn ||
      !isValidEnumValue(orderByColumn, ReviewsOrderByColumns) ||
      !orderDirection ||
      !isValidEnumValue(orderDirection, OrderDirection)
    )
      return badInput(res);
    const venueSnapshot = await getGenericSnapshot(venueCollection, venueId);
    if (!venueSnapshot.exists) return notFound(res);

    const reviewsQuery = venueSnapshot.ref.collection(reviewCollection)
      .orderBy(orderByColumn, orderDirection);
    const reviewsSnapshot = await reviewsQuery.get();
    return ok(res, listDocuments(reviewsSnapshot));
  }
);

// ---------------------------------------------------------------------------------------------------

export const addReview = makeHttpRequest(
  'POST',
  async (req, res) => {
    const { venueId, rating, content } = req.body;
    if (!venueId || !rating || !content) return badInput(res);

    const venueSnapshot = await getGenericSnapshot(venueCollection, venueId);
    if (!venueSnapshot.exists) return notFound(res);

    const id = (await venueSnapshot.ref.collection(reviewCollection).add({ rating, content })).id;
    return ok(res, { id });
  }
);

// ---------------------------------------------------------------------------------------------------

export const addTeam = makeHttpRequest(
  'POST',
  async (req, res) => {
    const { teamName, coachId } = req.body;
      if (!teamName || !coachId) return badInput(res);

      if (!(await getGenericSnapshot(userCollection, coachId)).exists) return notFound(res);

      const id = (
        await db.collection(teamCollection).add({ teamName, coachId, nameLower: teamName.toLowerCase() })
      ).id;
      return ok(res, { id });
  }
);

// ---------------------------------------------------------------------------------------------------

export const addRequestToJoinTeam = makeHttpRequest(
  'POST',
  async (req, res) => {
    const { teamId, playerId } = req.body;
    if (!teamId || !playerId) return badInput(res);

    const teamSnapshot = await getGenericSnapshot(teamCollection, teamId);
    if (!teamSnapshot.exists || !(await getGenericSnapshot(userCollection, playerId)).exists)
      return notFound(res);

    const requestRef = teamSnapshot.ref.collection(joinRequestCollection).doc(playerId);
    if (await requestRef.get().exists) {
      return res.status(400).json({
        error: { code: 400, message: 'Request to join team already exists' }
      });
    }
    await requestRef.set(
      {
        playerId,
        status: RequestStatus.PENDING,
        resolvedAt: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    return ok(res, { id: playerId });
  }
);

// ---------------------------------------------------------------------------------------------------

export const updateJoinTeamRequest = makeHttpRequest(
  'PATCH',
  async (req, res) => {
    const { teamId, playerId, coachId, newStatus } = req.body;
    if (
      !teamId ||
      !playerId ||
      !coachId ||
      !newStatus ||
      !isValidEnumValue(newStatus, RequestStatus)
    )
      return badInput(res);

    const teamSnapshot = await getGenericSnapshot(teamCollection, teamId);
    if (
      !(await getGenericSnapshot(userCollection, playerId)).exists ||
      !(await getGenericSnapshot(userCollection, coachId)).exists ||
      !teamSnapshot.exists
    )
      return notFound(res);

    const joinRequestRef = teamSnapshot.ref.collection(joinRequestCollection).doc(playerId);
    await joinRequestRef.set(
      { status: newStatus, resolvedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
    return ok(res, { id: joinRequestRef.id });
  }
);

// ---------------------------------------------------------------------------------------------------

export const addPlayerToTeam = makeHttpRequest(
  'POST',
  async (req, res) => {
    const { playerId, teamId } = req.body;
    if (!playerId || !teamId) return badInput(res);

    const teamSnapshot = await getGenericSnapshot(teamCollection, teamId);
    if (!teamSnapshot.exists || !(await getGenericSnapshot(userCollection, playerId)).exists)
      return notFound(res);

    await teamSnapshot.ref.collection(playerCollection).doc(playerId).create(
      { playerId, addedAt: admin.firestore.FieldValue.serverTimestamp() }
    );

    return ok(res, { id: playerId });
  }
);

// ---------------------------------------------------------------------------------------------------

export const removePlayerFromTeam = makeHttpRequest(
  'DELETE',
  async (req, res) => {
    const { playerId, teamId } = req.body;
    if (!playerId || !teamId) return badInput(res);

    const teamSnapshot = await getGenericSnapshot(teamCollection, teamId);
    if (!teamSnapshot.exists || !(await getGenericSnapshot(userCollection, playerId)).exists)
      return notFound(res);

    await teamSnapshot.ref.collection(playerCollection).doc(playerId).delete();
    return ok(res, { id: playerId });
  }
);

// ---------------------------------------------------------------------------------------------------

export const getPendingRequests = makeHttpRequest(
  'GET',
  async (req, res) => {
    const teamId = req.query.teamId;
    const playerId = req.query.playerId ?? '';
    if (!teamId) return badInput(res);

    const teamSnapshot = await getGenericSnapshot(teamCollection, teamId);
    if (!teamSnapshot.exists) return notFound(res);

    if (!playerId) {
      const requestsQuery = await teamSnapshot.ref.collection(joinRequestCollection)
        .where('status', '==', RequestStatus.PENDING)
        .get();
      return ok(res, listDocuments(requestsQuery));
    }

    const requestSnapshot = await teamSnapshot.ref.collection(joinRequestCollection)
      .doc(playerId)
      .get();
    if (!requestSnapshot.exists) return ok(res, []);
    const requestData = requestSnapshot.data();
    if (requestData?.status !== RequestStatus.PENDING) return ok(res, []);

    return ok(res, [{id: requestSnapshot.id, data: requestData}]);
  }
);

// ---------------------------------------------------------------------------------------------------

export const getPlayersForTeam = makeHttpRequest(
  'GET',
  async (req, res) => {
    const teamId = req.query.teamId;
    if (!teamId) return badInput(res);

    const teamSnapshot = await getGenericSnapshot(teamCollection, teamId);
    if (!teamSnapshot.exists) return notFound(res);

    const playerSnapshot = await teamSnapshot.ref.collection(playerCollection).get();
    if (!playerSnapshot.docs.length) return ok(res, []);

    const playerIds = playerSnapshot.docs.map(doc => doc.id);
    // Firestore limits 'in' queries to batches of 10 elements, so have to get players in chunks
    const chunkedPlayerIds = splitArrayIntoBatchChunks(playerIds);
    const result = [];
    for (const idList of chunkedPlayerIds) {
      const playersQuery = await db.collection(userCollection)
        .where(FieldPath.documentId(), 'in', idList)
        .get();

      result.push(...listDocuments(playersQuery));
    }

    return ok(res, result);
  }
);

// ---------------------------------------------------------------------------------------------------

export const getAllTeams = genericGetBatchRequestHandler(teamCollection);

// ---------------------------------------------------------------------------------------------------

export const getTeam = genericGetRequestHandler(teamCollection);

// ---------------------------------------------------------------------------------------------------

export const getTeamsForCoach = makeHttpRequest(
  'GET',
  async (req, res) => {
    const coachId = req.query.coachId;
    if (!coachId) return badInput(res);

    const teamsQuery = await db.collection(teamCollection)
      .where('coachId', '==', coachId)
      .get();

    const teamsWithPlayerCounts = await addPlayerCountToTeamDocuments(teamsQuery.docs);

    return ok(res, teamsWithPlayerCounts);
  }
);

// ---------------------------------------------------------------------------------------------------

export const getTeamsForPlayer = makeHttpRequest(
  'GET',
  async (req, res) => {
    const playerId = req.query.playerId;
    if (!playerId) return badInput(res);

    const playersSnapshot = await db.collectionGroup(playerCollection)
      .where('playerId', '==', playerId)
      .get();
    if (playersSnapshot.empty) return ok(res, []);

    const teamIds = playersSnapshot.docs
      .map(doc => doc.ref.parent.parent?.id);

    const chunkedTeamIds = splitArrayIntoBatchChunks(teamIds);
    const teamDocs = [];
    for (const teamIds of chunkedTeamIds) {
      const teamsQuery = await db.collection(teamCollection)
        .where(FieldPath.documentId(), 'in', teamIds)
        .get();

      teamDocs.push(...teamsQuery.docs);
    }

    const teamsWithPlayerCounts = await addPlayerCountToTeamDocuments(teamDocs);
    return ok(res, teamsWithPlayerCounts);
  }
);

// ---------------------------------------------------------------------------------------------------
