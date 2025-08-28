<script setup>
import '@material/web/all.js';
import '@material/web/slider/slider.js';
import '../assets/main.css';
import { ref } from 'vue';
import PlayerCard from '@/components/PlayerCard.vue';

const MAX_STAT_TOTAL = 600;
const isAtStatTotal = ref(false);

const playerStats = ref({
    kicking: 50,
    handling: 50,
    goalKicking: 50,
    marking: 50,
    pace: 50,
    defending: 50,
    strength: 50,
    tackling: 50
  }
);

const onSliderInput = (event) => {
  const newValue = Number((event.target).value);
  const amountOverTotalPermittedStats = getAmountOverTotalPermittedStats(event.target.id, newValue);
  if (amountOverTotalPermittedStats <= 0) {
    playerStats.value[event.target.id] = newValue;
  } else {
    playerStats.value[event.target.id] = newValue - amountOverTotalPermittedStats;
  }
}

const getAmountOverTotalPermittedStats = (statName, newValue) => {
  let newPlayerStats = {...playerStats.value};
  newPlayerStats[statName] = newValue;
  const newStatTotal = Object.values(newPlayerStats).reduce((sum, value) => sum + value, 0);

  isAtStatTotal.value = newStatTotal >= MAX_STAT_TOTAL;
  return newStatTotal - MAX_STAT_TOTAL;
}

const resetSlider = (event) => {
  const statName = event.target.id;
  event.target.value = playerStats.value[statName];
}

</script>

<template>
  <div class="container">
    <div class="row pt-5 pb-5">
      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-4 content-box mb-3"></div>

      <div class="col-1 col-xxl-1"></div>

      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-2 content-box mb-3">
        <div
          class="slider-pair"
          v-for="stat in Object.keys(playerStats)"
          :key="stat"
        >
          {{ String(stat).toUpperCase() }}
          <md-slider
            :id="stat"
            :value="playerStats[stat]"
            :class="{ 'at-stat-total': isAtStatTotal }"
            @input="onSliderInput"
            @change="resetSlider">
          </md-slider>
        </div>
      </div>
      <div class="col-1 d-xxl-none"></div>

      <div class="col-1 col-xxl-1"></div>

      <div class="col-10 col-xxl-4 content-box mb-3">
        <h2 class="mt-3">Your player card!</h2>
        <PlayerCard :stats="playerStats"/>
        <div v-if="isAtStatTotal" class="error-text mt-2">
          Total reached ({{ MAX_STAT_TOTAL }}).
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
  width: 60%
}

md-slider.at-stat-total{
  --md-slider-inactive-track-color: var(--color-primary);
}

.content-box {
  background-color: var(--color-raised);
  color: var(--color-neutral);
  font-size: x-large;
  text-align: center;
  align-items: center;
}

.slider-pair {
  margin-top: 1.5rem;
}

.error-text {
  color: var(--color-primary);
}
</style>
