import { Component, OnInit } from '@angular/core';

import { DimeMapService } from 'app/dime/dimemap/dimemap.service';
// import * as Handsontable from 'handsontable/dist/handsontable.full.js';

@Component({
	selector: 'app-dimemap-detail-tab-maptable',
	templateUrl: './dimemap-detail-tab-maptable.component.html',
	styleUrls: ['./dimemap-detail-tab-maptable.component.css']
})
export class DimemapDetailTabMaptableComponent implements OnInit {
	// private data: any[];
	// private colHeaders: string[];
	// private columns: any[];
	private rowData: any[];
	private columnDefs: any[];
	private sourceCols: any[];
	private targetCols: any[];
	private numberofRowsinMap: number;

	private data: any[];

	constructor(
		private mainService: DimeMapService
	) {
		this.refreshMapTable();
		this.numberofRowsinMap = 0;

		this.data = [
			['Afghanistan', '30.552', '1000s', '2013', '0.0244', '27.708', '24.019', '11.215'],
			['Albania', '2.774', '1000s', '2013', '-0.0100', '2.884', '3.015', '3.228']
		];
	}

	ngOnInit() {
	}

	private refreshMapTable = () => {
		this.mainService.refreshMapTable().
			subscribe((result) => {
				if (Array.isArray(result.map)) {
					if (result.map.length > 0) {
						this.columnDefs = [];
						this.sourceCols = [];
						this.targetCols = [];
						// this.columnDefs.push({ headerName: 'id', field: 'id', suppressFilter: true });
						this.numberofRowsinMap = result.map.length;
						Object.keys(result.map[0]).forEach((curField) => {
							if (curField.substr(0, 3) === 'SRC') {
								this.sourceCols.push({
									headerName: (curField.substr(-5) === '_DESC' ? 'Description' : curField.replace('SRC_', '')),
									field: curField,
									filter: 'text'
								});
							}
							if (curField.substr(0, 3) === 'TAR') {
								let toPush: any; toPush = {};
								toPush.headerName = (curField.substr(-5) === '_DESC' ? 'Description' : curField.replace('TAR_', ''));
								toPush.field = curField;
								toPush.filter = 'text';
								if (curField.substr(-5) !== '_DESC') {
									toPush.editable = true;
									toPush.newValueHandler = this.cellValueChanged;
									if (result.descriptions) {
										if (result.descriptions[curField]) {
											toPush.cellEditor = 'select';
											toPush.cellEditorParams = {};
											toPush.cellEditorParams.values = ['ignore', 'missing'];
											result.descriptions[curField].forEach((curDescription) => {
												if (curDescription.RefField === curDescription.Description) {
													toPush.cellEditorParams.values.push(curDescription.RefField);
												} else {
													toPush.cellEditorParams.values.push(curDescription.RefField + '::' + curDescription.Description);
												}
											});
										}
									}
								}
								this.targetCols.push(toPush);
							}
						});
						this.columnDefs.push({ headerName: 'Source', children: this.sourceCols });
						this.columnDefs.push({ headerName: 'Target', children: this.targetCols });
						this.columnDefs.push({
							headerName: 'Map Result', field: '___mr___', suppressFilter: true, cellRenderer: (params) => {
								return params.value !== undefined ? params.value : '';
							}
						});
					}
				}
				this.windowResized();
			}, (error) => {
				console.log(error);
			});
	};

	private cellValueChanged = (params) => {
		// console.log(params);
		const newValues = params.newValue.toString().split('::');
		params.data[params.colDef.field] = newValues[0];
		if (params.data[params.colDef.field + '_DESC'] !== undefined) {
			params.node.setDataValue(params.colDef.field + '_DESC', (newValues.length > 1 ? newValues[1] : newValues[0]));
		}
		params.node.setDataValue('___mr___', '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Checking');
		let isThereMissing = false;
		let toSave: any; toSave = {};
		toSave.id = params.data.id;
		Object.keys(params.data).forEach((curKey) => {
			if (curKey.substr(0, 4) === 'TAR_' && curKey.substr(-5) !== '_DESC') {
				if (params.data[curKey] === 'missing') { isThereMissing = true; }
				if (params.data[curKey] === '') { isThereMissing = true; }
				if (!params.data[curKey]) { isThereMissing = true; }
				toSave[curKey] = params.data[curKey];
			}
		});
		if (isThereMissing) {
			params.node.setDataValue('___mr___', '<i class="fa fa-pause" fa-fw" style="color:orange"></i> Still missing');
		} else {
			params.node.setDataValue('___mr___', '<i class="fa fa-circle-o-notch fa-spin fa-fw" style="color:orange"></i> Saving');
			this.mainService.saveMapTuple(toSave).subscribe((result) => {
				// console.log(result);
				params.node.setDataValue('___mr___', '<i class="fa fa-check-circle fa-fw" style="color:green"></i> Saved');
			}, (error) => {
				// console.log('Error:', error);
				params.node.setDataValue('___mr___', '<i class="fa fa-exclamation-circle fa-fw" style="color:red"></i> Failed');
			});
		}
	};

	private windowResized = () => {
		this.setWidthAndHeight('100%', window.innerHeight - 320 + 'px');
	};

	private setWidthAndHeight = (width, height) => {
		let eGridDiv: any; eGridDiv = document.querySelector('#MapGrid');
		eGridDiv.style.width = width;
		eGridDiv.style.height = height;
	};

}
