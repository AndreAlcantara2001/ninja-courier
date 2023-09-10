<template>
  <div class="rider-wrapper">
    <RiderTasks class="rider-tasks" />
    <div v-if="earnings.length > 0">
    <EarningList class="rider-earnings" :earnings="earnings" />
  </div>
  </div>
</template>

<script>
import RiderTasks from '@/components/RiderTasks.vue'
import EarningList from '../components/EarningList.vue'
import { computed, onMounted, watch, } from 'vue'
import { useStore } from 'vuex'

export default {

  components: {
    RiderTasks,
    EarningList,
  },

  setup() {

    const store = useStore()

    const earnings = computed(() => store.state.earnings)

    const profile = computed(() => store.state.profile)

    onMounted(() => {
      if(profile.value)
      store.dispatch('getRiderEarning', profile.value.profileId)
    })

    watch(profile, (newValue) => {
      store.dispatch('getRiderEarning', newValue.profileId)
    })


    /* 
        const earnings = [
          {
            orderId: 'WAkihpIzNyrlXaRGkieR1', totalDistance: 12, destinationAddressRoad: '228 Park Ave S', destinationAddressSuburb: 'New York', earning: 3000
          },
          {
            orderId: 'WAkihpIzNyrlXaRGkieR2', totalDistance: 15, destinationAddressRoad: '230 Park Ave S', destinationAddressSuburb: 'New York', earning: 1200
          },
          {
            orderId: 'WAkihpIzNyrlXaRGkieR3', totalDistance: 20, destinationAddressRoad: '229 Park Ave S', destinationAddressSuburb: 'New York', earning: 5000
          },
        ] */

    return {

      earnings,
    }
  }

}
</script>

<style lang="scss" scoped>
.rider-wrapper {

  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1000px;
  margin: 30px auto;
  flex-direction: column;
  align-items: center;

  @media (min-width: 700px) {
    flex-direction: row;
  }

  .rider-tasks,
  .rider-earnings {
    background-color: #303030;
    border-radius: 10px;

    margin: 0px 10px 30px 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }



}
</style>