<script setup>
const props = defineProps({
  firstName: String,
  nickname: String,
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
    pos: {x: 115, y: 520},
    name: 'KIC'
  },
  handling: {
    pos: {x: 115, y: 580},
    name: 'HND'
  },
  goalKicking: {
    pos: {x: 115, y: 640},
    name: 'GOA'
  },
  marking: {
    pos: {x: 115, y: 700},
    name: 'MAR'
  },
  pace: {
    pos: {x: 335, y: 520},
    name: 'PAC'
  },
  defending: {
    pos: {x: 335, y: 580},
    name: 'DEF'
  },
  strength: {
    pos: {x: 335, y: 640},
    name: 'STR'
  },
  tackling: {
    pos: {x: 335, y: 700},
    name: 'TAC'
  }
};

const positionMap = {
  'forward': 'FWD',
  'midfield': 'MID',
  'defender': 'DEF',
  'ruckman': 'RCK'
}
</script>

<template>
  <svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMid meet">
    <image href="@/assets/player-card.png" x="0" y="0" width="600" height="900" />
    <image href="@/assets/Footy-9s-logo.png" x="300" y="250" width="200" height="200" />
    <text
      v-for="stat in Object.keys(props.stats)"
      :key="stat"
      :x="statMetadata[stat].pos.x"
      :y="statMetadata[stat].pos.y"
      font-size="40"
      font-weight="700"
      fill="var(--color-neutral)"
    >
      {{ stats[stat] }}
    </text>
    <text
      v-for="stat in Object.keys(props.stats)"
      :key="stat"
      :x="statMetadata[stat].pos.x + 80"
      :y="statMetadata[stat].pos.y"
      font-size="40"
      font-weight="700"
      fill="var(--color-neutral)"
    >
      {{ statMetadata[stat].name }}
    </text>
    <text x="130" y="360" font-size="60" font-weight="700" fill="var(--color-neutral)">
      {{ positionMap[position] }}
    </text>
    <text x="50%" y="130" text-anchor="middle" dominant-baseline="middle" font-size="45" font-weight="400" fill="var(--color-neutral)">
      {{ firstName }}
    </text>
    <text x="50%" y="180" text-anchor="middle" dominant-baseline="middle" font-size="45" font-weight="400" fill="var(--color-neutral)">
      {{ nickname ? `"${nickname}"` : '' }}
    </text>
    <text x="50%" y="230" text-anchor="middle" dominant-baseline="middle" font-size="45" font-weight="400" fill="var(--color-neutral)">
      {{ lastName }}
    </text>
  </svg>
</template>
