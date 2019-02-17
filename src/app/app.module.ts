import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AppEffects } from './app.effects';
import { AppReducer } from './app.reducer';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { HotTableModule } from '@handsontable/angular';
import { CentralModule } from './central/central.module';

const routes: Routes = [
	{ path: '', loadChildren: './guest/guest.module#GuestModule' },
	{ path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
];

const toastrOptions = {
	positionClass: 'toast-bottom-full-width',
	preventDuplicates: true,
	showMethod: 'slideUp',
	closeMethod: 'slideDown',
	newestOnTop: true,
	progressBar: true,
	timeOut: 2500
};

export function tokenGetter() { return localStorage.getItem( 'token' ); }

@NgModule( {
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		JwtModule.forRoot( { config: { tokenGetter } } ),
		MonacoEditorModule.forRoot(),
		RouterModule.forRoot( routes ),
		ToastrModule.forRoot( toastrOptions ),
		// StoreModule.forRoot( reducers, { initialState: initialAppState } ),
		StoreModule.forRoot( AppReducer ),
		EffectsModule.forRoot( AppEffects ),
		StoreRouterConnectingModule.forRoot( { stateKey: 'router' } ),
		HotTableModule.forRoot(),
		ModalModule.forRoot(),
		BsDropdownModule.forRoot(),
		CentralModule
	],
	providers: [],
	bootstrap: [AppComponent]
} )
export class AppModule { }
