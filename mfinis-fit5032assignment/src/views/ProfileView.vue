<script setup>
import { useCurrentUser } from '@/composables/useCurrentUser';
import { getUser } from '@/firebase/collections/users';
import { getAuth, signOut } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = getAuth();
const router = useRouter();
const { user } = useCurrentUser();

const profileName = ref('');
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  if (!user.value) {
    router.push('/login');
    return;
  }

  try {
    profileName.value = (await getUser(user.value.uid)).data.fullName;
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load profile';
  } finally {
    loading.value = false;
  }
})

const handleSignOut = () => {
  signOut(auth);
  router.push('/login');
}
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-6 mx-auto content-box d-flex flex-column py-3 gap-5">
        <h2>Hello, {{ profileName }}</h2>
        <button @click="handleSignOut" type="button" class="btn btn-primary rounded-pill">Sign out</button>
      </div>
    </div>
  </div>
</template>
