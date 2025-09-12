<script setup>
import { addReview } from '@/firebase/collections/venues';
import { validateRequiredField } from '@/utils/validationHelpers';
import { computed, ref } from 'vue';

const props = defineProps({id: String, name: String});

const emit = defineEmits(['toggle-create-review']);

const formData = ref({
  rating: 0,
  content: '',
});

const errors = ref({
  rating: '',
  content: '',
})

const hoveredRating = ref(0);
const activeRating = computed(() => hoveredRating.value > 0 ? hoveredRating.value : formData.value.rating);

const handleCancelClick = () => {
  emit('toggle-create-review');
  formData.value.rating = 0;
  formData.value.content = '';
}

const handleSubmitClick = async () => {
  validateRequiredField(formData.value.rating, 'rating', 'Rating', errors.value, true);
  validateRequiredField(formData.value.content, 'content', 'Review', errors.value, true);
  if (errors.value.rating || errors.value.content) return;

  await addReview(props.id, formData.value.rating, formData.value.content);
  emit('toggle-create-review');
}

</script>

<template>
  <div class="my-3">
    <img
      v-for="starRating in [1, 2, 3, 4, 5]"
      :key="starRating"
      class="mx-1" :class="{transparent: starRating > activeRating}"
      src="../assets/star.png"
      alt="star"
      height="50vh"
      width="auto"
      @mouseenter="hoveredRating = starRating"
      @mouseleave="hoveredRating = 0"
      @click="() => {errors.rating = ''; formData.rating = starRating}"
    />
  </div>
  <div class="error-text">{{ errors.rating }}</div>

  <textarea
    id="review-content"
    class="form-control form-control-lg"
    v-model="formData.content"
    rows="8"
    :placeholder="`What do you think of ${props.name}?`"
    maxlength="500"
    @input="validateRequiredField(formData.content, 'content', 'Review', errors, false)"
    @blur="validateRequiredField(formData.content, 'content', 'Review', errors, true)"
  />
  <div>{{ formData.content.length }}/500 characters remaining</div>
  <div class="error-text">{{ errors.content }}</div>

  <div class="mt-autojustify-content-center gap-3 py-3">
    <button type="button" class="btn btn-secondary rounded-pill" @click="handleCancelClick">Cancel</button>
    <button type="submit" class="btn btn-primary rounded-pill" @click="handleSubmitClick">Submit</button>
  </div>
</template>

<style scoped>
img {
  cursor: pointer;
}
</style>
