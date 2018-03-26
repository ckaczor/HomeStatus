<style lang="scss" src="./Laundry.vue.scss" scoped></style>

<script lang="ts" src="./Laundry.vue.ts"></script>

<template>
	<div>
		<table>
			<tr>
				<td class="device-name">
					Washer
				</td>
				<td :class="laundryStatus.washer.toString()">
					{{ laundryStatus.washer ? 'On' : 'Off' }}
				</td>
			</tr>
			<tr>
				<td class="device-name">
					Dryer
				</td>
				<td :class="laundryStatus.dryer.toString()">
					{{ laundryStatus.dryer ? 'On' : 'Off' }}
				</td>
			</tr>
		</table>
	</div>
</template>
