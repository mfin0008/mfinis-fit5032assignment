import { setDoc, doc, getDoc } from 'firebase/firestore';
import db from '../init';
import { hasRequiredFields } from '../utils';

export const userCollection = 'users';

export const Roles = Object.freeze({
  PLAYER: 'player',
  COACH: 'coach',
  ADMIN: 'admin',
})

export async function addCoachUser(userId, data) {
  await setUser(userId, data, ['email', 'firstName', 'lastName'], Roles.COACH);
}

export async function addPlayerUser(userId, data) {
  await setUser(
    userId, 
    data, 
    ['email', 'firstName', 'lastName', 'position', 'kicking', 'handling', 'goalKicking', 'marking', 'pace', 'defending', 'strength', 'tackling'],
    Roles.PLAYER,
  );
}

async function setUser(userId, data, requiredFields, role) {
  const { hasFields, errorMsg } = hasRequiredFields(data, requiredFields);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  data.role = role;
  data.fullName = `${data.firstName} ${data.lastName}`;
  await setDoc(doc(db, userCollection, userId), data);
}

export async function isRole(userId, role) {
  const userData = (await getDoc(doc(db, userCollection, userId))).data();
  return role === userData?.role;
}

export async function getUser(userId) {
  if (!userId) {
    return null;
  }
  return (await getDoc(doc(db, userCollection, userId))).data();
}
