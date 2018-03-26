import Vue from 'vue';
import { hubConnection, Connection, Proxy } from 'signalr-no-jquery';
import moment from 'moment';

export class WeatherDeviceReading {
	Value: number;
	ReadTime: string;
}

export class WindDirectionReading extends WeatherDeviceReading {
	WindDirectionString: string;
}

export class RainReading extends WeatherDeviceReading {
	Inches: number;
}

export class TemperatureReading extends WeatherDeviceReading {
	DegreesF: number;
}

export class WeatherDeviceValue {
	ValueType: ValueType;
	Current: WeatherDeviceReading;
}

export class WeatherDevice {
	Address: string;
	DisplayName: string;
	Errors: number;
	Id: number;
	Indoor: boolean;
	LastRead: string;
	Operations: number;
	RefreshFrequency: number;
	SupportedValues: Array<ValueType>;
	Type: number;
	Values: { [valueName: string]: WeatherDeviceValue };
}

export enum ValueType {
	Temperature,
	Pressure,
	Humidity,
	WindSpeed,
	WindDirection,
	Rain
}

export type HistoryEntry = {
	ValueType: ValueType;
	Value: number;
	ReadTime: string;
};

export type HistoryResult = { Key: WeatherDevice, Value: Array<HistoryEntry> };

export class WeatherService {
	static deviceMap: { [deviceId: number]: WeatherDevice } = {};

	private static connection: Connection;
	private static proxy: Proxy;

	static async start(server: string, port: number) {
		this.connection = hubConnection(`http://${server}:${port}/signalr/`);

		this.proxy = this.connection.createHubProxy('weatherHub');

		await this.connection.start();

		this.proxy.on('deviceRefreshed', (updatedDevice: WeatherDevice) => {
			Vue.set(this.deviceMap, updatedDevice.Id.toString(), updatedDevice);
		});

		const devices = await this.proxy.invoke('getDevices');

		devices.forEach((device: WeatherDevice) => {
			Vue.set(this.deviceMap, device.Id.toString(), device);
		});
	}

	static async getDeviceHistory(valueType: ValueType, start: Date, end: Date): Promise<any[] | null> {
		const startString = moment(start).toISOString();
		const endString = moment(end).toISOString();

		if (valueType === ValueType.WindDirection) {
			const data = await this.proxy.invoke('getWindDirectionHistory', startString, endString);

			return data;
		} else if (valueType === ValueType.WindSpeed) {
			const data = await this.proxy.invoke('getWindSpeedHistory', 5, startString, endString);

			return data;
		} else {
			const data = await this.proxy.invoke('getGenericHistory', valueType, startString, endString);

			return data;
		}
	}
}
