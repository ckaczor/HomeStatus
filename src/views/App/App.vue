<style lang="scss" src="./App.vue.scss"></style>

<script lang="ts" src="./App.vue.ts"></script>

<template>
	<v-app id="inspire" light>
		<v-navigation-drawer clipped fixed v-model="drawer" app width="250">
			<v-list dense>
				<span v-for="item in items" v-bind:key="item.title">
					<v-list-group v-if="item.items" :value="item.active" v-model="item.expanded">
						<v-list-tile slot="item" :to="item.to">
							<v-list-tile-action>
								<v-icon>{{ item.action }}</v-icon>
							</v-list-tile-action>
							<v-list-tile-content>
								<v-list-tile-title>{{ item.title }}</v-list-tile-title>
							</v-list-tile-content>
							<v-list-tile-action>
								<v-icon>keyboard_arrow_down</v-icon>
							</v-list-tile-action>
						</v-list-tile>
						<v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" :to="subItem.to">
							<v-list-tile-content>
								<v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list-group>
					<v-list-tile v-else slot="item" :to="item.to" exact>
						<v-list-tile-action>
							<v-icon>{{ item.action }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{ item.title }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</span>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar app fixed clipped-left color="indigo" dark dense flat>
			<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
			<v-toolbar-title>Home Status</v-toolbar-title>
		</v-toolbar>
		<v-content>
			<v-container fluid fill-height>
				<v-layout>
					<router-view></router-view>
				</v-layout>
			</v-container>
		</v-content>
	</v-app>
</template>
