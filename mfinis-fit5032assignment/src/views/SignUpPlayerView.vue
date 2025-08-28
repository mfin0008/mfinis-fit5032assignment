<script setup>
import '@material/web/all.js';
import '@material/web/slider/slider.js';
import '../assets/main.css';
import { ref } from 'vue';
import PlayerCard from '@/components/PlayerCard.vue';

const MAX_STAT_TOTAL = 600;
const isAtStatTotal = ref(false);
const INITIAL_STAT_VALUE = 50;

const playerStats = ref({
  kicking: INITIAL_STAT_VALUE,
  handling: INITIAL_STAT_VALUE,
  goalKicking: INITIAL_STAT_VALUE,
  marking: INITIAL_STAT_VALUE,
  pace: INITIAL_STAT_VALUE,
  defending: INITIAL_STAT_VALUE,
  strength: INITIAL_STAT_VALUE,
  tackling: INITIAL_STAT_VALUE,
});

const formData = ref({
  email: '',
  password: '',
  passwordConfirmation: '',
  firstName: '',
  lastName: '',
  nickname: '',
  position: '',
});

const errors = ref({
  email: '',
  password: '',
  passwordConfirmation: '',
  firstName: '',
  lastName: '',
  nickname: '',
  position: '',
});

const onSliderInput = (event) => {
  const newValue = Number(event.target.value);
  const amountOverTotalPermittedStats = getAmountOverTotalPermittedStats(event.target.id, newValue);
  if (amountOverTotalPermittedStats <= 0) {
    playerStats.value[event.target.id] = newValue;
  } else {
    playerStats.value[event.target.id] = newValue - amountOverTotalPermittedStats;
  }
}

const getAmountOverTotalPermittedStats = (statName, newValue) => {
  let newPlayerStats = { ...playerStats.value };
  newPlayerStats[statName] = newValue;
  const newStatTotal = Object.values(newPlayerStats).reduce((sum, value) => sum + value, 0);

  isAtStatTotal.value = newStatTotal >= MAX_STAT_TOTAL;
  return newStatTotal - MAX_STAT_TOTAL;
}

const resetSlider = (event) => {
  const statName = event.target.id;
  event.target.value = playerStats.value[statName];
}

const submitForm = () => {
  const validations = [
    validateEmail(true),
    validatePassword(true),
    validateConfirmPassword(true),
    validateFirstName(true),
    validateLastName(true),
    validateNickname(true),
    validatePosition(),
  ];
  if (validations.every(Boolean)) {
    alert('success');
  }
}

const resetForm = () => {
  formData.value.email = '';
  formData.value.password = '';
  formData.value.confirmPassword = '';
  formData.value.firstName = '';
  formData.value.lastName = '';
  formData.value.nickname = '';
  formData.value.position = '';

  errors.value.email = '';
  errors.value.password = '';
  errors.value.confirmPassword = '';
  errors.value.firstName = '';
  errors.value.lastName = '';
  errors.value.nickname = '';
  errors.value.position = '';

  playerStats.value.kicking = INITIAL_STAT_VALUE;
  playerStats.value.handling = INITIAL_STAT_VALUE;
  playerStats.value.goalKicking = INITIAL_STAT_VALUE;
  playerStats.value.marking = INITIAL_STAT_VALUE;
  playerStats.value.pace = INITIAL_STAT_VALUE;
  playerStats.value.defending = INITIAL_STAT_VALUE;
  playerStats.value.strength = INITIAL_STAT_VALUE;
  playerStats.value.tackling = INITIAL_STAT_VALUE;
}

const getEmptyErrorMessage = (fieldName) => {
  return `Please provide a ${fieldName}`;
}

const validateEmail = (blur) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email = formData.value.email;

  if (!blur) {
    errors.value.email = null;
    return true;
  }

  if (!email || !regex.test(email)) {
    errors.value.email = getEmptyErrorMessage('valid email address');
    return false;
  }

  return true;
}

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!blur) {
    errors.value.password = null;
    return true;
  }

  if (password.length < minLength) {
    errors.value.password = `Password must be at least ${minLength} characters long.`;
    return false;
  } else if (!hasUppercase) {
    errors.value.password = 'Password must contain at least one uppercase letter.';
    return false;
  } else if (!hasLowercase) {
    errors.value.password = 'Password must contain at least one lowercase letter.';
    return false;
  } else if (!hasNumber) {
    errors.value.password = 'Password must contain at least one number.';
    return false;
  } else if (!hasSpecialChar) {
    errors.value.password = 'Password must contain at least one special character.';
    return false;
  } else {
    errors.value.password = null;
    return true;
  }
}

const validateConfirmPassword = (blur) => {
  if (!blur) {
    errors.value.confirmPassword = null;
    return true;
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.';
    return false;
  } else {
    errors.value.confirmPassword = null;
    return true;
  }
}

const MAX_NAME_LENGTH = 10;
const validateFirstName = (blur) => {
  const firstName = formData.value.firstName;
  if (!blur) {
    errors.value.firstName = null;
    return true;
  }

  if (!firstName) {
    errors.value.firstName = getEmptyErrorMessage('first name');
    return false;
  }
  if (firstName.length > MAX_NAME_LENGTH) {
    errors.value.firstName = `First name cannot be more than ${MAX_NAME_LENGTH} characters.`;
    return false;
  }

  return true;
}

const validateLastName = (blur) => {
  const lastName = formData.value.lastName;
  if (!blur) {
    errors.value.lastName = null;
    return true;
  }

  if (!lastName) {
    errors.value.lastName = getEmptyErrorMessage('last name');
    return false;
  }
  if (lastName.length > MAX_NAME_LENGTH) {
    errors.value.lastName = `Last name cannot be more than ${MAX_NAME_LENGTH} characters.`;
    return false;
  }

  return true;
}

const validateNickname = (blur) => {
  const nickname = formData.value.nickname;
  if (!blur) {
    errors.value.nickname = null;
    return true;
  }

  if (nickname.length > MAX_NAME_LENGTH) {
    errors.value.nickname = `Nickname cannot be more than ${MAX_NAME_LENGTH} characters.`;
    return false;
  }

  return true;
}

const validatePosition = () => {
  const position = formData.value.position;
  if (!position) {
    errors.value.position = getEmptyErrorMessage('preferred position');
    return false;
  }

  return true;
}
</script>

<template>
  <div class="container">
    <div class="row pt-3">
      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-4 mb-3 content-box">
        <div class="flex-column d-flex h-100 w-100">
          <h2 class="mt-3">Create your account</h2>
          <form id="signup" class="d-flex flex-column flex-grow-1" @submit.prevent="submitForm">
            <label for="email" class="form-label">Email<span class="required-astrsk">*</span></label>
            <input
              type="text"
              class="form-control"
              id="email"
              name="email"
              v-model="formData.email"
              @blur="validateEmail(true)"
              @input="validateEmail(false)"
            />
            <div class="error-text">{{ errors.email }}</div>

            <label for="password" class="form-label">Password<span class="required-astrsk">*</span></label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              v-model="formData.password"
              @blur="validatePassword(true)"
              @input="validatePassword(false)"
            />
            <div class="error-text">{{ errors.password }}</div>

            <label for="confirm-password" class="form-label">Re-enter your password<span class="required-astrsk">*</span></label>
            <input
              type="password"
              class="form-control"
              id="confirm-password"
              name="confirm-password"
              v-model="formData.confirmPassword"
              @blur="validateConfirmPassword(true)"
              @input="validateConfirmPassword(false)"
            />
            <div class="error-text">{{ errors.confirmPassword }}</div>

            <label for="first-name" class="form-label">First name<span class="required-astrsk">*</span></label>
            <input
              type="text"
              class="form-control"
              id="first-name"
              name="first-name"
              v-model="formData.firstName"
              @blur="validateFirstName(true)"
              @input="validateFirstName(false)"
            />
            <div class="error-text">{{ errors.firstName }}</div>

            <label for="last-name" class="form-label">Last name<span class="required-astrsk">*</span></label>
            <input
              type="text"
              class="form-control"
              id="last-name"
              name="last-name"
              v-model="formData.lastName"
              @blur="validateLastName(true)"
              @input="validateLastName(false)"
            />
            <div class="error-text">{{ errors.lastName }}</div>

            <label for="nickname" class="form-label">Nickname</label>
            <input
              type="text"
              class="form-control"
              id="nickname"
              name="nickname"
              v-model="formData.nickname"
              @blur="validateNickname(true)"
              @input="validateNickname(false)"
            />
            <div class="error-text">{{ errors.nickname }}</div>

            <label for="position" class="form-label">Preferred position<span class="required-astrsk">*</span></label>
            <select
              class="form-select"
              id="position"
              name="position"
              v-model="formData.position"
              @change="validatePosition"
            >
              <option value="forward">Forward</option>
              <option value="midfield">Midfielder</option>
              <option value="defender">Defender</option>
              <option value="ruckman">Ruckman</option>
            </select>
            <div class="error-text">{{ errors.position }}</div>
            <div class="mt-auto d-flex justify-content-center gap-3 py-3">
              <button type="submit" class="btn btn-primary rounded-pill">Sign Up</button>
              <button type="button" class="btn btn-secondary rounded-pill" @click="resetForm">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-1 col-xxl-1"></div>

      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-2 content-box mb-3">
        <div class="slider-pair" v-for="stat in Object.keys(playerStats)" :key="stat">
          {{ String(stat).toUpperCase() }}
          <md-slider
            :id="stat"
            :value="playerStats[stat]"
            :class="{ 'at-stat-total': isAtStatTotal }"
            @input="onSliderInput"
            @change="resetSlider"
          >
          </md-slider>
        </div>
      </div>
      <div class="col-1 d-xxl-none"></div>

      <div class="col-1 col-xxl-1"></div>

      <div class="col-10 col-xxl-4 content-box mb-3">
        <h2 class="mt-3">Your player card!</h2>
        <PlayerCard
          :stats="playerStats"
          :firstName="formData.firstName"
          :nickname="formData.nickname"
          :lastName="formData.lastName"
          :position="formData.position"
        />
        <div v-if="isAtStatTotal" class="error-text mb-3">
          Total stat limit reached ({{ MAX_STAT_TOTAL }}).
        </div>
      </div>
      <div class="col-1 d-xxl-none"></div>
    </div>
  </div>
</template>

<style scoped>
md-slider {
  --md-slider-active-track-color: var(--color-neutral);
  --md-slider-inactive-track-color: var(--color-secondary);
  display: block;
  margin-inline: auto;
  width: 60%;
}

md-slider.at-stat-total {
  --md-slider-inactive-track-color: var(--color-primary);
}

.content-box {
  background-color: var(--color-raised);
  color: var(--color-neutral);
  font-size: x-large;
  text-align: center;
  align-items: center;
}

label {
  font-size: large;
  margin-top: 1em;
}

.slider-pair {
  margin-top: 2.5rem;
  margin-bottom: 2.25rem;
}

#signup{
  text-align: left;
}
.error-text, .required-astrsk {
  color: var(--color-primary);
}
#signup .error-text {
  font-size: medium;
  text-align: center;
}

.form-control,
.form-select {
  background-color: var(--color-secondary);
  color: var(--color-neutral);
  border-color: var(--color-neutral);
}

button {
  border: none;
  margin: 0 1em;
  font-size: large;
  color: var(--color-secondary);
  --bs-btn-active-bg: var(--color-secondary);
  --bs-btn-active-color: var(--color-neutral);
}
.btn-primary {
  background-color: var(--color-accent);
}
.btn-secondary {
  background-color: var(--color-primary);
}
</style>
