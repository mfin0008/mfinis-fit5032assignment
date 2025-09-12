<script setup>
import { getAllVenues } from '@/firebase/collections/venues';
import { onMounted, ref, watch } from 'vue';
import VenueDisplayCard from '@/components/VenueDisplayCard.vue';
import VenueReviewContainer from '@/components/VenueReviewContainer.vue';

const idOfActiveVenue = ref('');
const venues = ref([]);

const toggleShowReview = async (venueId) => {
  if (idOfActiveVenue.value === venueId) {
    idOfActiveVenue.value = '';
  } else {
    idOfActiveVenue.value = venueId;
  }
}

const showCreateReviewForActiveVenue = ref(false);
const toggleShowCreateReview = () => {
  showCreateReviewForActiveVenue.value = !showCreateReviewForActiveVenue.value;
}

const refreshVenues = async () => venues.value = await getAllVenues();
onMounted(async () => await refreshVenues());
watch(showCreateReviewForActiveVenue, refreshVenues);
</script>

<template>
  <div class="container">
    <h1 class="text-center my-3">Venues</h1>
    <div class="row g-4">
      <div class="col-12 d-flex flex-column" :class="{ 'col-xxl-6': idOfActiveVenue !== '', 'col-xxl-12': idOfActiveVenue === '' }">
        <div class="content-box d-flex flex-column h-100">
          <div class="flex-grow-1 overflow-auto">
            <div class="vstack gap-3">
              <VenueDisplayCard v-for="venue in venues" :key="venue.id" @show-review="id => toggleShowReview(id)"
                :id="venue.id" :name="venue.data.name" :address="venue.data.location?.address"
                :isShowingReview="idOfActiveVenue === venue.id" :showCreateReview="showCreateReviewForActiveVenue" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="idOfActiveVenue !== ''" class="col-12 col-xxl-6">
        <div class="position-sticky">
          <div class="content-box d-flex flex-column">
            <VenueReviewContainer class="flex-grow-1 overflow-auto" @toggle-create-review="toggleShowCreateReview"
              :showCreateReview="showCreateReviewForActiveVenue" :id="idOfActiveVenue"
              :venueName="venues.find(venue => venue.id === idOfActiveVenue)?.data.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
