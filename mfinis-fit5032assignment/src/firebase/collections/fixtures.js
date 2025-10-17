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

export async function sendEmails() {
  try {
    await axios.post('/api/sendEmails', {
      msg: {
        to: 'matthew.finis@gmail.com',
        from: 'matthew.finis@gmail.com',
        subject: 'Test email',
        text: 'Here is some more text',
        html: '<strong> LOOK HERE </strong>'
      }
    });
    console.log('sent')
  } catch (error) {
    console.log(error, error.message);
  }
}