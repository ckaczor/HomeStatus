import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import moment from 'moment';
import regression from 'regression';

import { WeatherService, ValueType, HistoryEntry } from '@/services/WeatherService.ts';

@Component
export default class PressureTrend extends Vue {
	pressureDifference: number | null = null;

	async mounted() {
		this.update();

		setInterval(this.update, 60000);
	}

	async update() {
		const end: moment.Moment = moment();
		const start: moment.Moment = moment(end).subtract(3, 'hours');

		const weatherData = await WeatherService.getDeviceHistory(ValueType.Pressure, start.toDate(), end.toDate());

		if (!weatherData) {
			return;
		}

		const points: Array<Array<number>> = [];

		weatherData[0].Value.forEach((historyEntry: HistoryEntry) => {
			if (historyEntry.Value >= 900 && historyEntry.Value <= 1050) {
				const point = [moment(historyEntry.ReadTime).unix(), historyEntry.Value];
				points.push(point);
			}
		});

		const result = regression.linear(points, { precision: 10 });

		const regressionPoints = result.points;

		this.pressureDifference = regressionPoints[regressionPoints.length - 1][1] - regressionPoints[0][1];
	}

	style(): string {
		let degrees: number = 0;

		if (!this.pressureDifference) {
			degrees = 90;
		} else if (Math.abs(this.pressureDifference) <= 1.0) {
			degrees = 90;
		} else if (this.pressureDifference > 1.0 && this.pressureDifference <= 2.0) {
			degrees = 60;
		} else if (this.pressureDifference > 2.0) {
			degrees = 45;
		} else if (this.pressureDifference < -1.0 && this.pressureDifference >= -2.0) {
			degrees = 115;
		} else if (this.pressureDifference < -2.0) {
			degrees = 150;
		}

		return `transform: rotate(${degrees}deg)`;
	}
}
