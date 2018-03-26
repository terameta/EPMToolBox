import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HpdbMemberSelectorComponent } from './hpdb-member-selector/hpdb-member-selector.component';
import { TreeModule } from 'angular-tree-component';

@NgModule( {
	imports: [
		CommonModule,
		TreeModule
	],
	entryComponents: [
		HpdbMemberSelectorComponent
	],
	declarations: [HpdbMemberSelectorComponent]
} )
export class SharedModule { }
