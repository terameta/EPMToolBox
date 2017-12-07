import { DimeMatrixEffects } from './dime/dimematrix/dimematrix.ngrx';
import { DimeMatrixBackend } from './dime/dimematrix/dimematrix.backend';
import { DimeStreamEffects } from './dime/dimestream/dimestream.ngrx';
import { DimeStreamBackend } from './dime/dimestream/dimestream.backend';
import { DimeEnvironmentEffects } from './dime/dimeenvironment/dimeenvironment.ngrx';
import { HttpClientModule } from '@angular/common/http';
import { DimeAsyncProcessBackend } from './dime/dimeasyncprocess/dimeasyncprocess.backend';
import { DimeAsyncProcessEffects } from './dime/dimeasyncprocess/dimeasyncprocess.ngrx';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { DimeModule } from './dime/dime.module';
import { WelcomeModule } from './welcome/welcome.module';
import { AuthService } from './welcome/auth.service';
import { AuthGuard } from './welcome/auth-guard.service';
import { AuthModule } from './welcome/auth.module';
import { AccessManagementModule } from './accessmanagement/accessmanagement.module';
import { EndUserModule } from './enduser/enduser.module';

// Dime Services & Backends
import { DimeCredentialService } from './dime/dimecredential/dimecredential.service';
import { DimeCredentialBackend } from './dime/dimecredential/dimecredential.backend';
import { DimeEnvironmentService } from './dime/dimeenvironment/dimeenvironment.service';
import { DimeEnvironmentBackend } from './dime/dimeenvironment/dimeenvironment.backend';
import { DimeStreamService } from './dime/dimestream/dimestream.service';
import { DimeMapService } from './dime/dimemap/dimemap.service';
import { DimeMatrixService } from './dime/dimematrix/dimematrix.service';
import { DimeProcessService } from './dime/dimeprocess/dimeprocess.service';
import { DimeScheduleService } from './dime/dimeschedule/dimeschedule.service';
import { DimeAsyncProcessService } from 'app/dime/dimeasyncprocess/dimeasyncprocess.service';

// Access Management Services
import { AcmServerService } from './accessmanagement/acmserver/acmserver.service';
import { AcmUserService } from './accessmanagement/acmuser/acmuser.service';

// End User Services
import { EndUserService } from './enduser/enduser.service';
import { reducers, appInitialState, RouteEffects } from 'app/ngstore/models';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DimeCredentialEffects } from 'app/dime/dimecredential/dimecredential.ngrx';
import { DimeStatusEffects } from 'app/ngstore/applicationstatus';
import { DimeTagEffects } from 'app/dime/dimetag/dimetag.ngrx';
import { DimeTagBackend } from 'app/dime/dimetag/dimetag.backend';
import { DimeTagService } from 'app/dime/dimetag/dimetag.service';

const appRoutes: Routes = [
	// { path: '', component: AppComponent },
	{ path: '', pathMatch: 'full', redirectTo: 'welcome' }
];

export function tokenGetter() {
	return localStorage.getItem( 'token' );
}

@NgModule( {
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		HttpClientModule,
		JwtModule.forRoot( {
			config: {
				tokenGetter: tokenGetter
			}
		} ),
		WelcomeModule,
		DimeModule,
		AccessManagementModule,
		EndUserModule,
		RouterModule.forRoot( appRoutes ),
		ToastrModule.forRoot(),
		BrowserAnimationsModule,
		AuthModule,
		StoreModule.forRoot( reducers, { initialState: appInitialState } ),
		EffectsModule.forRoot( [
			RouteEffects,
			DimeStatusEffects,
			DimeTagEffects,
			DimeCredentialEffects,
			DimeAsyncProcessEffects,
			DimeEnvironmentEffects,
			DimeStreamEffects,
			DimeMatrixEffects
		] ),
		StoreRouterConnectingModule,
		StoreDevtoolsModule.instrument( {
			maxAge: 25
		} )
	],
	providers: [
		AuthGuard,
		AuthService,
		DimeTagBackend,
		DimeTagService,
		DimeCredentialBackend,
		DimeCredentialService,
		DimeEnvironmentService,
		DimeStreamService,
		DimeMapService,
		DimeMatrixService,
		DimeProcessService,
		DimeScheduleService,
		DimeAsyncProcessService,
		AcmServerService,
		AcmUserService,
		EndUserService,
		DimeAsyncProcessBackend,
		DimeEnvironmentBackend,
		DimeStreamBackend,
		DimeMatrixBackend
	],
	bootstrap: [AppComponent]
} )
export class AppModule { }
