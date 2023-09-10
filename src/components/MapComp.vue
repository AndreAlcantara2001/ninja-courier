<template>
    <div id="map"></div>
</template>
  
<script>


import L from 'leaflet'


export default {
    name: "MapComponent",
    data() {
        return {
            map: null,
            markers: [],
            pickupLocation: null,
            destinationLocation: null,
        };
    },
    methods: {
        setupLeafletMap() {
            this.map = L.map("map").setView([16.8409, 96.1735], 14);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
            }).addTo(this.map);

            // Add click event to the map
            this.map.on("click", this.addMarker);
        },
        addMarker(e) {
            // Check if there are already two markers
            if (this.markers.length >= 2) {
                return;
            }

            const pickupIcon = L.divIcon({
                className: 'marker-icon',
                html: '<i class="material-icons">place</i><div class="marker-label">Pickup</div>'
            })

            const destinationIcon = L.divIcon({
                className: 'marker-icon',
                html: '<i class="material-icons">place</i><div class="marker-label">Destination</div>'
            })

            // Create a new marker and add it to the map and markers array // icon: customeIcon,
            const marker = L.marker(e.latlng, { draggable: true }).addTo(this.map);
            this.markers.push(marker);

            marker.on('moveend', (event) => {
                const markerIndex = this.markers.indexOf(event.target)
                if (markerIndex === 0) {
                    this.pickupLocation = event.target.getLatLng();
                    console.log("pickup location: ", this.pickupLocation)
                } else if (markerIndex === 1) {
                    this.destinationLocation = event.target.getLatLng();
                    console.log("destination location: ", this.destinationLocation);
                }
            })


            // Check if it's a pickup or destination marker
            if (!this.pickupLocation) {

                this.pickupLocation = e.latlng;
                console.log("pickup location: ", this.pickupLocation)
                marker.setIcon(pickupIcon);

            } else {

                this.destinationLocation = e.latlng;
                console.log("destination location: ", this.destinationLocation)
                marker.setIcon(destinationIcon);
            }
        },
        removeMarkers() {
            // Remove all markers from the map and clear the markers array
            this.markers.forEach((marker) => {
                this.map.removeLayer(marker);
            });
            this.markers = [];
        },
        resetMap() {
            // Remove markers and reset pickup and destination locations
            this.removeMarkers();
            this.pickupLocation = null;
            this.destinationLocation = null;
        },
    },
    mounted() {
        this.setupLeafletMap();
    },

    watch: {
        pickupLocation(newValue) {
            this.$store.dispatch('getAddressOflocation', { lat: newValue.lat, lng: newValue.lng, locationType: 'p' })
            if (this.destinationLocation) {
                this.$store.dispatch('getDistance', { pLat: newValue.lat, pLng: newValue.lng, dLat: this.destinationLocation.lat, dLng: this.destinationLocation.lng })
            }
        },
        destinationLocation(newValue) {
            this.$store.dispatch('getAddressOflocation', { lat: newValue.lat, lng: newValue.lng, locationType: 'd' })
            if (this.pickupLocation) {
                this.$store.dispatch('getDistance', { pLat: this.pickupLocation.lat, pLng: this.pickupLocation.lng, dLat: newValue.lat, dLng: newValue.lng })
            }
        }
    }
};
</script>
  
<style lang="scss" scoped>
#map {
    height: 300px;
    width: 100%;
}



.marker-icon {
    background-color: #303030;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

}

.marker-label {
    color: #303030;
    font-weight: bold;
    font-size: 12px;
}

/*  */
</style>
  