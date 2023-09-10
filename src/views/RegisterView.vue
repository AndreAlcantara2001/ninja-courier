<template>
  <div class="form-wrap">
    <form class="register" @submit.prevent="signup">
      <p class="login-register">
        Already have an account?
        <router-link class="router-link" :to="{ name: 'loginView' }">Login</router-link>
      </p>

      <h2>Create your NinjaCourier Account</h2>
      <div class="inputs">

        <div class="input">
          <input type="text" placeholder="Name" v-model="name" required>
          <i class="material-icons icon">person</i>
        </div>

        <div class="input">
          <input type="text" placeholder="Username" v-model="username" required>
          <i class="material-icons icon">person</i>
        </div>

        <div class="input">
          <input type="email" placeholder="Email" v-model="email" required>
          <i class="material-icons icon">email</i>
        </div>

        <div class="input">
          <input type="password" placeholder="Password" v-model="password" required>
          <i class="material-icons icon">lock</i>
        </div>

        <div class="input">
          <label for="userType">Account Type:</label>
          <div class="select-wrapper">
            <select id="userType" v-model="userType" required>
              <option disabled value="">Please Select</option>
              <option value="customer">Customer</option>
              <option value="rider">Rider</option>
            </select>
            <i class="material-icons">arrow_drop_down</i>
          </div>
        </div>

        <div class="error" v-show="error">{{ errorMessage }}</div>

      </div>

      <button type="submit">Sign up</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {

  setup() {

    const store = useStore()

    const router = useRouter()

    const userType = ref('');

    const email = ref('')
    const password = ref('')
    const name = ref('')
    const username = ref('')

    const error = computed(() => store.state.error)
    const errorMessage = computed(() => store.state.errorMessage)

    const signup = async () => {

      await store.dispatch('signup', { name: name.value, username: username.value, email: email.value, password: password.value, userType: userType.value})
      if (!error.value) {
        router.push({ name: 'home' })
      }

    }

    return {
      email, password, name, username, errorMessage, signup, error,userType,
    }
  }

}
</script>

<style lang="scss" scoped>
.select-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-wrapper select {
  margin-right: 20px;
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  font-size: 1rem;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: none;
  }
}

.select-wrapper i {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: #333;
}

//
.register {
  h2 {
    max-width: 350px;
  }

  button {
    margin-top: 30px;
  }
}
</style>