import { hasRequiredFields } from '../utils';
import axios from 'axios';

import { Roles } from '../../../shared/constants.js';

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
  const { hasFields, errorMsg } = hasRequiredFields({...data, userId, role}, [...requiredFields, 'userId', 'role']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  if (!Object.values(Roles).includes(role)) {
    throw new Error(`Role ${role} not recognised as a valid role.`);
  }

  data.role = role;

  await axios.post('/api/setUser', {
    userId,
    role,
    userData: data
  });
}

export async function isRole(userId, role) {
  const { hasFields, errorMsg } = hasRequiredFields({userId, role}, ['userId', 'role']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  if (!Object.values(Roles).includes(role)) {
    throw new Error(`Role ${role} not recognised as a valid role.`);
  }

  const res = await axios.get('/api/userIsRole', {
    params: {
      userId: userId ? userId : null,
      role: role ? role : null,
    }
  });

  return res.data.data;
}

export async function getUser(userId) {
  const { hasFields, errorMsg } = hasRequiredFields({userId}, ['userId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const res = await axios.get('/api/getUser', {
    params: { id: userId }
  });

  return res.data.data;
}
