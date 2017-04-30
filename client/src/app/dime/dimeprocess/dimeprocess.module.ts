import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimeprocessListComponent } from './dimeprocess-list/dimeprocess-list.component';
import { DimeprocessDetailComponent } from './dimeprocess-detail/dimeprocess-detail.component';
import { DimeprocessesComponent } from './dimeprocesses/dimeprocesses.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [DimeprocessListComponent, DimeprocessDetailComponent, DimeprocessesComponent]
})
export class DimeprocessModule { }
