<template>
    <div>
        <h3>Orders</h3>
        <div class="no-task" v-if="!notShowEmpty">
            <EmptyComp :message="message" :imgUrl="emptyImg" />
        </div>
        <div class="tasks-wrapper" v-if="notShowEmpty">

            <div class="task-wrapper" v-for="order in getOrders" :key="order.id">
                <div class="task">
                    <p>#{{ order.id }}</p>
                    <p>{{ order.destinationAddress }}</p>

                    <p class="time" :class="durationColorClass(order.estimateTime)">{{ order.estimateTime }} mins</p>

                    <button @click="backToDashboard" class="rejectBtn">Reject</button>
                    <button @click="handleTaskAndNavigate(order)" class="acceptBtn">Accept</button>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
import EmptyComp from './EmptyComp.vue';


import { useRouter } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
export default {


    components: {
        EmptyComp,
    },

    setup() {

        const store = useStore()

        const postcode = computed(() => store.state.postcode)

        watch(postcode, (newValue) => {
            store.dispatch('getOrders', newValue)
        })

        const getOrders = computed(() => store.state.orders)

        const router = useRouter()



        const selectedTask = ref(null)

        const notShowEmpty = ref(null)

        const durationColorClass = (duration) => {
            if (duration <= 30) return 'green'
            if (duration <= 60) return 'yellow'
            else {
                return 'red'
            }
        }

        const empty = () => {
            if (getOrders.value) {
                if (getOrders.value.length > 0) {
                    notShowEmpty.value = true
                } else {
                    notShowEmpty.value = false
                }
            }
        }


        const handleTaskAndNavigate = (order) => {
            selectedTask.value = order

            //update rider status to assigned

            store.dispatch('updateRiderStatus', { riderId: store.state.profile.profileId, status: "assigned" })

            router.push({ name: 'riderNavigate', params: { id: order.id } })
        }

        const backToDashboard = () => {
            router.push({ name: 'riderDashboard' })
        }

        onMounted(() => {
            empty()
        }
        )

        watch(getOrders, () => {
            empty()
        })

        return {
            durationColorClass,
            empty,
            selectedTask,
            backToDashboard,
            handleTaskAndNavigate,
            message: "Order Waiting...",
            notShowEmpty,
            getOrders,
            emptyImg: "emptyImg",
        }
    }

}
</script>

<style lang="scss" scoped>
.tasks-wrapper::-webkit-scrollbar {
    display: none;
}

.tasks-wrapper {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

h3 {
    width: 50%;
    background-color: #a8e4ef;
    border-radius: 20px;
    text-align: center;
    text-transform: uppercase;
    color: #303030;
    font-weight: 500;
    font-size: 17px;
    margin: 10px auto 10px auto;

    @media (min-width: 700px) {
        width: 40%;
    }
}

.tasks-wrapper {
    padding-bottom: 20px;
    display: flex;
    max-height: 400px;
    max-width: 400px;
    overflow-y: auto;
    flex-direction: column;

    @media (min-width: 700px) {
        max-width: 700px;
        max-height: 450px;
    }


    .task-wrapper {
        padding: 10px;
        width: 300px;

        @media (min-width: 700px) {

            width: 400px;
        }

        .task {

            border-radius: 10px;
            padding: 4px;
            position: relative;
            margin: auto 10px;
            background-color: #f1f1f1;

            @media (min-width: 700px) {
                border-radius: 15px;
                padding: 10px;

            }

            p:nth-child(1) {
                padding: 3px;
                font-size: 12px;
                font-weight: 500;
                color: white;
                background-color: #01354c;
                width: fit-content;
                border-radius: 5px;
            }

            p:nth-child(2) {
                font-size: 14px;
                text-transform: capitalize;
            }

            .time {
                border-radius: 10px;
                border: none;
                position: absolute;
                padding: 3px;
                top: 5px;
                right: 5px;
                font-size: 10px;


                @media (min-width: 700px) {
                    top: 10px;
                    right: 10px;
                    font-size: 12px;
                }
            }

            button {

                text-transform: capitalize;
                font-size: 12px;
                font-weight: 300;
                width: 70px;
                margin: 10px 30px 10px 5px;

            }

            .rejectBtn {
                background-color: #fb7f88;
                color: #303030;
            }

            .acceptBtn {
                color: #303030;
                background-color: #7af3849d;
            }




        }
    }

}

.no-task {
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

.green {
    background-color: #cbf6f8;
}

.yellow {
    background-color: #fcfc99;
}

.red {
    background-color: #fb6962;
}
</style>