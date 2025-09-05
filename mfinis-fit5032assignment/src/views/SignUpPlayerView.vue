<script setup>
import '@material/web/all.js';
import '@material/web/slider/slider.js';
import '../assets/main.css';
import { ref } from 'vue';
import PlayerCard from '@/components/PlayerCard.vue';
import SignUpPlayerForm from '@/components/SignUpPlayerForm.vue';
import PlayerStatSliderForm from '@/components/PlayerStatSliderForm.vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

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

const router = useRouter();

const submitForm = (success) => {
  if (success) {
    createUserWithEmailAndPassword(getAuth(), formData.value.email, formData.value.password)
      .then(
        () => router.push('/')
      ).catch(
        err => console.error(err.code) // todo handle for duplicate email error
      )
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
  isAtStatTotal.value = false;
}
</script>

<template>
  <div class="container">
    <div class="row pt-3">
      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-4 mb-3 content-box">
        <div class="flex-column d-flex h-100 w-100">
          <h2 class="mt-3">Create your account</h2>
          <SignUpPlayerForm
            @resetForm="resetForm"
            @submitForm="(success) => submitForm(success)"
            v-model:form-data="formData"
            v-model:errors="errors"
          />
        </div>
      </div>

      <div class="col-1 col-xxl-1"></div>

      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-2 content-box mb-3">
        <PlayerStatSliderForm
          :max-stat-total="MAX_STAT_TOTAL"
          v-model:player-stats="playerStats"
          v-model:is-at-stat-total="isAtStatTotal"
        />
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
