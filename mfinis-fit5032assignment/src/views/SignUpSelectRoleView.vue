<script setup lang="ts">
import SelectRoleCard from '@/components/SelectRoleCard.vue';
</script>

<template>
  <div class="container">
    <div class="row text-center mt-3">
      <h1 class="heading mb-5">Who are you?</h1>
    </div>
    <div class="row">
      <SelectRoleCard
        route="/sign-up-player"
        role-name="Player"
        role-image-name="player-role"
        class="col-10 col-xxl-5 mx-auto mb-3"
      >Player
      </SelectRoleCard>
      <div class="d-none d-xxl-block col-xxl-2"></div>
      <SelectRoleCard
        route="/sign-up-coach"
        role-name="Coach"
        role-image-name="coach-role"
        class="col-10 col-xxl-5 mx-auto mb-3"
      >Coach
      </SelectRoleCard>
    </div>
  </div>
</template>
