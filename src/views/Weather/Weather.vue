<style lang="scss" src="./Weather.vue.scss" scoped></style>

<script lang="ts" src="./Weather.vue.ts"></script>

<template>
	<div>
		<table>
			<tr v-for="device in devices" v-bind:key="device.Id">
				<td class="device-name">
					{{ device.DisplayName }}
				</td>
				<td>
					{{ formatDevice(device) }}
				</td>
			</tr>
		</table>
	</div>
</template>
