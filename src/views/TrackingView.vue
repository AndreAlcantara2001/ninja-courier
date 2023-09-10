<template>
    <div class="tracking-wrapper">
        <div class="orderId-wrapper">
            <h3>Tracking</h3>
            <div class="orderId" v-if="respOrderId">#{{ respOrderId }}</div>
        </div>



        <div class="photoWrapper waiting" v-if="waitingRider">
            <EmptyComp :message="waitingMessage" :imgUrl="imgUrlForWaitingRider" />
        </div>

        <div class="photoWrapper pickingUp" v-if="pickingUp">
            <EmptyComp :message="pickingUpMessage" :imgUrl="pickUpImg" :estimateTime="estimateTime" v-if="estimateTime" />
        </div>

        <div class="map-wrapper" v-if="delivering && trackingLocation">
            
                <MapRoute class="mapRoute" :isPicking="deliveryStatus" :isRider="false"
                    :riderLocation="trackingLocation.riderLocation"
                    :rideToLocation="trackingLocation.destinationLocation" />
            
        </div>

        <div class="complete" v-if="complete">
            <p>delivery complete</p>
            <div>
                <img v-if="previewUrl" :src="previewUrl" alt="Slip preview" id="slipPreview">
                <button @click="saveSlip">Save Slip</button>
            </div>
        </div>



    </div>
    <LoadingVue v-if="false" />
</template>

<script>

import MapRoute from '@/components/MapRoute.vue'
import LoadingVue from '@/components/LoadingVue.vue'
import EmptyComp from '@/components/EmptyComp.vue'

import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {

    components: {
        EmptyComp,
        LoadingVue,
        MapRoute,
    },

    setup() {


        const route = useRoute()

        const store = useStore()

        const respOrderId = route.params.id

        store.dispatch('getDelivery', respOrderId)

        const waitingRider = computed(() => store.state.waitingRider)

        const pickingUp = computed(() => store.state.pickingUp)

        const trackingLocation = computed(() => store.state.trackingLocation)

        const delivering = computed(() => store.state.delivering)

        const deliveryStatus = computed(() => store.state.deliveryStatus)

        const complete = computed(() => store.state.complete)

        const estimateTime = computed(() => store.state.estimateTime)

        const order = computed(() => store.state.order)

        const riderData = computed(() => store.state.riderData)

        const previewUrl = ref('')

        const saveSlip = () => {
            if (riderData.value) {
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                canvas.width = 300;
                canvas.height = 300;
                context.fillStyle = 'white'
                context.fillRect(0, 0, canvas.width, canvas.height)
                context.font = '16px Poppins'
                context.fillStyle = '#303030'
                context.fillText(`Delivery ID: ${respOrderId}`, 10, 30)
                context.fillText(`Rider name: ${riderData.value.name}`, 10, 60)
                context.fillText(`Rider email: ${riderData.value.email}`, 10, 90)
                context.fillText(`Destination Address: ${order.value.destinationAddress}`, 10, 120)
                context.fillText(`Cost: ${order.value.cost} mmk`, 10, 150)
                context.fillText(`Total Distance: ${order.value.distance} km`, 10, 180)
                context.fillText(`Weight: ${order.value.weight} kg`, 10, 210)

                context.font = 'italic bold 15px Poppins'
                context.fillStyle = '#303030'
                context.textAlign = 'left'
                context.fillText("Thanks for working with NinjaCourier", 10, 250)

                canvas.toBlob((blob) => {

                    const url = URL.createObjectURL(blob)
                    previewUrl.value = url

                    const result = window.confirm("Do you want to download slip?\nClick cancel to preview first you can save again")
                    if (result) {
                        const downloadLink = document.createElement('a')
                        downloadLink.href = url
                        downloadLink.download = `slip_${respOrderId}.jpeg`
                        downloadLink.style.display = 'none';
                        document.body.appendChild(downloadLink)
                        downloadLink.click()
                        document.body.removeChild(downloadLink)
                    }
                }, 'image/jpeg')
            }
        }

        const previewSlip = () => {
            const slipPreview = document.getElementById('slipPreview')
            if (slipPreview) {
                slipPreview.style.display = 'block'
            }
        }


        onMounted(() => {
            saveSlip()

        })


        return {
            respOrderId,
            waitingRider,
            pickingUp,
            waitingMessage: 'Waiting Rider To Accept The Order',
            imgUrlForWaitingRider: "waitingRider",
            pickingUpMessage: `Rider is coming to pickup`,
            pickUpImg: "pickingUpRider",
            trackingLocation,
            delivering,
            deliveryStatus,
            estimateTime,
            complete,
            saveSlip,
            previewUrl,
            riderData,
            previewSlip,
        }
    }

}
</script>

<style lang="scss" scoped>
.tracking-wrapper {

    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 500px;
    margin: 10px 10px;
    flex-direction: column;
    align-items: center;

    @media (min-width: 700px) {
        flex-direction: row;
    }


    .orderId-wrapper {

        h3 {}

        .orderId {}
    }


    .photoWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 300px;
        height: 400px;

        @media (min-width: 700px) {
            max-width: 400px;
            height: 400px;
        }
    }

    .map-wrapper {
        width: 400px;
    }

    .complete {
        padding: 20px;
    }
}
</style>