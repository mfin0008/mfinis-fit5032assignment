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

const formatFixtureDataAsCsv = async (teamId) => {
  const fixtureData = (await axios.get('/api/getFixturesForTeam', { params: { teamId } })).data.data.map(row => {
    const date = new Date(Number(row.matchTime['_seconds']) * 1000);
    return [
      row.weekNumber, 
      row.homeTeam, 
      row.awayTeam, 
      `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    ];
  });
  console.log(await axios.get('/api/getFixturesForTeam', { params: { teamId } }));

  const headers = ['Match Week', 'Home Team', 'Away Team', 'Match Time'];
  return generateCsvFile(headers, fixtureData);
}

const getCsvFileName = (teamName) => `VSFL_${teamName}_fixtures.csv`;

export async function sendTeamFixtureAsEmail(teamId) {
  const team = await axios.get('/api/getTeam', { params: { id: teamId } } );
  const playerIds = (await axios.get('/api/getPlayersForTeam', { params: { teamId } })).data.data.map(player => player.id);
  const coachId = team.data.data.data.coachId;
  const teamName = team.data.data.data.teamName;
  const subject = `Fixture for ${teamName}`;
  const text = `Greetings VSFL user! Please see attached your team (${teamName})'s fixture.`;
  const csvAttachment = await formatFixtureDataAsCsv(teamId);
  console.log(csvAttachment);
  const fileName = getCsvFileName(teamName);

  await axios.post('/api/sendEmails', {recipientUserIds: [coachId, ...playerIds], subject, text, csvAttachment, fileName});
}

export async function createFixtureCsvForTeam(teamId) {
  downloadCsvFile(
    getCsvFileName((await axios.get('/api/getTeam', { params: { id: teamId } } )).data.data.data.teamName), 
    await formatFixtureDataAsCsv(teamId),
  );
}
