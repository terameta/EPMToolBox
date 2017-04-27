import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ProcessComponent } from './process/process.component';
import { ProcessesComponent } from './processes/processes.component';
import { TopmenuComponent } from './topmenu/topmenu.component';

@NgModule({
	declarations: [
		AppComponent,
		ProcessComponent,
		ProcessesComponent,
		TopmenuComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
