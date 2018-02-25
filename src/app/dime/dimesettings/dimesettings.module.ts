import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimesettingsComponent } from './dimesettings/dimesettings.component';
import { DimesettingsToolbarComponent } from './dimesettings-toolbar/dimesettings-toolbar.component';
import { Routes, RouterModule } from '@angular/router';
import { DimesettingsMailserverComponent } from './dimesettings-mailserver/dimesettings-mailserver.component';
import { FormsModule } from '@angular/forms';

// const dimeProcessRoutes: Routes = [
//   { path: 'dime/processes', pathMatch: 'prefix', redirectTo: 'dime/processes/process-list' },
//   { path: 'process-list', component: DimeprocessListComponent },
//   {
//     path: 'process-detail/:id', component: DimeprocessDetailComponent, children: [
//       { path: '', pathMatch: 'prefix', redirectTo: 'definitions' },
//       { path: 'definitions', component: DimeprocessDetailTabMaindefinitionsComponent },
//       { path: 'run', component: DimeprocessDetailTabRunComponent },
//       {
//         path: 'steps', component: DimeprocessDetailTabStepsComponent, children: [
//           { path: '', pathMatch: 'prefix', redirectTo: 'list' },
//           { path: 'list', component: DimeprocessStepListComponent },
//           { path: ':stepid', component: DimeprocessStepDetailComponent }
//         ]
//       },
//       { path: 'defaulttargets', component: DimeprocessDetailTabDefaulttargetsComponent },
//       { path: 'filters', component: DimeprocessDetailTabFiltersComponent },
//       { path: 'filtersdatafile', component: DimeprocessDetailTabFiltersdatafileComponent }
//     ]
//   },
//   { path: 'process-step-detail/:id', component: DimeprocessStepDetailComponent }
// ];

const dimeSettingsRoutes: Routes = [
	{ path: '', pathMatch: 'prefix', redirectTo: 'mailserver' },
	{ path: 'mailserver', component: DimesettingsMailserverComponent }
];


@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeSettingsRoutes ),
	],
	declarations: [
		DimesettingsComponent,
		DimesettingsToolbarComponent,
		DimesettingsMailserverComponent
	]
} )
export class DimeSettingsModule { }
