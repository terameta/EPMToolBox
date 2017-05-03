import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { DimeModule } from 'app/dime/dime.module';
// import { DimeComponent } from 'app/dime/dime/dime.component';
import { WelcomeComponent } from 'app/welcome/welcome.component';

const appRoutes: Routes = [
	{ path: '', component: WelcomeComponent }
];

@NgModule({
	declarations: [
		AppComponent,
		WelcomeComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		DimeModule,
		RouterModule.forRoot(appRoutes),
		ToastrModule.forRoot(),
		BrowserAnimationsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
