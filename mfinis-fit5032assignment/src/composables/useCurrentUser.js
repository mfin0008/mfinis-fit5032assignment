import { getAuth, onAuthStateChanged } from "firebase/auth";
import { computed, ref } from "vue";

const user = ref(null);
let started = false;

export function useCurrentUser() {
  if (!started) {
    started = true;
    onAuthStateChanged(getAuth(), res => user.value = res ?? null);
  }

  return {
    user: user,
    isLoggedIn: computed(() => Boolean(user.value))
  }
}
