<script setup>
import { ref } from 'vue';
import { validateRequiredField } from '../utils/validationHelpers';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const formData = ref({
  email: '',
  password: '',
});
const errors = ref({
  email: '',
  password: '',
  credentials: '',
});

const router = useRouter();

const handleSubmitClick = () => {
  const validations = [
    validateRequiredField(formData.value.email, 'email', 'Email', errors.value, true),
    validateRequiredField(formData.value.password, 'password', 'Password', errors.value, true),
  ];
  if (!validations.every(Boolean)) return;

  signInWithEmailAndPassword(getAuth(), formData.value.email, formData.value.password)
    .then(
      () => router.push('/').then(()=>console.log(getAuth().currentUser))
    ).catch(
      () => errors.value.credentials = 'Invalid login credentials'
    );
}
</script>

<template>
  <div class="container mt-3">
    <div class="row mt3">
      <h2>Login to your account</h2>
    </div>
    <div class="row mt3">
      <form id="login" class="d-flex flex-column flex-grow-1" @submit.prevent="handleSubmitClick">

        <label for="email" class="form-label">Email<span class="required-astrsk">*</span></label>
        <input type="text"
          class="form-control"
          id="email"
          name="email"
          v-model="formData.email"
          @blur="validateRequiredField(formData.email, 'email', 'Email', errors, true)"
          @input="() => {
            validateRequiredField(formData.email, 'email', 'Email', errors, false);
            errors.credentials='';
          }"
        />
        <div class="error-text">{{ errors.email }}</div>

        <label for="password" class="form-label">Password<span class="required-astrsk">*</span></label>
        <input type="password"
          class="form-control"
          id="password"
          name="password"
          v-model="formData.password"
          @blur="validateRequiredField(formData.password, 'password', 'Password', errors, true)"
          @input="() => {
            validateRequiredField(formData.password, 'password', 'Password', errors, false);
            errors.credentials='';
          }"
        />
        <div class="error-text">{{ errors.password }}</div>

        <div class="error-text">{{ errors.credentials }}</div>

        <div class="mt-auto d-flex justify-content-center gap-3 py-4">
          <button type="submit" class="btn btn-primary rounded-pill">Login</button>
        </div>

        <p>New here? <RouterLink to="/sign-up" class="mb-4">Sign up instead!</RouterLink></p>

      </form>
    </div>
  </div>
</template>

<style scoped>
button {
  font-size: x-large;
}
</style>
