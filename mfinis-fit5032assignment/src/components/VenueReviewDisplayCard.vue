<script setup>
const props = defineProps({
  rating: Number,
  content: String,
});
</script>
<template>
  <div class="raised-card">
    <img
      v-for="starRating in 5"
      :key="starRating"
      class="mx-1" :class="{transparent: starRating > props.rating}"
      src="../assets/star.png"
      alt="star"
      height="30vh"
      width="auto"
    />
    <div class="my-3">{{ props.content }}</div>
  </div>
</template>
