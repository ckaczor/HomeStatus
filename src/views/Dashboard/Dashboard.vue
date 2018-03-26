<style lang="scss" src="./Dashboard.vue.scss" scoped></style>

<script lang="ts" src="./Dashboard.vue.ts"></script>

<style lang="scss" src="./Grid.scss"></style>

<template>
	<div id="dashboard-container" v-if="ready">
		<v-toolbar height="42" flat>
			<v-spacer></v-spacer>
			<v-btn small outline color="grey darken-1" @click="startEdit()">
				<v-icon left class="button-icon">edit</v-icon>
				Edit
			</v-btn>
			<v-btn small outline color="grey darken-1" @click="toggleLocked()">
				<v-icon left class="button-icon">lock</v-icon>
				{{ locked ? 'Unlock' : 'Lock' }}
			</v-btn>
		</v-toolbar>
		<v-dialog class="dashboard-panels-dialog" v-model="editing" persistent width="50%" scrollable>
			<v-card>
				<v-card-title class="indigo dashboard-panels-header">
					<span class="title white--text">
						Dashboard Panels
					</span>
					<v-spacer></v-spacer>
					<v-btn icon="icon" v-on:click="editing = false" class="white--text">
						<v-icon>close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text class="dashboard-panels-text">
					<div class="dashboard-panels-item" v-for="panel in allPanels" :key="panel.componentName">
						<div class="dashboard-panels-item-name">
							{{ panel.name }}
						</div>
						<div>
							{{ panel.description }}
						</div>
						<v-btn class="dashboard-panels-item-button" color="primary" small white--text @click="addPanel(panel)" v-if="!isPanelAdded(panel)">
							Add
						</v-btn>
						<v-btn class="dashboard-panels-item-button" color="primary" small white--text @click="removePanel(panel)" v-if="isPanelAdded(panel)">
							Remove
						</v-btn>
					</div>
				</v-card-text>
			</v-card>
		</v-dialog>

		<grid-layout :layout="panels" :col-num="100" :row-height="10" :is-draggable="!locked" :is-resizable="!locked" :vertical-compact="false" :margin="[10, 10]" :use-css-transforms="true" @layout-updated="savePanels">
			<grid-item v-for="panel in panels" :key="panel.i" :x="panel.x" :y="panel.y" :w="panel.w" :h="panel.h" :i="panel.i">
				<v-card flat class="dashboard-panel">
					<v-card-title class="indigo dashboard-panel-header">
						<span class="title white--text">
							{{ panel.name }}
						</span>
						<v-spacer></v-spacer>
						<v-btn v-show="!locked" small icon title="Remove" @click="removePanel(panel)" dark>
							<v-icon>close</v-icon>
						</v-btn>
					</v-card-title>
					<v-card-text class="dashboard-panel-text">
						<component :is="panel.componentName"></component>
					</v-card-text>
				</v-card>
			</grid-item>
		</grid-layout>
	</div>
</template>
