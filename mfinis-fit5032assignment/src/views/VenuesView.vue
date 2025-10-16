<script setup>
import { getAllVenues } from '@/firebase/collections/venues';
import { onMounted, ref, watch } from 'vue';
import VenueReviewContainer from '@/components/VenueReviewContainer.vue';
import VenueMap from '@/components/VenueMap.vue';

const idOfActiveVenue = ref(null);
const venues = ref([]);

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

      <div
        class="col-12"
        :class="idOfActiveVenue
          ? 'col-xxl-6'
          : 'd-flex justify-content-center align-items-center'"
      >
        <div class="w-100" :class="{ 'col-xxl-6 ': !idOfActiveVenue }" style="max-width: 50vh;">
          <VenueMap v-model:selectedVenueId="idOfActiveVenue" />
        </div>
      </div>

      <div v-if="idOfActiveVenue" class="col-12 col-xxl-6">
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
