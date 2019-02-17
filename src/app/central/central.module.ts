import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';
import { FormsModule } from '@angular/forms';

@NgModule( {
	declarations: [
		ConfirmComponent,
		PromptComponent
	],
	imports: [
		CommonModule,
		FormsModule
	],
	entryComponents: [
		ConfirmComponent,
		PromptComponent
	]
} )
export class CentralModule { }
