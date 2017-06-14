import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HotTableModule } from 'ng2-handsontable';

import { AuthModule } from '../../welcome/auth.module';

import { DimeMatricesComponent } from './dimematrices/dimematrices.component';
import { DimeMatrixToolbarComponent } from './dimematrix-toolbar/dimematrix-toolbar.component';
import { DimeMatrixListComponent } from './dimematrix-list/dimematrix-list.component';
import { DimeMatrixDetailComponent } from './dimematrix-detail/dimematrix-detail.component';
import { DimeMatrixComponent } from './dimematrix/dimematrix.component';

const dimeMatrixRoutes: Routes = [
	{ path: 'dime/matrices', pathMatch: 'prefix', redirectTo: 'dime/matrices/matrix-list' },
	{ path: 'matrix-list', component: DimeMatrixListComponent },
	{ path: 'matrix-detail/:id', component: DimeMatrixDetailComponent }
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild(dimeMatrixRoutes),
		AuthModule,
		HotTableModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeMatricesComponent,
		DimeMatrixToolbarComponent,
		DimeMatrixListComponent,
		DimeMatrixDetailComponent,
		DimeMatrixComponent
	]
})
export class DimematrixModule { }
