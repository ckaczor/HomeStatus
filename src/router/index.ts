import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Dashboard from '@/views/Dashboard/Dashboard.vue';
import Laundry from '@/views/Laundry/Laundry.vue';
import Weather from '@/views/Weather/Weather.vue';
import WeatherHistory from '@/views/WeatherHistory/WeatherHistory.vue';

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Dashboard',
			component: Dashboard
		},
		{
			path: '/laundry',
			name: 'Laundry',
			component: Laundry
		},
		{
			path: '/weather',
			name: 'Weather',
			component: Weather
		},
		{
			path: '/weather-history/:type',
			name: 'WeatherHistory',
			component: WeatherHistory
		}
	]
});

