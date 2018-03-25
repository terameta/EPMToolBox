import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HpdbMemberSelectorComponent } from './hpdb-member-selector/hpdb-member-selector.component';

@NgModule( {
	imports: [
		CommonModule
	],
	entryComponents: [
		HpdbMemberSelectorComponent
	],
	declarations: [HpdbMemberSelectorComponent]
} )
export class SharedModule { }
