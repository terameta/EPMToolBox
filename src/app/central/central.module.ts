import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { FormsModule } from '@angular/forms';
import { TagSelectorComponent } from './tag-selector/tag-selector.component';

@NgModule( {
	declarations: [
		ConfirmComponent,
		PromptComponent,
		TagSelectorComponent
	],
	imports: [
		CommonModule,
		FormsModule
	],
	entryComponents: [
		ConfirmComponent,
		PromptComponent
	],
	exports: [TagSelectorComponent]
} )
export class CentralModule { }
