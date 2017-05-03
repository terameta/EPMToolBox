import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DimeProcessService } from './dimeprocess.service';
import { DimeprocessListComponent } from './dimeprocess-list/dimeprocess-list.component';
import { DimeprocessDetailComponent } from './dimeprocess-detail/dimeprocess-detail.component';
import { DimeprocessesComponent } from './dimeprocesses/dimeprocesses.component';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		DimeProcessService
	],
	declarations: [
		DimeprocessListComponent,
		DimeprocessDetailComponent,
		DimeprocessesComponent
	]
})
export class DimeprocessModule { }
