<script setup>
const props = defineProps({
  firstName: String,
  nickName: String,
  lastName: String,
  position: String,
  stats: {
    kicking: Number,
    handling: Number,
    goalKicking: Number,
    marking: Number,
    pace: Number,
    defending: Number,
    strength: Number,
    tackling: Number
  }
});

const statMetadata = {
  kicking: {
    pos: {x: "120", y: "520"},
    name: 'KIC'
  },
  handling: {
    pos: {x: "120", y: "580"},
    name: 'HND'
  },
  goalKicking: {
    pos: {x: "120", y: "640"},
    name: 'GOA'
  },
  marking: {
    pos: {x: "120", y: "700"},
    name: 'MAR'
  },
  pace: {
    pos: {x: "320", y: "520"},
    name: 'PAC'
  },
  defending: {
    pos: {x: "320", y: "580"},
    name: 'DEF'
  },
  strength: {
    pos: {x: "320", y: "640"},
    name: 'STR'
  },
  tackling: {
    pos: {x: "320", y: "700"},
    name: 'TAC'
  }
};
</script>

<template>
  <svg class="overlay-svg" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid meet">
    <image href="@/assets/player-card.png" x="0" y="0" width="600" height="900" />
    <text
      v-for="stat in Object.keys(props.stats)"
      :key="stat"
      :x="statMetadata[stat].pos.x"
      :y="statMetadata[stat].pos.y"
      font-size="40"
      font-weight="700"
      fill="var(--color-neutral)"
    >
      {{ `${stats[stat]} ${statMetadata[stat].name}` }}
    </text>

  </svg>
</template>

<style scoped>
</style>
