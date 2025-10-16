import { hasRequiredFields } from '../utils';
import axios from 'axios';

// expecting matchtime to be an ISO string
export async function addFixture(weekNumber, homeTeamId, awayTeamId, matchTime) {
  const { hasFields, errorMsg } = hasRequiredFields(
    { weekNumber, homeTeamId, awayTeamId, matchTime },
    ['weekNumber', 'homeTeamId', 'awayTeamId', 'matchTime']
  );
  if (!hasFields) throw new Error(errorMsg);

  await axios.post('/api/addFixture', {
    weekNumber,
    homeTeamId,
    awayTeamId,
    matchTime
  });
}
