import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { LaundryService, LaundryStatus } from '@/services/LaundryService.ts';

@Component
export default class Laundry extends Vue {
	laundryStatus: LaundryStatus = LaundryService.status;
}
