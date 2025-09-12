import { setDoc, doc, getDoc } from 'firebase/firestore';
import db from '../init';

const userColumn = 'users';
const roleColumn = 'roles';

export const Roles = Object.freeze({
  PLAYER: 'player',
  COACH: 'coach',
  ADMIN: 'admin',
})

export async function setUser(userId, data, rolesArray) {
  const userDoc = await setDoc(doc(db, userColumn, userId), data);
  await setRole(userId, rolesArray);

  return userDoc;
}

async function setRole(userId, rolesArray) {
  await setDoc(doc(db, roleColumn, userId), {roles: rolesArray});
}

export async function isRole(userId, role) {
  const roles = (await getDoc(doc(db, roleColumn, userId))).data().roles;
  return role in roles;
}

export async function getUserDoc(userId) {
  if (!userId) {
    return null;
  }
  return (await getDoc(doc(db, userColumn, userId))).data();
}
