<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ name: 'home' }">NinjaCourier</router-link>
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <router-link class="link" :to="{ name: 'home' }">Home</router-link>
          <router-link class="link" :to="{ name: 'aboutUs' }">About Us</router-link>
          <router-link v-if="!profileInitials" class="link" :to="{ name: 'loginView' }">Login In</router-link>
          <router-link v-if="!profileInitials" class="link" :to="{ name: 'registerView' }">Register</router-link>

          <router-link v-if="profileInitials && userType === 'admin'" class="link" :to="{ name: 'adminDashboard' }">Admin
            Dashboard</router-link>
          <router-link v-if="profileInitials && userType === 'customer'" class="link"
            :to="{ name: 'customerDashboard' }">Place an Order</router-link>
          <router-link v-if="profileInitials && userType === 'rider'" class="link" :to="{ name: 'riderDashboard' }">Start
            Deliveries</router-link>

        </ul>

        <div v-if="profileInitials" @click="toggleProfileMenu" class="profile" ref="profile">
          <span>{{ profileInitials }}</span>
          <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <p class="initials">{{ profileInitials }}</p>
              <div class="right">
                <p>{{ profileName }}</p>
                <p>{{ profileUsername }}</p>
                <p>{{ profileEmail }}</p>
              </div>
            </div>

            <div class="options">
              <div class="option">
                <router-link class="option" :to="{ name: 'profile' }"><i
                    class="material-icons icon icon-white">account_box</i>
                  <p>Profile</p>
                </router-link>

              </div>

              <div class="option">
                <router-link class="option" v-if="userType === 'admin'" :to="{ name: 'adminDashboard' }">
                  <i class="material-icons icon icon-white">security</i>
                  <p>Admin Dashboard</p>
                </router-link>
              </div>

              <div class="option" @click="logout">
                <i class="material-icons icon icon-white">exit_to_app</i>
                <p>Logout</p>
              </div>
            </div>


          </div>

        </div>
      </div>
    </nav>

    <i class="material-icons menu-icon" @click="toggleMobileNav" v-show="mobile">menu</i>

    <transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <router-link class="link" :to="{ name: 'home' }">Home</router-link>
        <router-link class="link" :to="{ name: 'aboutUs' }">About US</router-link>
        <router-link class="link" v-if="!profileInitials" :to="{ name: 'loginView' }">Login In</router-link>
        <router-link class="link" v-if="!profileInitials" :to="{ name: 'registerView' }">Register</router-link>
        <router-link v-if="profileInitials && userType === 'admin'" class="link" :to="{ name: 'adminDashboard' }">Admin
          Dashboard</router-link>
        <router-link v-if="profileInitials && userType === 'customer'" class="link"
          :to="{ name: 'customerDashboard' }">Place an Order</router-link>
        <router-link v-if="profileInitials && userType === 'rider'" class="link" :to="{ name: 'riderDashboard' }">Start
          Deliveries</router-link>
      </ul>
    </transition>
  </header>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'



export default {


  setup() {

    const router = useRouter()

    const mobile = ref(null)
    const mobileNav = ref(null)
    const windowWidth = ref(null)

    const logout = () => {
      store.dispatch("logout")
      //refresh the page
      router.push('/')
      window.location.reload()
    }


    const store = useStore()

    const profileMenu = ref(false)

    const userType = computed(() => store.state.profile.userType)

    const profileInitials = computed(() => store.state.profileInitials)
    const profileName = computed(() => store.state.profile.name)
    const profileUsername = computed(() => store.state.profile.username)
    const profileEmail = computed(() => store.state.profile.email)


    const checkScreen = () => {
      windowWidth.value = window.innerWidth;
      if (windowWidth.value <= 750) {
        mobile.value = true;
        return;
      }
      mobile.value = false;
      mobileNav.value = false;
      return;
    }

    const toggleProfileMenu = () => {
      profileMenu.value = !profileMenu.value
    }

    const toggleMobileNav = () => {
      mobileNav.value = !mobileNav.value
    }

    onMounted(() => {
      window.addEventListener("resize", checkScreen);
      checkScreen();
    })

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreen);
    })

    return {
      mobile, mobileNav, windowWidth,
      checkScreen, toggleMobileNav,
      profileInitials,
      profileName, profileUsername,
      profileEmail,
      profileMenu,
      toggleProfileMenu,
      logout,
      userType,

    }
  }
}

</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  .link {
    font-weight: 500;
    padding: 0 8px;
    transition: 0.3s color ease;

    &:hover {
      color: #1eb8b8;
    }
  }

  nav {
    display: flex;
    padding: 25px 0;

    .branding {
      display: flex;
      align-items: center;

      .header {
        font-weight: 600;
        font-size: 24px;
        color: #000;
        text-decoration: none;
      }
    }

    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      ul {
        margin-right: 32px;

        .link {
          margin-right: 32px;
        }

        .link:last-child {
          margin-right: 0;
        }


      }

      .profile {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;

        margin-right: 30px;
        border-radius: 50%;

        color: white;
        background-color: #303030;

        span {
          pointer-events: none;
        }

        .profile-menu {
          position: absolute;
          top: 60px;
          right: 0;
          width: 250px;
          background-color: #303030;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          .info {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid white;

            .initials {
              position: absolute;
              width: 40px;
              height: 40px;
              background-color: white;
              color: #303030;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
            }

            .right {
              flex: 1;
              margin-left: 50px;


              p:nth-child(2),
              p:nth-child(3) {
                font-size: 10px;
                width: 180px;
                overflow: hidden;
              }
            }
          }

          .options {
            padding: 15px;

            .option {
              text-decoration: none;
              color: white;
              display: flex;
              align-items: center;
              margin-bottom: 12px;

              .icon {
                width: 18px;
                height: auto;
              }

              p {
                font-size: 14px;
                margin-left: 12px;
              }

              &:last-child {
                margin-bottom: 0px;
              }

            }

          }

        }
      }
    }

  }

  .backToDeli {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;

  }

  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 32px;
    right: 25px;
    height: 25px;
    width: auto;
  }

  .mobile-nav {
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #303030;
    top: 0;
    left: 0;

    .link {
      padding: 15px 0;
      color: #fff;
    }
  }

  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: all 1s ease;
  }

  .mobile-nav-enter {
    transform: translateX(-250px);
  }

  .mobile-nav-enter-to {
    transform: translateX(0);
  }

  .mobile-nav-leave-to {
    transform: translateX(-250px);
  }
}
</style>