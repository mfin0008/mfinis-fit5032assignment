<script setup>
  const props = defineProps({
    id: String,
    name: String,
    address: String,
    isShowingReview: Boolean,
    showCreateReview: Boolean,
  });

  const emit = defineEmits(['showReview']);
  const handleShowReviewClick = () => {emit('showReview', props.id)};
</script>

<template>
  <div class="container raised-card my-3">
    <div class="my-2"><strong>Name: </strong>{{ props.name }}</div>
    <div class="my-2"><strong>Address: </strong>{{ props.address }}</div>
    <button
      class="btn btn-primary rounded-pill my-3"
      @click="handleShowReviewClick"
      :disabled="showCreateReview"
    >
      {{ `${isShowingReview ? 'Hide' : 'Show'} Reviews` }}
    </button>
  </div>
</template>

<style scoped>
</style>
