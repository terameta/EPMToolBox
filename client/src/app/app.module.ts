import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { DimeModule } from './dime/dime.module';
import { WelcomeModule } from './welcome/welcome.module';
import { AuthService } from './welcome/auth.service';
import { AuthGuard } from './welcome/auth-guard.service';
import { AuthModule } from './welcome/auth.module';
import { AccessManagementModule } from './accessmanagement/accessmanagement.module';
import { EndUserModule } from './enduser/enduser.module';

// Dime Services
import { DimeEnvironmentService } from './dime/dimeenvironment/dimeenvironment.service';
import { DimeStreamService } from './dime/dimestream/dimestream.service';
import { DimeMapService } from './dime/dimemap/dimemap.service';
import { DimeMatrixService } from './dime/dimematrix/dimematrix.service';
import { DimeProcessService } from './dime/dimeprocess/dimeprocess.service';
import { DimeScheduleService } from './dime/dimeschedule/dimeschedule.service';

// Access Management Services
import { AcmServerService } from './accessmanagement/acmserver/acmserver.service';
import { AcmUserService } from './accessmanagement/acmuser/acmuser.service';

// End User Services
import { EndUserService } from './enduser/enduser.service';

const appRoutes: Routes = [
	// { path: '', component: AppComponent },
	{ path: '', pathMatch: 'full', redirectTo: 'welcome' }
];

@NgModule( {
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		WelcomeModule,
		DimeModule,
		AccessManagementModule,
		EndUserModule,
		RouterModule.forRoot( appRoutes ),
		ToastrModule.forRoot(),
		BrowserAnimationsModule,
		AuthModule
	],
	providers: [
		AuthGuard,
		AuthService,
		DimeEnvironmentService,
		DimeStreamService,
		DimeMapService,
		DimeMatrixService,
		DimeProcessService,
		DimeScheduleService,
		AcmServerService,
		AcmUserService,
		EndUserService
	],
	bootstrap: [AppComponent]
} )
export class AppModule { }
