<template>
  <div class="app-wrapper">
    <div class="app">
      <NavigationBar v-if="!navDisable" />

      <router-view />
      <FooterVue v-if="!navDisable" />

      <div v-if="riderDetails">
        {{ riderDetails }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

import FooterVue from './components/Footer.vue';
import NavigationBar from './components/NavigationBar.vue';
import router from './router';
import { useStore } from 'vuex';


export default {

  components: {
    NavigationBar,
    FooterVue
  },

  setup() {

    const store = useStore()

    const stateProfile = ref(computed(() => store.state.profile))
    const userProfile = ref(null)

    const userType = ref(null)

    const postcode = computed(() => store.state.postcode)

    watch(stateProfile, (newValue) => {
      if (newValue) {
        userProfile.value = newValue
        userType.value = newValue.userType
        if (userType.value === "rider") {
          //geolocation watch posiition
          watchPosition()
        }
        store.commit("setProfileInitials", newValue.name)
      } else {
        userProfile.value = stateProfile.value
        store.commit("setProfileInitials", null)
      }
    });

    const watchPosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {

          const { latitude, longitude } = position.coords

          //get post code
          store.dispatch('getAddressOflocation', { lat: latitude, lng: longitude, locationType: null })

          //update rider location
          store.dispatch('updateRiderLocation', { lat: latitude, lng: longitude, riderId: userProfile.value.profileId, postcode: postcode.value })

        })

      } else {
        alert("Geolocation is not supported by this browser")
      }
    }

    //testing 
    const riderDetails = computed(() => store.state.riderDetails)



    const navDisable = ref(null)


    const checkRoute = () => {
      if (router.currentRoute.value.name === "loginView" ||
        router.currentRoute.value.name === "registerView" ||
        router.currentRoute.value.name === "forgotPwd") {
        navDisable.value = true;
      } else {
        navDisable.value = false;
      }
    }


    watch(() => router.currentRoute.value,
      () => {
        checkRoute();
      })

    checkRoute();


    return {
      navDisable,
      riderDetails,
    }
  },



}

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100&display=swap');


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: #000;

}

.link-light {
  color: white;
}

.arrow {
  margin-left: 8px;
  width: 12px;

  path {
    fill: #000;
  }
}

.arrow-light {
  path {
    fill: white;
  }
}

.error {
  text-align: center;
  font-size: 12px;
  color: red;

}

button {
  text-transform: uppercase;
  font-size: 15px;
  font-weight: 500;
  height: 30px;
  border: none;
  border-radius: 7px;
  color: white;
  background-color: #303030;
  width: 100px;
  cursor: pointer;
}

.mapRoute {
  margin: 10px 20px;
}
</style>
