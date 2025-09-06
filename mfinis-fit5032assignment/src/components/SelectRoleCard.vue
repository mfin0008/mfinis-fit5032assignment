<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  route: String,
  roleImageName: String,
  roleName: String,
});
const imageSrc = `/${props.roleImageName}.png`;
const router = useRouter();

const handleRoleClick = () => {
  router.push(props.route);
};
</script>

<template>
  <div @click="handleRoleClick" class="content-box">
    <img :src="imageSrc" :alt="props.roleName"/>
    <button class="btn btn-primary rounded-pill my-5 px-5">{{ props.roleName }}</button>
  </div>
</template>

<style scoped>
img {
  height: 40vh;
  width: auto;
}
.content-box {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
</style>
