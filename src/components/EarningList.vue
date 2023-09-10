<template>
    <div>
        <h3>Earnings</h3>
        <div class="earnings-wrapper" v-if="notEmpty">

            <div class="earning-wrapper" v-for="earning in earningsList" :key="earning.orderId">
                <div class="earning">
                    <p>#{{ earning.orderId }}</p>
                    <p>distance: {{ earning.distance }} km</p>
                    <p>{{ earning.destinationAddress }}</p>

                    <p>Earning: <span>{{ earning.earning }} mmk</span></p>

                    <i class="material-icons mark">check_circle</i>

                </div>
            </div>
        </div>

        <div class="no-earning" v-else>
            <EmptyComp :message="message" />
        </div>
    </div>
</template>

<script>
import EmptyComp from './EmptyComp.vue';


import { ref } from 'vue';
export default {

    props: [
        "earnings",
    ],

    components: {
        EmptyComp,
    },

    setup(props) {

        const earningsList = ref(props.earnings)

        const selectedEarning = ref(null)

        const notEmpty = () => {
            if (earningsList.value.length >= 0) {
                return true
            } else {
                return false
            }
        }

        const handleEarning = (earning) => {
            selectedEarning.value = earning
        }


        return {
            earningsList,
            notEmpty,
            selectedEarning,
            handleEarning,
            message: "No Earning...",
        }
    }

}
</script>

<style lang="scss" scoped>
.earnings-wrapper::-webkit-scrollbar {
    display: none;
}

.earnings-wrapper {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

h3 {
    width: 50%;
    background-color: #fcffc6;
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

.earnings-wrapper {
    display: flex;

    border-radius: 10px;

    padding-bottom: 20px;

    background-color: #303030;
    overflow-y: scroll;

    max-width: 400px;
    max-height: 400px;
    flex-direction: column;

    @media (min-width: 700px) {
        max-width: 700px;
    }



    .earning-wrapper {
        padding: 10px 5px 10px 5px;
        width: 300px;

        @media (min-width: 700px) {

            width: 400px;
        }

        .earning {

            border-radius: 10px;
            padding: 4px;
            position: relative;
            margin: auto 15px;
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
                font-size: 15px;
                text-transform: uppercase;
            }

            p:nth-child(3) {
                font-size: 12px;
                text-transform: capitalize;

                @media (min-width: 700px) {
                    font-size: 15px;
                }
            }

            p:nth-child(4){
                font-size: 15px;
                font-weight: 500;

                span{
                    font-size: 15px;
                    font-weight: 600;
                    background-color: #e8e9c9;
                    border-radius: 5px;
                    padding: 2px;
                    color: #228d57;
                }
            }

            .mark {
                
                //border: 1px solid #303030;
                position: absolute;
                padding: 3px;
                top: 5px;
                right: 5px;
                font-size: 15px;

                color: #039487;
                cursor: pointer;

                @media (min-width: 700px) {
                    top: 5px;
                    right: 5px;
                    font-size: 20px;
                }
            }

        }
    }



}

.no-earning {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 400px;
    height: 100%;
}
</style>