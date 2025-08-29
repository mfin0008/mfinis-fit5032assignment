<script setup>
const formModel = defineModel('formData');
const errorsModel = defineModel('errors');

const emits = defineEmits(['resetForm', 'submitForm']);
const handleResetClick = () => {
  emits('resetForm');
}
const handleSubmitClick = () => {
  const validations = [
    validateEmail(true),
    validatePassword(true),
    validateConfirmPassword(true),
    validateFirstName(true),
    validateLastName(true),
    validateNickname(true),
    validatePosition(),
  ];
  emits('submitForm', validations.every(Boolean));
}

const getEmptyErrorMessage = (fieldName) => {
return `Please provide a ${fieldName}`;
}

const validateEmail = (blur) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const email = formModel.value.email;

  if (!blur) {
    errorsModel.value.email = null;
    return true;
  }

  if (!email || !regex.test(email)) {
    errorsModel.value.email = getEmptyErrorMessage('valid email address');
    return false;
  }

  return true;
}

const validatePassword = (blur) => {
  const password = formModel.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!blur) {
    errorsModel.value.password = null;
    return true;
  }

  if (password.length < minLength) {
    errorsModel.value.password = `Password must be at least ${minLength} characters long.`;
    return false;
  } else if (!hasUppercase) {
    errorsModel.value.password = 'Password must contain at least one uppercase letter.';
    return false;
  } else if (!hasLowercase) {
    errorsModel.value.password = 'Password must contain at least one lowercase letter.';
    return false;
  } else if (!hasNumber) {
    errorsModel.value.password = 'Password must contain at least one number.';
    return false;
  } else if (!hasSpecialChar) {
    errorsModel.value.password = 'Password must contain at least one special character.';
    return false;
  } else {
    errorsModel.value.password = null;
    return true;
  }
}

const validateConfirmPassword = (blur) => {
  if (!blur) {
    errorsModel.value.confirmPassword = null;
    return true;
  }
  if (formModel.value.password !== formModel.value.confirmPassword) {
    errorsModel.value.confirmPassword = 'Passwords do not match.';
    return false;
  } else {
    errorsModel.value.confirmPassword = null;
    return true;
  }
}

const MAX_NAME_LENGTH = 10;
const validateFirstName = (blur) => {
  const firstName = formModel.value.firstName;
  if (!blur) {
    errorsModel.value.firstName = null;
    return true;
  }

  if (!firstName) {
    errorsModel.value.firstName = getEmptyErrorMessage('first name');
    return false;
  }
  if (firstName.length > MAX_NAME_LENGTH) {
    errorsModel.value.firstName = `First name cannot be more than ${MAX_NAME_LENGTH} characters.`;
    return false;
  }

  return true;
}

const validateLastName = (blur) => {
  const lastName = formModel.value.lastName;
  if (!blur) {
    errorsModel.value.lastName = null;
    return true;
  }

  if (!lastName) {
    errorsModel.value.lastName = getEmptyErrorMessage('last name');
    return false;
  }
  if (lastName.length > MAX_NAME_LENGTH) {
    errorsModel.value.lastName = `Last name cannot be more than ${MAX_NAME_LENGTH} characters.`;
    return false;
  }

  return true;
}

const validateNickname = (blur) => {
  const nickname = formModel.value.nickname;
  if (!blur) {
    errorsModel.value.nickname = null;
    return true;
  }

  if (nickname.length > MAX_NAME_LENGTH) {
    errorsModel.value.nickname = `Nickname cannot be more than ${MAX_NAME_LENGTH} characters.`;
    return false;
  }

  return true;
}

const validatePosition = () => {
  const position = formModel.value.position;
  if (!position) {
    errorsModel.value.position = getEmptyErrorMessage('preferred position');
    return false;
  }

  return true;
}
</script>

<template>
  <form id="signup" class="d-flex flex-column flex-grow-1" @submit.prevent="handleSubmitClick">
    <label for="email" class="form-label">Email<span class="required-astrsk">*</span></label>
    <input
      type="text"
      class="form-control"
      id="email"
      name="email"
      v-model="formModel.email"
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
      v-model="formModel.password"
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
      v-model="formModel.confirmPassword"
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
      v-model="formModel.firstName"
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
      v-model="formModel.lastName"
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
      v-model="formModel.nickname"
      @blur="validateNickname(true)"
      @input="validateNickname(false)"
    />
    <div class="error-text">{{ errors.nickname }}</div>

    <label for="position" class="form-label">Preferred position<span class="required-astrsk">*</span></label>
    <select
      class="form-select"
      id="position"
      name="position"
      v-model="formModel.position"
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
      <button type="button" class="btn btn-secondary rounded-pill" @click="handleResetClick">
        Reset
      </button>
    </div>
  </form>
</template>

<style>
label {
  font-size: large;
  margin-top: 1em;
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
.form-control:focus,
.form-select,
.form-select:focus {
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
  border: none;
  background-color: var(--color-accent);
  color: var(--color-secondary);
  --bs-btn-hover-bg: var(--color-accent);
  --bs-btn-hover-color: var(--color-neutral);
  --bs-btn-active-bg: var(--color-secondary);
  --bs-btn-active-color: var(--color-neutral);
}
.btn-secondary {
  border: none;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  --bs-btn-hover-bg: var(--color-primary);
  --bs-btn-hover-color: var(--color-neutral);
  --bs-btn-active-bg: var(--color-secondary);
  --bs-btn-active-color: var(--color-neutral);
}
</style>
