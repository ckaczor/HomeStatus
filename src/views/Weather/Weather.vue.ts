import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { WeatherService, WeatherDevice, ValueType, TemperatureReading, RainReading, WindDirectionReading, WeatherDeviceValue } from '@/services/WeatherService.ts';

@Component
export default class Weather extends Vue {
	private deviceMap = WeatherService.deviceMap;

	formatDevice(device: WeatherDevice): string {
		let valueDisplay: string = '';

		for (const value of Object.values(device.Values)) {

			switch (value.ValueType) {
				case ValueType.Temperature:
					const tempReading = value.Current as TemperatureReading;

					valueDisplay += ' ' + tempReading.DegreesF.toFixed(2) + '°F';

					break;

				case ValueType.Humidity:
					valueDisplay += ' ' + value.Current.Value.toFixed(2) + '%';

					break;

				case ValueType.Pressure:
					valueDisplay += ' ' + value.Current.Value.toFixed(2) + ' hPa';

					break;

				case ValueType.Rain:
					const rainReading = value.Current as RainReading;

					valueDisplay += ' ' + rainReading.Inches.toFixed(2) + '"';

					break;

				case ValueType.WindSpeed:
					valueDisplay += ' ' + value.Current.Value.toFixed(2) + ' MPH';

					break;

				case ValueType.WindDirection:
					const windReading = value.Current as WindDirectionReading;

					valueDisplay += ' ' + windReading.WindDirectionString;

					break;
			}
		}

		return valueDisplay;
	}

	get devices(): Array<WeatherDevice> {
		return Object.values(this.deviceMap).sort((a, b) => a.Type - b.Type);
	}
}
