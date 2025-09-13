<script setup>
const props = defineProps({maxStatTotal: Number});

const statModel = defineModel('playerStats');
const statTotal = defineModel('isAtStatTotal');

const onSliderInput = (event) => {
  const newValue = Number(event.target.value);
  const amountOverTotalPermittedStats = getAmountOverTotalPermittedStats(event.target.id, newValue);
  if (amountOverTotalPermittedStats <= 0) {
    statModel.value[event.target.id] = newValue;
  } else {
    statModel.value[event.target.id] = newValue - amountOverTotalPermittedStats;
  }
}

const getAmountOverTotalPermittedStats = (statName, newValue) => {
  let newPlayerStats = { ...statModel.value };
  newPlayerStats[statName] = newValue;
  const newStatTotal = Object.values(newPlayerStats).reduce((sum, value) => sum + value, 0);

  statTotal.value = newStatTotal >= props.maxStatTotal;
  return newStatTotal - props.maxStatTotal;
}

const resetSlider = (event) => {
  const statName = event.target.id;
  event.target.value = statModel.value[statName];
}
</script>

<template>
  <div class="slider-pair" v-for="stat in Object.keys(statModel)" :key="stat">
    {{ String(stat).toUpperCase() }}
    <md-slider
      :id="stat"
      :value="statModel[stat]"
      :class="{ 'at-stat-total': statTotal }"
      @input="onSliderInput"
      @change="resetSlider"
    >
    </md-slider>
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

.slider-pair {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
