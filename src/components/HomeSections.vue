<template>
    <div class="section-wrapper">
        <div class="sec safe">
            <h3>Safety</h3><img src="../assets/safe.png" alt="">
            <p>Your Safety is Our Priority</p>

            <ul>
                <li>Secure Packaging</li>
                <li>Contactless Deliveries</li>
                <li>Real-time Tracking</li>
            </ul>
        </div>
        <div class="sec reli">
            <h3>Reliability</h3><img src="../assets/trust.png" alt="">
            <p>Delivering Trust and Reliability</p>

            <ul>
                <li>Proven Track Record</li>
                <li>Efficient Logistics</li>
                <li>Customer Support</li>
            </ul>
        </div>
        <div class="sec fast">
            <h3>Speed</h3><img src="../assets/fast.png" alt="">
            <p>Swift Deliveries for You</p>

            <ul>
                <li>Express Delivery</li>
                <li>Fast Processing</li>
                <li>On-time Arrival</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .section-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: auto;

        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.6);
         @media (min-width: 800px) {
             flex-direction: row;
             padding: 20px;
         }
    }

    .sec{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        background-color: #94f3f7;
        padding: 20px;
        margin: 30px 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.6);
        border-radius: 30px;

        @media (min-width: 700px) {
             max-width: 300px;
             margin: 30px 30px;
         }

         @media (min-width: 1000px) {
             max-width: 400px;
             margin: 30px 50px;
         }

        h3{
            text-transform: uppercase;
            font-size: 23px;
            font-weight: 500;
        }

        img{
            margin: 10px 0;
        }

        p{
            margin: 5px 0;
            letter-spacing: 1px;
            font-size: 15px;
            font-weight: 500;
        }

        ul{
            margin: 10px;
            text-align: center;
            list-style: none;
            li{
                line-height: 1.7;
            }
        }

        span{
            text-align: center;
        }

        img{
            width: 50px;

            @media (min-width: 700px) {
             width: 64px;
         }
        }

    }
</style>