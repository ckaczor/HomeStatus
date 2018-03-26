import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ValueType, WeatherService } from '@/services/WeatherService';
import { LaundryService } from '@/services/LaundryService';

@Component
export default class App extends Vue {
	drawer: boolean | null = null;

	items: any = [
		{
			action: 'home',
			title: 'Dashboard',
			to: '/'
		},
		{
			action: 'local_laundry_service',
			title: 'Laundry',
			to: '/laundry'
		},
		{
			action: 'cloud',
			title: 'Weather',
			to: '/weather'
		},
		{
			action: 'multiline_chart',
			title: 'Weather Charts',
			expanded: false,
			route: 'WeatherHistory',
			items: [
				{
					title: 'Temperature',
					to: '/weather-history/' + ValueType.Temperature
				},
				{
					title: 'Pressure',
					to: '/weather-history/' + ValueType.Pressure
				},
				{
					title: 'Humidity',
					to: '/weather-history/' + ValueType.Humidity
				},
				{
					title: 'Wind direction',
					to: '/weather-history/' + ValueType.WindDirection
				},
				{
					title: 'Wind speed',
					to: '/weather-history/' + ValueType.WindSpeed
				},
				{
					title: 'Rain',
					to: '/weather-history/' + ValueType.Rain
				}
			]
		}
	];

	async mounted() {
		this.items.forEach((item: any) => {
			if (item.route) {
				item.expanded = this.$route.name === item.route;
			}
		});
	}
}
