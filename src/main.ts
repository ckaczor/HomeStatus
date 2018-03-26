import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

import Highcharts from 'highcharts';
import VueHighcharts from 'vue-highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import highchartsExport from 'highcharts/modules/exporting';

highchartsMore(Highcharts);
highchartsExport(Highcharts);

Vue.use(VueHighcharts, { Highcharts });

import router from './router';

import App from './views/App/App.vue';

import { WeatherService } from '@/services/WeatherService';
import { LaundryService } from '@/services/LaundryService';

import { config } from '@/config/Config';

Promise.all([
	WeatherService.start(config.weather.host || localStorage['host'] || window.location.host, config.weather.port),
	LaundryService.start(config.laundry.host || localStorage['host'] || window.location.host, config.laundry.port)
]).then(() => {
	new Vue({
		el: '#app',
		router,
		template: '<App/>',
		components: { App }
	});
});
