<template>
  <div class="form-wrap">
    <form class="login" @submit.prevent="signin">
      <p class="login-register">
        Don't have an account?
        <router-link class="router-link" :to="{ name: 'registerView' }">Register</router-link>
      </p>

      <h2>Login to NinjaCourier</h2>
      <div class="inputs">

        <div class="input">
          <input type="email" placeholder="Email" v-model="email" required>
          <i class="material-icons icon">email</i>
        </div>

        <div class="input">
          <input type="password" placeholder="Password" v-model="password" required>
          <i class="material-icons icon">lock</i>
        </div>

        <div class="error" v-show="error">{{ errorMessage }}</div>

      </div>

      <router-link class="forgot-password" :to="{ name: 'forgotPwd' }">Forgot your password?</router-link>

      <button type="submit">Sign in</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {

  setup() {

    const store = useStore()

    const router = useRouter()

    const email = ref('')
    const password = ref('')

    const error = computed(() => store.state.error)
    const errorMessage = computed(() => store.state.errorMessage)

    const profile = computed(() => store.state.profile)

    const user = computed(()=> store.state.user)

    const signin = async () => {

      await store.dispatch('signin', { email: email.value, password: password.value })

      await store.dispatch('getCurrentUser', user.value)

      //add profile.value
      if (!error.value) {
        console.log("profile: ", profile.value)
        if(profile.value){
          router.push({ name: `${profile.value.userType}Dashboard` })
        }else{
          router.push({ name: 'home' })
        }
        
      }

    }

    return {
      email, password, error, errorMessage, signin
    }
  }

}
</script>

<style lang="scss">
.form-wrap {
  overflow: hidden;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-self: center;
  margin: 0 auto;

  @media (min-width: 900px) {
    width: 100%;
  }

  .login-register {
    margin-bottom: 32px;

    .router-link {
      color: #000;
    }
  }

  form {
    padding: 0 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    @media (min-width: 900px) {
      padding: 0 50px;
    }


    h2 {
      text-align: center;
      font-size: 32px;
      color: #303030;
      margin-bottom: 40px;

      @media (min-width: 900px) {
        font-size: 40px;
      }
    }

    .inputs {
      width: 100%;
      max-width: 350px;

      .input {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 8px;

        input {
          width: 100%;
          border: none;
          background-color: #f2f7f6;
          padding: 4px 4px 4px 30px;
          height: 50px;

          &:focus {
            outline: none;
          }
        }

        .icon {
          width: 12px;
          position: absolute;
          left: 6px;
        }
      }
    }

    .forgot-password {
      text-decoration: none;
      color: #000;
      cursor: pointer;
      font-size: 14px;
      margin: 16px 0 32px;
      border-bottom: 1px solid transparent;
      transition: 0.5s ease all;

      &:hover {
        border-color: #303030;
      }
    }

    .angle {
      display: none;
      position: absolute;
      background: white;
      transform: rotateZ(3deg);
      width: 60px;
      right: -30px;
      height: 101%;

      @media (min-width: 900px) {
        display: initial;
      }
    }
  }

  .background {
    display: none;
    flex: 2;
    background-size: cover;
    background-image: url("../assets/background.jpg");
    width: 100%;
    height: 100%;

    @media (min-width: 900px) {
      display: initial;
    }
  }
}
</style>