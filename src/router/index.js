import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutUs from '../views/AboutUs.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPwd from '../views/ForgotPwd.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminPanel from '../views/AdminPanel.vue'
import CustomerDashboard from '../views/CustomerDashboard.vue'
import RiderDashboard from '../views/RiderDashboard.vue'
import TrackingView from '../views/TrackingView.vue'
import OrderingView from '../views/OrderingView.vue'
import RiderNavigate from '../views/RiderNavigate.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: "Home",

    }
  },
  {
    path: '/aboutUs',
    name: 'aboutUs',
    component: AboutUs,
    meta: {
      title: "AboutUs",

    }
  },
  {
    path: '/login',
    name: 'loginView',
    component: LoginView,
    meta: {
      title: "Login",

    }
  },
  {
    path: '/register',
    name: 'registerView',
    component: RegisterView,
    meta: {
      title: "Register",

    }
  },
  {
    path: '/forgot-password',
    name: 'forgotPwd',
    component: ForgotPwd,
    meta: {
      title: "Forgot Password",

    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: "Profile",
    }
  },

  //customer routes

  {
    path: '/customer/dashboard',
    name: 'customerDashboard',
    component: CustomerDashboard,
    meta: {
      title: "Dashboard",
    }
  },

  {
    path: '/customer/tracking/:id',
    name: 'trackingView',
    component: TrackingView,
    meta: {
      title: "Tracking",
    }
  },

  {
    path: '/customer/ordering',
    name: 'orderingView',
    component: OrderingView,
    meta: {
      title: "Ordering",
    }
  },

    //rider routes
    {
      path: '/rider/dashboard',
      name: 'riderDashboard',
      component: RiderDashboard,
      meta: {
        title: "Rider Dashboard",
      }
    },
    {
      path: '/rider/navigate/:id',
      name: 'riderNavigate',
      component: RiderNavigate,
      meta: {
        title: "Rider Navigating",
      }
    },


    //admin routes
  {
    path: '/admin-panel',
    name: 'adminDashboard',
    component: AdminPanel,
    meta: {
      title: "Admin Panel",
    }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  document.title = `${to.meta.title} | NinjaCourier`;


})

export default router
