<script setup>
import '@material/web/all.js';
import '@material/web/slider/slider.js';
import { ref } from 'vue';
import PlayerCard from '@/components/PlayerCard.vue';
import SignUpPlayerForm from '@/components/SignUpPlayerForm.vue';
import PlayerStatSliderForm from '@/components/PlayerStatSliderForm.vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { addPlayerUser } from '@/firebase/collections/users';

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
  confirmPassword: '',
  firstName: '',
  lastName: '',
  nickname: '',
  position: '',
});

const errors = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  nickname: '',
  position: '',
});

const router = useRouter();

const submitForm = async (success) => {
  if (!success) {
    return;
  }
  try {
    const userId = (await createUserWithEmailAndPassword(getAuth(), formData.value.email, formData.value.password)).user.uid;
    addPlayerUser(
      userId,
      {
        email: formData.value.email,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        nickname: formData.value.nickname,
        position: formData.value.position,
        kicking: playerStats.value.kicking,
        handling: playerStats.value.handling,
        goalKicking: playerStats.value.goalKicking,
        marking: playerStats.value.marking,
        pace: playerStats.value.pace,
        defending: playerStats.value.defending,
        strength: playerStats.value.strength,
        tackling: playerStats.value.tackling,
      },
    );
    await router.push('/login');
  } catch (err) {
    console.error(err.code);
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
    <div class="row justify-content-center pt-3">
      <div class="col-12 col-xxl-10">
        <div class="row g-4 align-items-stretch">

          <div class="col-12 col-xxl-4 mx-auto">
            <div class="content-box d-flex flex-column align-items-stretch h-100">
              <h2 class="mt-3">Create your account</h2>
              <SignUpPlayerForm
                @resetForm="resetForm"
                @submitForm="(success) => submitForm(success)"
                v-model:form-data="formData"
                v-model:errors="errors"
              />
            </div>
          </div>

          <div class="col-12 col-xxl-3 mx-auto">
            <div class="content-box h-100 d-flex flex-column">
              <PlayerStatSliderForm
                :max-stat-total="MAX_STAT_TOTAL"
                v-model:player-stats="playerStats"
                v-model:is-at-stat-total="isAtStatTotal"
              />
            </div>
          </div>

          <div class="col-12 col-xxl-5 mx-auto">
            <div class="content-box p-4 h-100 d-flex flex-column">
              <h2 class="mt-0 mb-4">Your player card!</h2>
              <PlayerCard
                :stats="playerStats"
                :firstName="formData.firstName"
                :nickname="formData.nickname"
                :lastName="formData.lastName"
                :position="formData.position"
              />
              <div v-if="isAtStatTotal" class="error-text mt-3">
                Total stat limit reached ({{ MAX_STAT_TOTAL }}).
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
