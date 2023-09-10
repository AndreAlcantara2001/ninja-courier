<template>
  <HomePostComp :post="welcomeScreen" />
  <HomeSections />
  <HomePostComp :post="deliveryRiderScreen" />
</template>

<script>
import HomePostComp from '@/components/HomePostComp.vue';
import HomeSections from '@/components/HomeSections.vue';
import { reactive } from 'vue';
export default {

    name: 'HomeView',

    components:{
        HomePostComp,
        HomeSections
    },

    setup(){

        const welcomeScreen = reactive({
            title: "Fast and Reliable Delivery",
            description: "Get your items delivered to your doorstep in no time",
            hero: true,
            buttonText: "Explore Our Services",
            bgWhite: false,
            routerLink: "registerView",
            photo: "heroPhoto",
        })

        const deliveryRiderScreen = reactive({
            title: "Join Our Team of Delivery Heroes",
            description: "Empowerment, Flexibility, and Rewards Await",
            hero: true,
            buttonText: "Become a Rider",
            photo: "rider",
            routerLink: "registerView",
            bgWhite: true,
        })



        return {
             welcomeScreen, deliveryRiderScreen
        }

    }

}
</script>

<style>

</style>