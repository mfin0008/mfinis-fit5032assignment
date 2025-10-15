<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import VenueReviewForm from './VenueReviewForm.vue';
import { getVenueReviews } from '@/firebase/collections/venues';
import VenueReviewDisplayCard from './VenueReviewDisplayCard.vue';
import { OrderDirection, ReviewsOrderByColumns } from '../../shared/constants';
import { useCurrentUser } from '@/composables/useCurrentUser';
import { useRouter } from 'vue-router';

const props = defineProps({
  id: String,
  venueName: String,
  showCreateReview: Boolean,
});

const sortOrderDisplays = {};
sortOrderDisplays[OrderDirection.DESC] = 'High to Low';
sortOrderDisplays[OrderDirection.ASC] = 'Low to High';
const sortType = ref(OrderDirection.DESC);

const reviews = ref([]);
const averageRating = computed(() => {
  let totalRating = 0;

  for (const rating of reviews.value.map((d) => d.data?.rating)) totalRating += Number(rating);
  return Math.round(totalRating / reviews.value.length);
});

const refreshReviews = async () => reviews.value = await getVenueReviews(props.id, ReviewsOrderByColumns.RATING, sortType.value);
onMounted(async () => await refreshReviews());
watch(() => props.id, refreshReviews);
const hasReviews = computed(() => reviews.value.length > 0);

const emit = defineEmits(['toggle-create-review']);

const router = useRouter();
const handleReviewClick = () => {
  const { isLoggedIn } = useCurrentUser();
  if (!isLoggedIn.value) {
    router.push('/login');
    alert('You must be logged in to leave a review');
    return;
  }

  emit('toggle-create-review');
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="content-box d-flex flex-column align-items-stretch" style="max-height: 70vh;">
        <h1 class="my-3">{{ `${showCreateReview ? 'Reviewing: ' : ''}${props.venueName}` }}</h1>
        <div v-if="hasReviews && !showCreateReview" class="d-flex justify-content-center mt-3">
          <img
            v-for="starRating in 5"
            :key="starRating"
            class="mx-1" :class="{transparent: starRating > averageRating}"
            src="../assets/star.png"
            alt="star"
            height="50vh"
            width="50vh"
          />
        </div>
        <div v-if="hasReviews && !showCreateReview" class="mb-3">Average user rating</div>
        <div
          v-if="!showCreateReview"
          class="d-flex flex-column flex-xxl-row align-items-stretch align-items-center justify-content-xxl-between gap-3 w-100 mb-3"
        >
          <button
            class="btn btn-primary rounded-pill w-100 w-auto"
            @click="handleReviewClick()"
          >
            Review {{ venueName }}
          </button>

          <div class="d-flex align-items-center gap-2 w-100 w-auto justify-content-center justify-content-xxl-end">
            <label for="sortType" class="my-auto">Sort by:</label>
            <select
              id="sortType"
              class="form-select form-select-sm w-auto"
              v-model="sortType"
              @change="refreshReviews()"
            >
              <option :value="OrderDirection.DESC">{{ sortOrderDisplays[OrderDirection.DESC] }}</option>
              <option :value="OrderDirection.ASC">{{ sortOrderDisplays[OrderDirection.ASC] }}</option>
            </select>
          </div>
        </div>

        <div class="flex-grow-1 overflow-auto pe-2 mb-3" v-if="hasReviews && !showCreateReview">
          <VenueReviewDisplayCard
            v-for="review in reviews"
            :key="review.id"
            :rating="review.data.rating"
            :content="review.data.content"
            class="my-3 py-3"
          />
        </div>
        <div v-if="!hasReviews && !showCreateReview" class="my-5">No reviews found</div>
        <VenueReviewForm
          v-if="showCreateReview"
          @toggle-create-review="() => {refreshReviews(); emit('toggle-create-review');}"
          :id="props.id"
          :name="props.venueName"
        />
      </div>
    </div>
  </div>
</template>
