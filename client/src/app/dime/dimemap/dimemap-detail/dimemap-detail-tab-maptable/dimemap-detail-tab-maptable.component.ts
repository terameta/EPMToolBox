import { Component, OnInit } from '@angular/core';

import { DimeMapService } from 'app/dime/dimemap/dimemap.service';
// import * as Handsontable from 'handsontable/dist/handsontable.full.js';
import { GridOptions } from 'ag-grid/main';

@Component({
	selector: 'app-dimemap-detail-tab-maptable',
	templateUrl: './dimemap-detail-tab-maptable.component.html',
	styleUrls: ['./dimemap-detail-tab-maptable.component.css']
})
export class DimemapDetailTabMaptableComponent implements OnInit {
	// private data: any[];
	// private colHeaders: string[];
	// private columns: any[];
	private gridOptions: GridOptions;
	private rowData: any[];
	private columnDefs: any[];
	private sourceCols: any[];
	private targetCols: any[];

	constructor(
		private mainService: DimeMapService
	) {
		this.gridOptions = <GridOptions>{};
		this.gridOptions.enableFilter = true;
		this.gridOptions.enableColResize = true;
		mainService.refreshMapTable().
			subscribe((result) => {
				if (Array.isArray(result.map)) {
					if (result.map.length > 0) {
						this.columnDefs = [];
						this.sourceCols = [];
						this.targetCols = [];
						// this.columnDefs.push({ headerName: 'id', field: 'id', suppressFilter: true });
						Object.keys(result.map[0]).forEach((curField) => {
							if (curField.substr(0, 3) === 'SRC') {
								this.sourceCols.push({
									headerName: (curField.substr(-5) === '_DESC' ? 'Description' : curField.replace('SRC_', '')),
									field: curField,
									filter: 'text'
								});
							}
							if (curField.substr(0, 3) === 'TAR') {
								this.targetCols.push({
									headerName: (curField.substr(-5) === '_DESC' ? 'Description' : curField.replace('TAR_', '')),
									field: curField,
									filter: 'text',
									editable: curField.substr(-5) !== '_DESC',
									cellEditor: 'select',
									cellEditorParams: {
										values: ['a', 'b', 'c']
									}
								});
							}
						});
						this.columnDefs.push({ headerName: 'Source', children: this.sourceCols });
						this.columnDefs.push({ headerName: 'Target', children: this.targetCols });
					}
				}
				this.gridOptions.api.setRowData(result.map);
				this.gridOptions.api.setColumnDefs(this.columnDefs);
				this.gridOptions.api.sizeColumnsToFit();
				this.gridOptions.api.hideOverlay();
				this.gridOptions.columnApi.autoSizeAllColumns();
				this.gridOptions.api.addEventListener('cellValueChanged', this.cellValueChanged);
				this.windowResized();
			}, (error) => {
				console.log(error);
			});
	}

	ngOnInit() {
	}

	private cellValueChanged = (changes) => {
		console.log(changes);
	};

	private windowResized = () => {
		this.setWidthAndHeight('100%', window.innerHeight - 320 + 'px');
	};

	private setWidthAndHeight = (width, height) => {
		let eGridDiv: any; eGridDiv = document.querySelector('#MapGrid');
		eGridDiv.style.width = width;
		eGridDiv.style.height = height;
		this.gridOptions.api.doLayout();
	};

}
