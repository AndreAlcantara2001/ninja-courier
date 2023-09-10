<template>
    <form @submit.prevent="collectOrderDetails" class="order-wrapper">
        <h2>Add Order Details</h2>

        <div class="cards">
            <div v-for="card in cards" :key="card.itemType" @click="selectedCard = card.itemType">

                <div class="card" :class="{ 'selected': selectedCard === card.itemType }">
                    <font-awesome-icon :icon="card.icon" class="icon" />
                    <font-awesome-icon :icon="card.mark" class="mark" />
                </div>
                <p>{{ card.itemType }}</p>
            </div>
        </div>

        <div class="weight">
            <input type="number" placeholder="weight" v-model="weight" required> <span>Kg</span>
        </div>

        <div class="mapNote-wrapper">
            <p class="mapNote">Drop markers for Pickup and Destination Location</p>
            <i class="material-icons">add_location</i>
        </div>
        <MapComp class="map" />

        <div class="inputs">

            <h5>Pickup: </h5>

            <div class="input" v-if="pickupAddress">
                <p>{{ pickupAddress.road }}, {{ pickupAddress.suburb }}</p>
            </div>

            <h5>Destination: </h5>

            <div class="input" v-if="destinationAddress">
                <p>{{ destinationAddress.road }}, {{ destinationAddress.suburb }}</p>
            </div>

            <h5>Distance: </h5>
            <div class="input" v-if="distance">
                <p>{{ distance }}</p>
            </div>

            <h5>Cost: </h5>
            <div class="input" v-if="cost">
                <p>{{ cost }}</p>
            </div>

            <div class="input">
                <input type="text" placeholder="Recepient Name" required v-model="recepientName">
            </div>

            <div class="input">
                <input type="tel" placeholder="Recepient Phone: 09xxxxxxxxx" required v-model="recepientPhone">
            </div>

        </div>

        <div class="note-wrapper">
            <p>Notes: (optional)</p>
            <textarea name="noteArea" class="note" v-model="note" placeholder="write some notes"></textarea>
        </div>

        <p v-if="error" class="error">{{ error }}</p>


        <div class="buttons">
            <button @click="handleBack">Back</button>
            <button type="submit">Continue</button>
        </div>
    </form>
</template>

<script>
import MapComp from '@/components/MapComp.vue'

import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {

    components: {
        MapComp,
    },

    setup() {
        const selectedCard = ref(null)

        const store = useStore()
        const router = useRouter()

        const handleBack = () => {
            router.push({ name: 'customerDashboard' })
        }

        const recepientName = ref(null)

        const recepientPhone = ref(null)

        const weight = ref(null)

        const note = ref(null)

        const error = ref(null)

        const profileId = computed(() => store.state.profile.profileId)

        const pickupAddress = computed(() => store.state.orderAddress.pickupAddress)
        const destinationAddress = computed(() => store.state.orderAddress.destinationAddress)

        const orderLocation = computed(() => store.state.orderLocation)

        const distance = computed(() => store.state.distance)


        watch(distance, (newValue) => {
            if (weight.value) {
                store.dispatch('calculateDeliveryCost', { distance: newValue, weight: weight.value })
            }
        })

        watch(weight, (newValue) => {
            if (distance.value) {
                store.dispatch('calculateDeliveryCost', { distance: distance.value, weight: newValue })
            }
        })

        const estimateTime = computed(() => store.state.estimateTime)

        const cost = computed(() => store.state.cost)


        const collectOrderDetails = async () => {

            const user = store.state.user

            store.dispatch('getCurrentUser', user)

            if (selectedCard.value && weight.value && distance.value && pickupAddress.value && destinationAddress.value && profileId.value) {

                await store.dispatch('calEstimateTime', { pickupLocation: orderLocation.value.pickupLocation, destinationLocation: orderLocation.value.destinationLocation })

                const order = {
                    profileId: profileId.value,
                    itemType: selectedCard.value,
                    weight: weight.value,
                    note: note.value,
                    pickupLocation: orderLocation.value.pickupLocation,
                    destinationLocation: orderLocation.value.destinationLocation,
                    distance: distance.value,
                    cost: cost.value,
                    recepientName: recepientName.value,
                    recepientPhone: recepientPhone.value,
                    postcode: pickupAddress.value.postcode,
                    estimateTime: estimateTime.value,
                    pickupAddress: pickupAddress.value.road + ", " + pickupAddress.value.suburb,
                    destinationAddress: destinationAddress.value.road + ", " + destinationAddress.value.suburb,
                }

                await store.dispatch('uploadOrders', order)

                const respOrderId = computed(() => store.state.orderId)

                if(respOrderId.value){
                    router.push({ name: 'trackingView', params: { id: respOrderId.value}})

                selectedCard.value = null
                weight.value = null
                note.value = null
                recepientName.value = null
                recepientPhone.value = null

                
               
                //need to clear orderAddress in store


                console.log("Order output after submit: ", order)
                }
                
            } else {
                error.value = "(Document/Parcel, Weight, Pick Up and Destination)***required"
            }


        }

        const cards = [
            { itemType: 'document', icon: 'fa-solid fa-newspaper', mark: 'fa-solid fa-square-check' }, { itemType: 'parcel', icon: 'fa-solid fa-box-archive', mark: 'fa-solid fa-square-check' }
        ]



        return {
            selectedCard,
            cards,
            weight,
            note,
            collectOrderDetails,
            handleBack,
            error,
            pickupAddress,
            destinationAddress,
            distance,
            cost,
            recepientName,
            recepientPhone,
        }
    },


}
</script>
<style lang="scss" scoped>
.order-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 1000px;
    margin: 30px auto;
    flex-direction: column;

    .inputs {
        width: 100%;
        max-width: 350px;

        .input {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 8px;

            p,
            input {
                width: 100%;
                border: none;
                background-color: #f1f1f1;
                padding: 4px 4px 4px 4px;
                height: auto;
                text-align: left;
                //display: inline-block;
            }

            input {
                margin-top: 20px;

                &:focus {
                    outline: none;
                }
            }

        }
    }

    .cards {
        display: flex;
        margin: 50px auto;

        .card {
            position: relative;
            box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 10px;
            border-radius: 12px;
            cursor: pointer;
            background-color: #f1f1f1;
            margin-right: 10px;
            width: 150px;
            height: 150px;

            display: flex;
            align-items: center;
            justify-content: center;

            .icon {
                font-size: 100px;
                color: #303030;
            }

            .mark {
                position: absolute;
                top: 6px;
                right: 6px;
                color: white;
            }
        }

        .card:nth-child(2) {
            margin-right: 0px;
        }

        p {
            text-align: center;
            font-size: 17px;
            font-weight: 500;
            margin-top: 10px;
            max-width: 350px;
            text-transform: capitalize;
        }

        .selected {

            background-color: #dbd2c6;

            .mark {
                color: #303030;
            }
        }
    }

    .weight {
        input {
            text-transform: uppercase;
            width: 90%;
            border: none;
            background-color: #f2f7f6;
            padding: 4px 4px 4px 30px;
            height: 50px;
            font-size: 15px;

            &:focus {
                outline: none;
            }
        }

        span {
            width: 10%;
            font-size: 14px;
            font-weight: 300;
        }
    }

    .note-wrapper {
        margin: 20px auto;
        width: 100%;

        p {
            font-size: 14px;
            font-weight: 400;
            margin-bottom: 10px;
        }

        .note {
            width: 100%;
            height: 70px;
            border: none;
            background-color: #f2f7f6;
            padding: 4px 4px 4px 10px;
            resize: none;

            &:focus {
                outline: none;
            }
        }
    }

    button {
        margin: 0px 10px 30px 0px;

    }

    button:nth-child(1) {
        color: #303030;
        background-color: white;
        border: 1px solid #303030;

        &:hover {
            background-color: #f1f1f1;
        }
    }

    button:last-child {
        color: white;
        background-color: #ffc16e;

        &:hover {
            background-color: #f29922;
        }
    }

    .error {
        font-size: 10px;
        font-weight: 300;
        margin-bottom: 15px;
        width: 100%;
    }

    .mapNote-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 350px;

        .mapNote {

            margin-top: 20px;
        }
    }


    .map {
        margin: 22px 10px;
        border-radius: 10px;
        position: relative;
        z-index: 0;
    }
}
</style>