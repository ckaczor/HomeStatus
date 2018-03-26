import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';

import { WeatherService, ValueType } from '@/services/WeatherService.ts';
import * as Highcharts from 'highcharts';
import { AxisOptions } from 'highcharts';

enum TimeSpan {
	Last24Hours,
	Day,
	Custom
}

@Component
export default class Weather extends Vue {
	loading: boolean = true;
	ready: boolean = false;

	selectedValueType: ValueType | null = null;
	selectedTimeSpan: TimeSpan = TimeSpan.Last24Hours;
	selectedDate: moment.Moment = moment().startOf('day');

	timeSpans: typeof TimeSpan = TimeSpan;
	timeSpanItems: { [value: number]: string } = {};

	chartConfig: Highcharts.Options | null = null;

	showDateMenu: boolean = false;

	async mounted() {
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});

		this.timeSpanItems[TimeSpan.Last24Hours] = 'Last 24 hours';
		this.timeSpanItems[TimeSpan.Day] = 'Day';

		this.selectedValueType = Number(this.$route.params['type']);
	}

	prepareData(deviceList: any, displayName: string = '', valueName: string, minValue?: number, additive?: boolean) {
		const chartData: any[] = [];

		deviceList.forEach((device: any) => {
			let deviceName;

			if (typeof device.Key === 'string') {
				deviceName = device.Key;
			} else {
				deviceName = displayName === undefined ? device.Key : device.Key[displayName];
			}

			const deviceData = {
				name: deviceName,
				data: [] as any
			};

			let previousValue: number | null = null;

			device.Value.forEach((value: any) => {
				let currentValue: number | null = value[valueName];
				const readTime = moment(value.ReadTime);

				if (minValue && currentValue) {
					if (currentValue < minValue) {
						currentValue = null;
					}
				}

				if (currentValue != null) {
					if (additive && previousValue !== null) {
						currentValue += previousValue;
					}
				}

				deviceData.data.push([readTime.valueOf(), currentValue] as any);

				previousValue = currentValue;
			});

			chartData.push(deviceData);
		});

		return chartData;
	}

	prepareDataByValueType(valueType: ValueType, deviceData: any): any {
		let chartData: any;

		switch (valueType) {
			case ValueType.Temperature:
				chartData = this.prepareData(deviceData, 'DisplayName', 'DegreesF', -40);

				return { chartData: chartData, categoryData: undefined };

			case ValueType.Pressure:
				chartData = this.prepareData(deviceData, 'DisplayName', 'Value', 850);

				return { chartData: chartData, categoryData: undefined };

			case ValueType.Humidity:
				chartData = this.prepareData(deviceData, 'DisplayName', 'Value', 0);

				return { chartData: chartData, categoryData: undefined };

			case ValueType.WindDirection:
				const categoryData: any[] = [];

				chartData = [];

				deviceData.forEach((device: any) => {
					categoryData.push(device.Key);
					chartData.push(device.Value);
				});

				return { chartData: chartData, categoryData: categoryData };

			case ValueType.WindSpeed:
				chartData = this.prepareData(deviceData, undefined, 'Value');

				return { chartData: chartData, categoryData: undefined };

			case ValueType.Rain:
				chartData = this.prepareData(deviceData, 'DisplayName', 'Inches', undefined, true);

				return { chartData: chartData, categoryData: undefined };

			default:
				return null;
		}
	}

	loadChart(chartData: any, categoryData: any) {
		switch (this.selectedValueType) {
			case ValueType.Temperature:
				this.chartConfig = this.createChartConfig(chartData, 'Temperature', 'Degrees F', '°F');

				break;

			case ValueType.Pressure:
				this.chartConfig = this.createChartConfig(chartData, 'Pressure', 'hPa', ' hPa');

				break;

			case ValueType.Humidity:
				this.chartConfig = this.createChartConfig(chartData, 'Humidity', '%', '%');

				break;

			case ValueType.WindDirection:
				this.chartConfig = {
					chart: {
						polar: true,
						type: 'column'
					},

					legend: {
						enabled: false
					},

					xAxis: {
						categories: categoryData,
						tickmarkPlacement: 'on'
					},

					yAxis: {
						labels: {
							enabled: false
						}
					},

					plotOptions: {
						series: {
							shadow: false,
							pointPlacement: 'on',
							animation: false
						},
						column: {
							groupPadding: 0
						}
					},

					title: {
						text: 'Wind Direction'
					},

					series: [{
						type: 'column',
						name: 'Samples',
						data: chartData
					}]
				};

				break;

			case ValueType.WindSpeed:
				this.chartConfig = this.createChartConfig(chartData, 'Wind Speed', 'MPH', ' MPH');

				if (this.chartConfig.yAxis) {
					(this.chartConfig.yAxis as AxisOptions).min = 0;
				}

				break;

			case ValueType.Rain:
				this.chartConfig = this.createChartConfig(chartData, 'Rain', '', '"');

				if (this.chartConfig.yAxis) {
					(this.chartConfig.yAxis as AxisOptions).min = 0;
				}

				break;

			default:
				this.chartConfig = this.createChartConfig(null, '', '', '');

				break;
		}
	}

	createChartConfig(chartData: any, title: string, yAxisTitle: string, tooltipSuffix: string): Highcharts.Options {
		const chartConfig = {
			chart: {
				type: 'line',
				zoomType: 'x'
			},
			tooltip: {
				xDateFormat: '%A %B %e: %I:%M:%S %p',
				valueDecimals: 3,
				valueSuffix: tooltipSuffix
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					minute: '%I:%M %p',
					hour: '%I:%M %p',
					second: '%I:%M:%S %p',
					day: '%I:%M %p'
				}
			},
			yAxis: {
				title: {
					text: null
				},
				labels: {
					formatter(): string {
						return (this as any).value + tooltipSuffix;
					}
				}
			},
			plotOptions: {
				series: {
					marker: {
						enabled: false
					},
					animation: false
				}
			},
			title: {
				text: title,
				y: 18
			},
			series: chartData
		};

		return chartConfig;
	}

	@Watch('$route')
	onRouteChange() {
		this.selectedValueType = Number(this.$route.params['type']);
	}

	@Watch('selectedValueType')
	@Watch('selectedTimeSpan')
	@Watch('selectedDate')
	async refreshChart() {
		if (this.selectedValueType === null) {
			return;
		}

		this.loading = true;

		let start: Date;
		let end: Date;

		if (this.selectedTimeSpan === TimeSpan.Custom) {
			// start = moment('2014-01-01 00:00:00 -05:00').toDate();
			// end = moment('2015-01-01 00:00:00 -05:00').toDate();

			// weatherService.getDailySummary($scope.selectedValueType.id, $scope.selectedDevice.id, start, end).done(data => {
			// 	var preparedData = this.prepareDataByValueType($scope.selectedValueType.id, data);
			// 	this.loadChart($scope, preparedData.chartData, preparedData.categoryData);

			// 	$scope.chartConfig.loading = false;
			// 	$scope.$apply();
			// });
		} else {
			switch (this.selectedTimeSpan) {
				case TimeSpan.Last24Hours: {
					start = moment().subtract(24, 'h').toDate();
					end = moment().toDate();

					break;
				}

				case TimeSpan.Day: {
					start = moment(this.selectedDate).startOf('d').toDate();
					end = moment(this.selectedDate).endOf('d').toDate();

					break;
				}

				default: {
					return;
				}
			}

			const deviceData = await WeatherService.getDeviceHistory(this.selectedValueType, start, end);

			const preparedData = this.prepareDataByValueType(this.selectedValueType, deviceData);
			this.loadChart(preparedData.chartData, preparedData.categoryData);

			this.loading = false;

			this.ready = true;
		}
	}

	handleDateArrowClick(value: number) {
		this.selectedDate.add(value, 'day');

		this.refreshChart();
	}

	isSelectedDateToday(): boolean {
		const isToday = this.selectedDate.startOf('day').isSame(moment().startOf('day'));

		return isToday;
	}

	get selectedDateIsoString(): string {
		return this.selectedDate.format('YYYY-MM-DD');
	}

	set selectedDateIsoString(value: string) {
		this.selectedDate = moment(value);
	}

	getSelectedDateDisplayString(): string {
		return this.selectedDate.format('LL');
	}

	resetToToday() {
		this.selectedDate = moment().startOf('day');
	}
}
