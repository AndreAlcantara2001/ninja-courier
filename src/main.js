import { createApp, watch } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import "leaflet/dist/leaflet.css";

import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faNewspaper, faBoxArchive, faSquareCheck } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faNewspaper, faBoxArchive, faSquareCheck)


watch(()=> (store.state.authIsReady), (value) =>{
    if(value){
        createApp(App).use(store).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
    }
})

            



