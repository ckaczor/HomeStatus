<style lang="scss" src="./WeatherHistory.vue.scss" scoped></style>

<script lang="ts" src="./WeatherHistory.vue.ts"></script>

<style lang="scss" src="./Chart.scss"></style>

<template>
	<div class="view-container">
		<div class="view-loading-overlay" v-if="loading">
			<v-progress-circular indeterminate class="view-loading-progress indigo--text" size="64" />
		</div>

		<div v-if="ready" id="chart-container">
			<v-toolbar height="42" flat>
				<v-menu offset-y>
					<v-btn small outline slot="activator" color="grey darken-1">
						{{ timeSpanItems[selectedTimeSpan] }}
					</v-btn>
					<v-list dense>
						<v-list-tile v-for="(text, value) in timeSpanItems" :key="value" @click="selectedTimeSpan = Number(value)">
							<v-list-tile-title>{{ text }}</v-list-tile-title>
						</v-list-tile>
					</v-list>
				</v-menu>

				<v-btn v-show="selectedTimeSpan === timeSpans.Day" small outline color="grey darken-1" @click="handleDateArrowClick(-1)">
					<v-icon>skip_previous</v-icon>
				</v-btn>
				<v-menu v-show="selectedTimeSpan === timeSpans.Day" lazy :close-on-content-click="false" v-model="showDateMenu" offset-y full-width>
					<v-btn id="date-button" small outline slot="activator" color="grey darken-1">
						{{ getSelectedDateDisplayString() }}
					</v-btn>

					<v-date-picker v-model="selectedDateIsoString" no-title autosave></v-date-picker>
				</v-menu>
				<v-btn v-show="selectedTimeSpan === timeSpans.Day && !isSelectedDateToday()" small outline color="grey darken-1" @click="handleDateArrowClick(1)">
					<v-icon>skip_next</v-icon>
				</v-btn>

				<v-btn v-show="selectedTimeSpan === timeSpans.Day && !isSelectedDateToday()" small outline color="grey darken-1" @click="resetToToday">
					Today
				</v-btn>
			</v-toolbar>

			<highcharts id="chart" :options="chartConfig" ref="highcharts"></highcharts>
		</div>
	</div>
</template>
