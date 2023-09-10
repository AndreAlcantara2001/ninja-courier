<template>
    <div class="mapRoute-wrapper">

        <div class="map-wrapper">
            <div id="map"></div>
            <p>{{ isPicking }}</p>
        </div>
        <div class="route-wrapper">
            <div id="route-summary"></div>
            <div v-if="isRider" id="instructions">
                <h2>Route Instructions</h2>
                <div class="instructions-wrapper">
                    <div v-for="(instruction, index) in instructions" :key="index">
                        <p>{{ instruction }}</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
  
<script>
import packageIcon from '../assets/packageIcon.svg'
import riderIcon from '../assets/riderIcon.svg'
import locationMarker from '../assets/locationMarker.svg'

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from 'leaflet';
import 'leaflet-routing-machine';


export default {
    name: "MapComponent",

    props: [
        "isPicking",
        "rideToLocation",
        "riderLocation",
        "isRider",
    ],

    data() {
        return {
            map: null,
            routingControl: null,
            instructions: [],
        };
    },


    methods: {
        setupLeafletMap() {
            this.map = L.map("map").setView([this.riderLocation.lat, this.riderLocation.lng], 14);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,minZoom: 14,
            }).addTo(this.map);

            const riderMarker = L.icon({
                iconUrl: riderIcon,
                iconSize: [34, 40]
            })

            const packageMarker = L.icon({
                iconUrl: this.isPicking === "picking up" ? packageIcon : locationMarker,
                iconSize: [30, 40]
            })

            if (this.riderLocation && this.rideToLocation) {
                console.log("Map route riderLocation: ", this.riderLocation)

                this.routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(this.riderLocation.lat, this.riderLocation.lng), // Starting point
                        L.latLng(this.rideToLocation.lat, this.rideToLocation.lng), // Destination point
                    ],
                    routeWhileDragging: false,
                    show: false,
                    // eslint-disable-next-line
                    createMarker: function (i, waypoint, n) {
                        let markerIcon = i === 0 ? riderMarker : packageMarker
                        return L.marker(waypoint.latLng, {
                            draggable: false,
                            icon: markerIcon,
                        });
                    },
                }).addTo(this.map);

                this.routingControl.on("routesfound", (e) => {
                    const routes = e.routes;
                    const summary = routes[0].summary;
                    const instructions = routes[0].instructions;

                    console.log("routes: ", routes)

                    // Update the instructions array with the new instructions
                    this.instructions = instructions.map((instruction) => instruction.text);

                    // Display the route summary
                    const routeSummary = document.getElementById("route-summary");
                    routeSummary.innerHTML = `Distance: ${(summary.totalDistance / 1000).toFixed(1)} km, Duration: ${(summary.totalTime * 3 / 60).toFixed(1)} mins`;
                });
            }
        },

        updateMap(){
            if(this.map && this.routingControl){
                this.routingControl.getPlan().setWaypoints([]);
                this.routingControl.getPlan().setWaypoints([
                    L.latLng(this.riderLocation.lat, this.riderLocation.lng),
                    L.latLng(this.rideToLocation.lat, this.rideToLocation.lng),
                ])
                this.routingControl.route();
            }
        }
    },
    mounted() {
        this.setupLeafletMap();
        this.$nextTick(() => {
            const routingControlButton = document.querySelector('.leaflet-routing-container')
            if (routingControlButton) {
                routingControlButton.style.display = 'none'
            }
        })

    },

    watch: {
        riderLocation: {
            // eslint-disable-next-line
            handler(newLocation){
                this.updateMap()
            },
            deep: true,
        },
        rideToLocation: {
            // eslint-disable-next-line
            handler(newLocation) {
                this.updateMap()
            },
            deep: true,
        }
    }
};
</script>
  
<style lang="scss" scoped>
.map-wrapper {
    position: relative;

    #map {

        height: 300px;
        width: 100%;
    }

    p {
        position: absolute;
        top: 5px;
        right: 5px;
        color: #303030;
        background-color: white;
        border-radius: 10px;
        padding: 5px;
        font-size: 12px;
        font-weight: 500;
        text-transform: capitalize;
    }
}

#instructions {
    margin-top: 10px;
}

.mapRoute-wrapper {
    display: flex;
    flex-direction: column;

    @media (min-width: 700px) {
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .map-wrapper {
        margin: auto 20px;

        #map {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.6);

            border-end-end-radius: 10px;

            border-end-start-radius: 10px;

            z-index: 0;

            @media (min-width: 700px) {
                width: 500px;
                height: 420px;
            }
        }
    }

    .route-wrapper {

        display: flex;
        flex-direction: column;

        @media (min-width: 700px) {
            height: 400px;
        }



        #route-summary {
            margin: 10px auto;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            color: white;
            background-color: #303030;
            border-radius: 5px;
            padding: 5px;
            width: fit-content;

            @media (min-width: 700px) {
                height: fit-content;
                display: inline;
            }
        }

        #instructions {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            h2 {
                text-align: center;
                font-size: 21px;
                font-weight: 500;
                color: #303030;
                width: fit-content;
                border-radius: 5px;
                padding: 5px;
                background-color: #f1f1f1;
            }

            .instructions-wrapper::-webkit-scrollbar {
                display: none;
            }

            .instructions-wrapper {
                height: 300px;
                overflow-y: scroll;
                padding: 14px;

                -ms-overflow-style: none;
                /* IE and Edge */
                scrollbar-width: none;
                /* Firefox */

                margin: 10px 0px;

                border-radius: 10px;

                color: white;

                background-color: #303030;

                p {
                    text-align: left;
                    margin: 10px auto;
                    border-bottom: 1px solid rgba(241, 241, 241, 0.1);
                }
            }
        }
    }
}
</style>
  