<script setup>
import { ref } from 'vue';
import '../assets/main.css';
import { validateEmail, validatePassword, validateConfirmPassword, validateFirstName, validateLastName } from '@/utils/validationHelpers';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
});
const errors = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
});

const handleResetClick = () => {
  formData.value.email = '';
  formData.value.password = '';
  formData.value.confirmPassword = '';
  formData.value.firstName = '';
  formData.value.lastName = '';

  errors.value.email = '';
  errors.value.password = '';
  errors.value.confirmPassword = '';
  errors.value.firstName = '';
  errors.value.lastName = '';
}

const router = useRouter();

const handleSubmitClick = () => {
  const validations = [
    validateEmail(formData.value.email, true, errors.value),
    validatePassword(formData.value.password, true, errors.value),
    validateConfirmPassword(formData.value.confirmPassword, formData.value.password, true, errors.value),
    validateFirstName(formData.value.firstName, true, errors.value),
    validateLastName(formData.value.lastName, true, errors.value),
  ];
  if (validations.every(Boolean)) {
    createUserWithEmailAndPassword(getAuth(), formData.value.email, formData.value.password)
      .then(
        () => router.push('/')
      ).catch(
        err => console.error(err.code) // todo handle for duplicate email error
      )
  }
}
</script>

<template>
  <form id="signup-coach" class="d-flex flex-column flex-grow-1" @submit.prevent="handleSubmitClick">
    <label for="email" class="form-label">Email<span class="required-astrsk">*</span></label>
    <input
      type="text"
      class="form-control"
      id="email"
      name="email"
      v-model="formData.email"
      @blur="validateEmail(formData.email, true, errors)"
      @input="validateEmail(formData.email, false, errors)"
    />
    <div class="error-text">{{ errors.email }}</div>

    <label for="password" class="form-label">Password<span class="required-astrsk">*</span></label>
    <input
      type="password"
      class="form-control"
      id="password"
      name="password"
      v-model="formData.password"
      @blur="validatePassword(formData.password, true, errors)"
      @input="validatePassword(formData.password, false, errors)"
    />
    <div class="error-text">{{ errors.password }}</div>

    <label for="confirm-password" class="form-label">Re-enter your password<span class="required-astrsk">*</span></label>
    <input
      type="password"
      class="form-control"
      id="confirm-password"
      name="confirm-password"
      v-model="formData.confirmPassword"
      @blur="validateConfirmPassword(formData.confirmPassword, formData.password, true, errors)"
      @input="validateConfirmPassword(formData.confirmPassword, formData.password, false, errors)"
    />
    <div class="error-text">{{ errors.confirmPassword }}</div>

    <label for="first-name" class="form-label">First name<span class="required-astrsk">*</span></label>
    <input
      type="text"
      class="form-control"
      id="first-name"
      name="first-name"
      v-model="formData.firstName"
      @blur="validateFirstName(formData.firstName, true, errors)"
      @input="validateFirstName(formData.firstName, false, errors)"
    />
    <div class="error-text">{{ errors.firstName }}</div>

    <label for="last-name" class="form-label">Last name<span class="required-astrsk">*</span></label>
    <input
      type="text"
      class="form-control"
      id="last-name"
      name="last-name"
      v-model="formData.lastName"
      @blur="validateLastName(formData.lastName, true, errors)"
      @input="validateLastName(formData.lastName, false, errors)"
    />
    <div class="error-text">{{ errors.lastName }}</div>
    <div class="mt-auto d-flex justify-content-center gap-3 py-3">
      <button type="submit" class="btn btn-primary rounded-pill">Sign Up</button>
      <button type="button" class="btn btn-secondary rounded-pill" @click="handleResetClick">
        Reset
      </button>
    </div>
  </form>
</template>
