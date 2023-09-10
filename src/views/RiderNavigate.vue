<template>
  <div v-if="order" class="orderData">
    <p>Delivery Id: <span class="orderId">#{{ orderId }}</span></p>
    <p>Recepient Name: <span>{{ order.recepientName }}</span></p>
    <p>Recepient Phone: <span>{{ order.recepientPhone }}</span></p>
    <p v-if="order.note">note: {{ order.note }}</p>
  </div>

  <div class="button-wrapper" v-if="deliveryStatus === 'picking up'">
    <button @click="finishedPickup()" v-show="distance <= 0.7">finish pick up</button>
  </div>
  <div class="button-wrapper" v-if="deliveryStatus === 'delivering'">
    <button @click="deliveryComplete()" v-show="distance <= 0.7">Delivery
      Complete</button>
  </div>

  <div v-if="loadingComplete">

    <div v-if="deliveryStatus === 'picking up' && riderLocation && order">
      <MapRoute class="mapRoute" :isPicking="deliveryStatus" :isRider="true" :riderLocation="riderLocation"
        :rideToLocation="order.pickupLocation" />
    </div>
    <div v-if="deliveryStatus === 'delivering' && riderLocation && order">
      <MapRoute class="mapRoute" :isPicking="deliveryStatus" :isRider="true" :riderLocation="riderLocation"
        :rideToLocation="order.destinationLocation" />
    </div>
  </div>
</template>

<script>

import MapRoute from '@/components/MapRoute.vue'

import { computed, onMounted, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {

  components: {
    MapRoute,
  },

  setup() {

    const route = useRoute()

    const router = useRouter()

    const store = useStore()

    const orderId = computed(() => route.params.id)

    const order = computed(() => store.state.deliveryOrder)

    const deliveryStatus = computed(() => store.state.deliveryStatus)

    const loadingComplete = computed(() => store.state.loadingComplete)

    const riderLocation = computed(() => store.state.riderLocation)

    const rider = computed(() => store.state.profile)


    const finishedPickup = async () => {
      await store.dispatch('updateDeliveryStatus', { status: "delivering", orderId: orderId.value })
      console.log(orderId)
    }

    const deliveryComplete = async () => {
      await store.dispatch('updateDeliveryStatus', { status: "complete", orderId: orderId.value })
      await store.dispatch('updateRiderStatus', { riderId: rider.value.profileId, status: "idle" })

      await store.dispatch('updateRiderEarning', { riderId: rider.value.profileId, orderId: orderId.value, distance: order.value.distance, destinationAddress: order.value.destinationAddress, cost: order.value.cost })
      router.push({ name: 'riderDashboard' })
    }

    const distance = computed(() => store.state.distance)

    watch(riderLocation, (newValue) => {
      if (order.value) {
        if (deliveryStatus.value === 'picking up') {
          store.dispatch('getDistance', { pLat: newValue.lat, pLng: newValue.lng, dLat: order.value.pickupLocation.lat, dLng: order.value.pickupLocation.lng })
        }
        if (deliveryStatus.value === 'delivering') {
          store.dispatch('getDistance', { pLat: newValue.lat, pLng: newValue.lng, dLat: order.value.destinationLocation.lat, dLng: order.value.destinationLocation.lng })
        }
      }
    })

    if (riderLocation.value && order.value) {
      if (deliveryStatus.value === "picking up") {
        store.dispatch('getDistance', { pLat: riderLocation.value.lat, pLng: riderLocation.value.lng, dLat: order.value.pickupLocation.lat, dLng: order.value.pickupLocation.lng })
      } if (deliveryStatus.value === "delivering") {
        store.dispatch('getDistance', { pLat: riderLocation.value.lat, pLng: riderLocation.value.lng, dLat: order.value.destinationLocation.lat, dLng: order.value.destinationLocation.lng })
      }
    }




    onMounted(async () => {
      await store.dispatch('uploadDelivery', orderId.value)
      await store.dispatch('getDeliveryStatus', orderId.value)

    })


    return {
      orderId,
      order,
      finishedPickup,
      riderLocation,
      loadingComplete,
      deliveryStatus,
      distance,
      deliveryComplete,
    }
  }

}
</script>
<style lang="scss" scoped>
.button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    text-align: center;
    margin: 10px auto;
    height: auto;
    font-size: 12px;
  }
}


.orderData {
  text-align: center;
  margin: 10px auto;

  border: 1px solid #303030;

  padding: 10px;

  border-radius: 10px;

  p {

    color: #303030;
    text-align: left;
    margin-bottom: 5px;

    .orderId {
      border-radius: 5px;
      background-color: #303030;
      color: white;
      padding: 1px;
    }
  }
}
</style>