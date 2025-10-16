<script setup>
import { addFixture } from '@/firebase/collections/fixtures';
import { validateRequiredField } from '@/utils/validationHelpers';
import { ref } from 'vue';
import DatePicker from 'primevue/datepicker';
import { InputNumber } from 'primevue';

const props = defineProps({ teams: Array });

const tomorrow = () => new Date(Date.now() + 24 * 60 * 60 * 1000);

const matchWeek = ref(1);
const homeTeamId = ref('');
const awayTeamId = ref('');
const matchTime = ref(tomorrow());

const errors = ref({
  matchWeek: '',
  homeTeamId: '',
  awayTeamId: '',
  matchTime: '',
});

const validateMatchWeek = (blur) => {
  if (!blur) {
    errors.value.matchWeek = '';
    return;
  }

  if (!matchWeek.value) {
    errors.value.matchWeek = 'Please enter a match week value';
  }

  if (matchWeek.value < 1) {
    errors.value.matchWeek = 'Match week must be a positive integer';
    return;
  }
}

const validateMatchTime = () => {
  if (!matchTime.value || matchTime.value < new Date()) {
    errors.value.matchTime = 'Match time must be a date in the future';
    return;
  }

  errors.value.matchTime = '';
}

const createFixture = async () => {
  validateMatchWeek(true);
  validateRequiredField(homeTeamId.value, 'homeTeamId', 'Home Team', errors.value, true);
  validateRequiredField(awayTeamId.value, 'awayTeamId', 'Away Team', errors.value, true);
  validateMatchTime(true);

  if (errors.value.matchWeek || errors.value.homeTeamId || errors.value.awayTeamId || errors.value.matchTime) {
    return;
  }

  try {
    await addFixture(matchWeek.value, homeTeamId.value, awayTeamId.value, matchTime.value.toISOString());
    alert('Fixture has been created successfully');
  } catch {
    alert('Oops! Something went wrong');
  }
}

const handleResetClick = () => {
  errors.value.matchWeek = '';
  errors.value.homeTeamId = '';
  errors.value.awayTeamId = '';
  errors.value.matchTime = '';

  matchWeek.value = 0;
  homeTeamId.value = '';
  awayTeamId.value = '';
  matchTime.value = tomorrow();
}
</script>

<template>
  <form id="create-fixture" class="d-flex flex-column flex-grow-1" @submit.prevent="createFixture">
    <label for="matchWeek">Match Week</label>
    <InputNumber
      :allow-empty=false
      :default-value=1
      :min=1
      class="form-control"
      id="matchWeek"
      name="matchWeek"
      v-model="matchWeek"
      @blur="validateMatchWeek(true)"
      @input="validateMatchWeek(false)"
    />
    <div class="error-text">{{ errors.matchWeek }}</div>

    <label for="homeTeamId">Home Team</label>
    <select
      id="homeTeamId"
      v-model="homeTeamId"
      class="form-select"
      @change="validateRequiredField(homeTeamId, 'homeTeamId', 'Home Team', errors, false)"
    >
      <option disabled value="">Select a home team</option>
      <option v-for="team in props.teams" v-bind:key="team.id" :value="team.id">{{ team.data.teamName }}</option>
    </select>
    <div class="error-text">{{ errors.homeTeamId }}</div>

    <label for="awayTeamId">Away Team</label>
    <select
      id="awayTeamId"
      v-model="awayTeamId"
      class="form-select"
      @change="validateRequiredField(awayTeamId, 'awayTeamId', 'Away Team', errors, false)"
    >
      <option disabled value="">Select an away team</option>
      <option v-for="team in props.teams" v-bind:key="team.id" :value="team.id">{{ team.data.teamName }}</option>
    </select>
    <div class="error-text">{{ errors.awayTeamId }}</div>

    <label for="matchTime">Match Time</label>
    <DatePicker
      id="matchTime"
      v-model="matchTime"
      show-time
      hour-format="12"
      date-format="dd-mm-yy ||"
      fluid
      @value-change="validateMatchTime"
      class="form-control"
    />
    <div class="error-text">{{ errors.matchTime }}</div>

    <div class="mt-autojustify-content-center gap-3 py-3">
      <button type="button" class="btn btn-secondary rounded-pill" @click="handleResetClick">Reset</button>
      <button type="submit" class="btn btn-primary rounded-pill">Create</button>
    </div>
  </form>
</template>
