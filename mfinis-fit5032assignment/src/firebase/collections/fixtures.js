import { downloadCsvFile, generateCsvFile, hasRequiredFields } from '../utils';
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
  } catch (error) {
    console.log(error, error.message);
  }
}

export async function createFixtureCsvForTeam(teamId) {
  const teamName = (await axios.get('/api/getTeam', { params: { id: teamId } } )).data.data.data.teamName;
  const tempFileName = `VSFL_${teamName}_fixtures`;
  const fixtureData = (await axios.get('/api/getFixturesForTeam', { params: { teamId } })).data.data.map(row => {
    const date = new Date(Number(row.matchTime['_seconds']) * 1000);
    return [
      row.weekNumber, 
      row.homeTeam, 
      row.awayTeam, 
      `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    ];
  });

  const headers = ['Match Week', 'Home Team', 'Away Team', 'Match Time'];
  downloadCsvFile(
    tempFileName, 
    generateCsvFile(headers, fixtureData)
  );
}
