import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import VueGridLayout from 'vue-grid-layout';

import Laundry from '@/views/Laundry/Laundry.vue';
import Weather from '@/views/Weather/Weather.vue';
import PressureTrend from '@/components/PressureTrend/PressureTrend.vue';

Vue.component('GridLayout', VueGridLayout.GridLayout);
Vue.component('GridItem', VueGridLayout.GridItem);

Vue.component('Laundry', Laundry);
Vue.component('Weather', Weather);
Vue.component('PressureTrend', PressureTrend);

class DashboardPanel {
	name: string;
	componentName: string;
	description: string;

	defaultSize: { height: number, width: number };
}

class DashboardPanelLayout {
	x: number;
	y: number;
	w: number;
	h: number;
	i: string;

	name: string;
	componentName: string;
}

@Component
export default class Dashboard extends Vue {
	ready: boolean = false;

	locked: boolean = true;
	editing: boolean = false;

	panels: Array<DashboardPanelLayout> = [];

	allPanels: Array<DashboardPanel> = [
		{ name: 'Weather', componentName: 'Weather', description: 'Text summary of current weather conditions', defaultSize: { height: 10, width: 30 } },
		{ name: 'Laundry', componentName: 'Laundry', description: 'Current washer and dryer status', defaultSize: { height: 6, width: 15 } },
		{ name: 'Pressure Trend', componentName: 'PressureTrend', description: 'An arrow showing the barometric pressure trend for the last three hours.', defaultSize: { height: 8, width: 20 } }
	];

	mounted() {
		const savedPanels = localStorage.getItem('panels');

		if (savedPanels) {
			this.panels = JSON.parse(savedPanels);
		} else {
			this.allPanels.forEach((panel) => this.addPanel(panel));
		}

		this.ready = true;
	}

	toggleLocked() {
		this.locked = !this.locked;
	}

	startEdit() {
		this.editing = true;
	}

	savePanels() {
		const savedPanels = JSON.stringify(this.panels);

		localStorage.setItem('panels', savedPanels);
	}

	isPanelAdded(panel: DashboardPanel) {
		return this.panels.find((currentPanel) => currentPanel.componentName === panel.componentName);
	}

	addPanel(panel: DashboardPanel) {
		this.panels.push({
			x: 0,
			y: 0,
			h: panel.defaultSize.height,
			w: panel.defaultSize.width,
			i: this.panels.length.toString(),
			name: panel.name,
			componentName: panel.componentName,
		});

		this.savePanels();
	}

	removePanel(panel: DashboardPanel) {
		const index = this.panels.findIndex((currentPanel) => currentPanel.componentName === panel.componentName);

		this.panels.splice(index, 1);

		this.savePanels();
	}
}
