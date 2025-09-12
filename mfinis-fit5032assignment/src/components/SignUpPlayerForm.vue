<script setup>
import '../assets/main.css';
import { validateEmail, validatePassword, validateConfirmPassword, validateFirstName, validateLastName, validateNickname, validatePosition } from '@/utils/validationHelpers';

const formModel = defineModel('formData');
const errorsModel = defineModel('errors');

const emits = defineEmits(['resetForm', 'submitForm']);
const handleResetClick = () => {
  emits('resetForm');
}
const handleSubmitClick = () => {
  const validations = [
    validateEmail(formModel.value.email, true, errorsModel.value),
    validatePassword(formModel.value.password, true, errorsModel.value),
    validateConfirmPassword(formModel.value.confirmPassword, formModel.value.password, true, errorsModel.value),
    validateFirstName(formModel.value.firstName, true, errorsModel.value),
    validateLastName(formModel.value.lastName, true, errorsModel.value),
    validateNickname(formModel.value.nickname, true, errorsModel.value),
    validatePosition(formModel.value.position, errorsModel.value),
  ];
  emits('submitForm', validations.every(Boolean));
}

</script>

<template>
  <form id="signup-player" class="d-flex flex-column flex-grow-1" @submit.prevent="handleSubmitClick">
    <label for="email" class="form-label">Email<span class="required-astrsk">*</span></label>
    <input
      type="text"
      class="form-control"
      id="email"
      name="email"
      v-model="formModel.email"
      @blur="validateEmail(formModel.email, true, errorsModel)"
      @input="validateEmail(formModel.email, false, errorsModel)"
    />
    <div class="error-text">{{ errorsModel.email }}</div>

    <label for="password" class="form-label">Password<span class="required-astrsk">*</span></label>
    <input
      type="password"
      class="form-control"
      id="password"
      name="password"
      v-model="formModel.password"
      @blur="validatePassword(formModel.password, true, errorsModel)"
      @input="validatePassword(formModel.password, false, errorsModel)"
    />
    <div class="error-text">{{ errorsModel.password }}</div>

    <label for="confirm-password" class="form-label">Re-enter your password<span class="required-astrsk">*</span></label>
    <input
      type="password"
      class="form-control"
      id="confirm-password"
      name="confirm-password"
      v-model="formModel.confirmPassword"
      @blur="validateConfirmPassword(formModel.confirmPassword, formModel.password, true, errorsModel)"
      @input="validateConfirmPassword(formModel.confirmPassword, formModel.password, false, errorsModel)"
    />
    <div class="error-text">{{ errorsModel.confirmPassword }}</div>

    <label for="first-name" class="form-label">First name<span class="required-astrsk">*</span></label>
    <input
      type="text"
      class="form-control"
      id="first-name"
      name="first-name"
      v-model="formModel.firstName"
      @blur="validateFirstName(formModel.firstName, true, errorsModel)"
      @input="validateFirstName(formModel.firstName, false, errorsModel)"
    />
    <div class="error-text">{{ errorsModel.firstName }}</div>

    <label for="last-name" class="form-label">Last name<span class="required-astrsk">*</span></label>
    <input
      type="text"
      class="form-control"
      id="last-name"
      name="last-name"
      v-model="formModel.lastName"
      @blur="validateLastName(formModel.lastName, true, errorsModel)"
      @input="validateLastName(formModel.lastName, false, errorsModel)"
    />
    <div class="error-text">{{ errorsModel.lastName }}</div>

    <label for="nickname" class="form-label">Nickname</label>
    <input
      type="text"
      class="form-control"
      id="nickname"
      name="nickname"
      v-model="formModel.nickname"
      @blur="validateNickname(formModel.nickname, true, errorsModel)"
      @input="validateNickname(formModel.nickname, false, errorsModel)"
    />
    <div class="error-text">{{ errorsModel.nickname }}</div>

    <label for="position" class="form-label">Preferred position<span class="required-astrsk">*</span></label>
    <select
      class="form-select"
      id="position"
      name="position"
      v-model="formModel.position"
      @change="validatePosition(formModel.position, errorsModel)"
    >
      <option value="forward">Forward</option>
      <option value="midfield">Midfielder</option>
      <option value="defender">Defender</option>
      <option value="ruckman">Ruckman</option>
    </select>
    <div class="error-text">{{ errorsModel.position }}</div>
    <div class="mt-autojustify-content-center gap-3 py-3">
      <button type="button" class="btn btn-secondary rounded-pill" @click="handleResetClick">
        Reset
      </button>
      <button type="submit" class="btn btn-primary rounded-pill">Sign Up</button>
    </div>
  </form>
</template>
