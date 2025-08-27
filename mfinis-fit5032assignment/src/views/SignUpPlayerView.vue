<script setup>
import '@material/web/all.js';
import '@material/web/slider/internal/slider.js';
import '../assets/main.css';
import { ref } from 'vue';

const sliderValue = ref(50);

const onInput = (e) => {
  sliderValue.value = Number((e.target).value);
}
</script>

<template>
  <div class="container">
    <div class="row content-container pt-5 pb-5">
      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-4 content-box mb-3">
        <md-slider></md-slider>
      </div>

      <div class="col-1 col-xxl-1"></div>

      <div class="col-1 d-xxl-none"></div>
      <div class="col-10 col-xxl-2 content-box mb-3 stat-slider">
        <div class="slider-pair">
          KICKING
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
        <div class="slider-pair">
          HANDLING
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
        <div class="slider-pair">
          GOALKICKING
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
        <div class="slider-pair">
          MARKING
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
        <div class="slider-pair">
          PACE
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
        <div class="slider-pair">
          DEFENDING
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
        <div class="slider-pair">
          STRENGTH
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
        <div class="slider-pair">
          TACKLING
          <md-slider :value="sliderValue" @input="onInput"></md-slider>
        </div>
      </div>
      <div class="col-1 d-xxl-none"></div>

      <div class="col-1 col-xxl-1"></div>

      <div class="col-10 col-xxl-4 content-box mb-3">
        <md-slider></md-slider>
        {{ sliderValue }}
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

.content-container {
  height: 100%;
}

.content-box {
  background-color: var(--color-raised);
  color: var(--color-neutral);
  font-size: x-large;
  text-align: center;
}

.slider-pair {
  margin-top: 1.5rem;
}
</style>
