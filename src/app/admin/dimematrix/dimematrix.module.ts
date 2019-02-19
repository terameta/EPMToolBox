import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HotTableModule } from '@handsontable/angular';

import { AuthModule } from '../../auth/auth.module';

import { DimeMatricesComponent } from './dimematrices/dimematrices.component';
import { DimeMatrixToolbarComponent } from './dimematrix-toolbar/dimematrix-toolbar.component';
import { DimeMatrixListComponent } from './dimematrix-list/dimematrix-list.component';
import { DimeMatrixDetailComponent } from './dimematrix-detail/dimematrix-detail.component';
import { DimeMatrixComponent } from './dimematrix/dimematrix.component';
import { DimematrixDetailMaindefinitionsComponent } from './dimematrix-detail/dimematrix-detail-maindefinitions/dimematrix-detail-maindefinitions.component';
import { DimematrixDetailFieldsComponent } from './dimematrix-detail/dimematrix-detail-fields/dimematrix-detail-fields.component';
import { DimematrixDetailMatrixComponent } from './dimematrix-detail/dimematrix-detail-matrix/dimematrix-detail-matrix.component';
import { DimematrixDetailImportComponent } from './dimematrix-detail/dimematrix-detail-import/dimematrix-detail-import.component';
import { DimematrixDetailExportComponent } from './dimematrix-detail/dimematrix-detail-export/dimematrix-detail-export.component';
import { CentralModule } from '../../central/central.module';

const dimeMatrixRoutes: Routes = [
	{
		path: '', component: DimeMatricesComponent, children: [
			{ path: '', component: DimeMatrixListComponent },
			{
				path: ':id', component: DimeMatrixDetailComponent, children: [
					{ path: '', component: DimematrixDetailMaindefinitionsComponent },
					{ path: 'fields', component: DimematrixDetailFieldsComponent },
					{ path: 'matrix', component: DimematrixDetailMatrixComponent },
					{ path: 'import', component: DimematrixDetailImportComponent },
					{ path: 'export', component: DimematrixDetailExportComponent }
				]
			},
		]
	}
];

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		RouterModule.forChild( dimeMatrixRoutes ),
		AuthModule,
		HotTableModule,
		CentralModule
	],
	exports: [
		RouterModule
	],
	declarations: [
		DimeMatricesComponent,
		DimeMatrixToolbarComponent,
		DimeMatrixListComponent,
		DimeMatrixDetailComponent,
		DimeMatrixComponent,
		DimematrixDetailMaindefinitionsComponent,
		DimematrixDetailFieldsComponent,
		DimematrixDetailMatrixComponent,
		DimematrixDetailImportComponent,
		DimematrixDetailExportComponent
	]
} )
export class DimematrixModule { }
