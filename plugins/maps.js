import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
import Geocoder from "@pderas/vue2-geocoder";

Vue.use(Geocoder, {
    defaultCountryCode: '',
    defaultLanguage: 'id',
    defaultMode: 'lat-lng',
    googleMapsApiKey: process.env.MAPS_TOKEN
});
Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.MAPS_TOKEN,
        libraries: "places"
    }
});