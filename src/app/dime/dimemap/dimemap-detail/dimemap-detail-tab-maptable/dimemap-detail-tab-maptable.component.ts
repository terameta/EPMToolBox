import { Component, OnInit } from '@angular/core';

// import * as Handsontable from 'handsontable/dist/handsontable.full.js';
import { ToastrService } from 'ngx-toastr';

import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMapService } from '../../../dimemap/dimemap.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngstore/models';
import { DimeMapField } from '../../../../../../shared/model/dime/map';
import { DimeStatusActions } from '../../../../ngstore/applicationstatus';
import { ATReadyStatus } from '../../../../../../shared/enums/generic/readiness';
import { DimeMapActions } from '../../dimemap.actions';
import { HotRegisterer } from 'angular-handsontable';
import Handsontable from 'handsontable';
// import * as Handsontable from 'handsontable/dist/handsontable.full.js';

@Component( {
	selector: 'app-dimemap-detail-tab-maptable',
	templateUrl: './dimemap-detail-tab-maptable.component.html',
	styleUrls: ['./dimemap-detail-tab-maptable.component.css']
} )
export class DimemapDetailTabMaptableComponent implements OnInit {
	public atReadyStatus = ATReadyStatus;

	public numberofRowsinMap: string;
	public hotTableHeight = 250;
	public currentItemID = 0;
	public filtersShown = false;
	public sortersShown = false;
	public filters: { source: any[], target: any[] };
	public availableSorters = [];
	public activeSorters = [];

	public mapSettings;
	public mapColumns: any[] = [];
	public mapData: any[] = [];

	private instance = 'hotInstance';
	private hotInstance: Handsontable;
	private invalidRows: number[] = [];
	// private columns: any[];
	// private colHeaders: string[];
	// private options: any;
	// private dataObject;

	// private hot: Handsontable;

	// private filterChangeWaiter: any;

	// private hotElement;
	// private hotElementContainer;
	// private hotSettings;
	// private hotInstance: any;
	// private rowHeaders: string[];
	// private filterOptions: string[];
	// private fieldDescriptions: any;

	constructor(
		public mainService: DimeMapService,
		private toastr: ToastrService,
		private streamService: DimeStreamService,
		private store: Store<AppState>,
		private hotRegisterer: HotRegisterer
	) {
		this.numberofRowsinMap = '0';

		this.store.select( 'dimeMap' ).subscribe( currentState => {
			if ( currentState.curItem.id !== this.currentItemID ) {
				this.currentItemID = currentState.curItem.id;
				this.getReady();
			}
			this.mapData = currentState.curItem.mapData;
			this.numberofRowsinMap = 'Rows: ' + this.mapData.length;
			this.hotInstance = this.hotRegisterer.getInstance( this.instance );
		} );
	}

	ngOnInit() {
		this.windowResized();
		this.mapSettings = {
			colHeaders: true,
			rowHeaders: true,
			stretchH: 'all',
			manualColumnResize: true,
			manualColumnMove: true,
			// observeChanges: true,
			afterChange: this.hotAfterChange,
			afterValidate: this.hotAfterValidate
		};
	}
	private hotAfterValidate = ( isValid: boolean, value: any, row: number, prop: string | number, source: string ) => {
		if ( !isValid ) {
			if ( this.invalidRows.findIndex( element => element === row ) < 0 ) {
				this.invalidRows.push( row );
			}
		} else {
			const curIndex = this.invalidRows.findIndex( element => element === row );
			if ( curIndex >= 0 ) {
				this.invalidRows.splice( curIndex, 1 );
			}
		}
		console.log( 'AfterValidate:', isValid, value, row, prop, source, this.invalidRows );
	}
	private hotAfterChange = ( changes: any[], source: string ) => {
		// console.log( 'AfterChange' );
		if ( source !== 'loadData' && changes && Array.isArray( changes ) && changes.length > 0 ) {
			let changedRowNumber, changedFieldName, changedOldValue, changedNewValue, changedDataIndex, changedDataID, changedDataTuple;
			changes.forEach( currentChange => {
				changedRowNumber = currentChange[0];
				changedFieldName = currentChange[1];
				changedOldValue = currentChange[2];
				changedNewValue = currentChange[3].toString().split( '::' );
				// When we use the getDataAtRow, the first element in array is the ID.
				changedDataID = this.hotInstance.getDataAtRow( changedRowNumber )[0];
				changedDataIndex = this.mapData.findIndex( element => element.id === changedDataID );
				changedDataTuple = this.mapData[changedDataIndex];
				console.log( this.hotInstance.getDataAtRow( changedRowNumber ) );
				console.log( changedDataID, changedDataIndex );
				console.log( source, changedFieldName, changedDataTuple[changedFieldName], changedOldValue, changedNewValue );
				changedDataTuple[changedFieldName] = changedNewValue[0];
				if ( changedNewValue[1] ) {
					console.log( 'There is description' );
					changedDataTuple[changedFieldName + '_DESC'] = changedNewValue[1];
				}

				// this.mapData[changedRowNumber].saveresult = '666';
			} );
			this.hotInstance.render();
			// // this.mainService.currentItem.sourcefields.forEach( curField => console.log( curField ) );
			// // this.mainService.currentItem.targetfields.forEach( curField => console.log( curField ) );
		}
	}
	public windowResized = () => {
		this.hotTableHeight = window.innerHeight - 320;
		if ( this.hotTableHeight < 100 ) {
			this.hotTableHeight = 100;
		}
		// console.log( 'Window width:', window.innerWidth, 'Window Height:', window.innerHeight, 'Hot Table Height:', this.hotTableHeight );
	}
	public refreshMapTable = () => {
		this.filtersShown = false;
		this.sortersShown = false;
		this.numberofRowsinMap = 'Please wait, preparing...';
		this.store.dispatch( DimeMapActions.ONE.REFRESH.initiate( { id: this.mainService.currentItem.id, filters: this.filters, sorters: this.activeSorters } ) );
	}
	private getReady = () => {
		this.waitUntilItemIsReady()
			.then( this.prepareFilters )
			.then( this.prepareAvailableSorters )
			.then( this.prepareColumns )
			.then( this.prepareDescriptions )
			.then( this.prepareDropdowns )
			.then( this.refreshMapTable )
			.catch( console.error );
	}
	private prepareDropdowns = () => {
		return new Promise( ( resolve, reject ) => {
			this.streamService.itemObject[this.mainService.currentItem.target].fieldList.forEach( ( currentStreamField ) => {
				this.mainService.currentItem.targetfields.forEach( ( currentMapField ) => {
					if ( currentMapField.name === currentStreamField.name ) {
						let columnIndex: number;
						this.mapColumns
							.forEach( ( currentColumn, currentIndex ) => {
								if ( currentColumn.data === 'TAR_' + currentStreamField.name ) {
									columnIndex = currentIndex;
								}
							} );
						this.mapColumns[columnIndex].type = 'autocomplete';
						this.mapColumns[columnIndex].strict = true;
						this.mapColumns[columnIndex].allowInvalid = true;
						this.mapColumns[columnIndex].source = [];
						currentMapField.descriptions.forEach( ( currentDescription ) => {
							this.mapColumns[columnIndex].source.push( currentDescription.RefField );
							this.mapColumns[columnIndex].source.push( currentDescription.RefField + '::' + currentDescription.Description );
						} );
					}
				} );
			} );
			resolve();
		} );
	}
	private prepareDescriptions = () => {
		return new Promise( ( resolve, reject ) => {
			const currentPrefix = '_TAR';
			const promises = [];
			this.streamService.itemObject[this.mainService.currentItem.target].fieldList.forEach( ( currentStreamField ) => {
				this.mainService.currentItem.targetfields.forEach( ( currentMapField ) => {
					if ( currentMapField.name === currentStreamField.name ) {
						promises.push( this.prepareDescriptionsAction( currentMapField, currentStreamField.stream, currentStreamField.id, currentPrefix ) );
					}
				} );
			} );
			Promise.all( promises ).then( resolve ).catch( reject );
		} );
	}
	private prepareDescriptionsAction = ( mapField: DimeMapField, stream: number, field: number, prefix: string ) => {
		return new Promise( ( resolve, reject ) => {
			this.streamService.fetchFieldDescriptions( stream, field ).subscribe( ( result: any[] ) => {
				mapField.descriptions = result;
				mapField.descriptions.push( { RefField: 'ignore', Description: 'ignore' } );
				resolve();
			}, ( error ) => {
				reject( error );
			} );
		} );
	}
	private prepareColumns = () => {
		return new Promise( ( resolve, reject ) => {
			this.mapColumns = [];
			let currentColumn: any;
			let currentPrefix: string;
			this.mapColumns.push( { data: 'id', type: 'text', readOnly: true, title: 'ID' } );
			this.streamService.itemObject[this.mainService.currentItem.source].fieldList
				.filter( currentStreamField => ( this.mainService.currentItem.sourcefields.findIndex( currentMapField => currentMapField.name === currentStreamField.name ) >= 0 ) )
				.forEach( currentField => {
					currentColumn = {};
					currentPrefix = 'SRC_';
					currentColumn.data = currentPrefix + currentField.name;
					currentColumn.type = 'text';
					currentColumn.readOnly = true; 	// Because it is a source field, it is always read-only
					currentColumn.title = currentField.name;
					this.mapColumns.push( currentColumn );
					if ( currentField.isDescribed ) {
						currentColumn = {};
						currentColumn.data = currentPrefix + currentField.name + '_DESC';
						currentColumn.title = currentField.name + ' Description';
						currentColumn.type = 'text';
						currentColumn.readOnly = true;
						this.mapColumns.push( currentColumn );
					}
				} );
			this.streamService.itemObject[this.mainService.currentItem.target].fieldList
				.filter( currentStreamField => ( this.mainService.currentItem.targetfields.findIndex( currentMapField => currentMapField.name === currentStreamField.name ) >= 0 ) )
				.forEach( currentField => {
					currentColumn = {};
					currentPrefix = 'TAR_';
					currentColumn.data = currentPrefix + currentField.name;
					currentColumn.type = 'text';
					currentColumn.title = currentField.name;
					this.mapColumns.push( currentColumn );
					if ( currentField.isDescribed ) {
						currentColumn = {};
						currentColumn.data = currentPrefix + currentField.name + '_DESC';
						currentColumn.title = currentField.name + ' Description';
						currentColumn.type = 'text';
						currentColumn.readOnly = true;
						this.mapColumns.push( currentColumn );
					}
				} );
			this.mapColumns.push( { data: 'saveresult', type: 'text', readOnly: true, renderer: 'html', title: 'Save Result' } );
			resolve();
		} );
	}
	private waitUntilItemIsReady = () => {
		return new Promise( ( resolve, reject ) => {
			if ( !this.mainService.currentItem
				|| !this.mainService.currentItem.sourcefields || this.mainService.currentItem.sourcefields.length === 0
				|| !this.streamService.itemObject[this.mainService.currentItem.source]
				|| !this.mainService.currentItem.targetfields || this.mainService.currentItem.targetfields.length === 0
				|| !this.streamService.itemObject[this.mainService.currentItem.target]
			) {
				setTimeout( () => { resolve( this.waitUntilItemIsReady() ); }, 1000 );
			} else {
				resolve();
			}
		} );
	}
	private prepareFilters = () => {
		return new Promise( ( resolve, reject ) => {
			this.filters = { source: [], target: [] };
			this.streamService.itemObject[this.mainService.currentItem.source].fieldList
				.filter( currentStreamField => ( this.mainService.currentItem.sourcefields.findIndex( currentMapField => currentMapField.name === currentStreamField.name ) >= 0 ) )
				.forEach( currentStreamField => {
					this.filters.source.push( { name: currentStreamField.name, type: 'is', value: '' } );
				} );
			this.streamService.itemObject[this.mainService.currentItem.target].fieldList
				.filter( currentStreamField => ( this.mainService.currentItem.targetfields.findIndex( currentMapField => currentMapField.name === currentStreamField.name ) >= 0 ) )
				.forEach( currentStreamField => {
					this.filters.target.push( { name: currentStreamField.name, type: 'is', value: '' } );
				} );
			resolve();
		} );
	}
	private prepareAvailableSorters = () => {
		return new Promise( ( resolve, reject ) => {
			this.availableSorters = [];
			this.activeSorters = [];
			this.streamService.itemObject[this.mainService.currentItem.source].fieldList
				.filter( currentStreamField => ( this.mainService.currentItem.sourcefields.findIndex( currentMapField => currentMapField.name === currentStreamField.name ) >= 0 ) )
				.forEach( currentStreamField => {
					this.availableSorters.push( { name: currentStreamField.name, type: 'SRC', isAsc: true, label: 'Source ' + currentStreamField.name } );
				} );
			this.streamService.itemObject[this.mainService.currentItem.target].fieldList
				.filter( currentStreamField => ( this.mainService.currentItem.targetfields.findIndex( currentMapField => currentMapField.name === currentStreamField.name ) >= 0 ) )
				.forEach( currentStreamField => {
					this.availableSorters.push( { name: currentStreamField.name, type: 'TAR', isAsc: true, label: 'Target ' + currentStreamField.name } );
				} );
			resolve();
		} );
	}
	public addToActiveSorters = ( index: number ) => {
		this.activeSorters.push( this.availableSorters.splice( index, 1 )[0] );
	}
	public removeFromActiveSorters = ( index: number ) => {
		this.availableSorters.push( this.activeSorters.splice( index, 1 )[0] );
	}
	public swapActiveSorters = ( from: number, to: number ) => {
		const temp = this.activeSorters[to];
		this.activeSorters[to] = this.activeSorters[from];
		this.activeSorters[from] = temp;
	}
	private getMapTable = () => {
		this.numberofRowsinMap = 'Please wait, refreshing...';
		return new Promise( ( resolve, reject ) => {
			// let currentFilter: any;
			// if ( this.dataObject ) {
			// 	currentFilter = {};
			// 	Object.keys( this.dataObject[0] ).forEach( ( curKey ) => {
			// 		if ( this.dataObject[0][curKey] !== 'Filter Type' ) {
			// 			if ( this.dataObject[1][curKey] ) {
			// 				// console.log( curKey, this.dataObject[0][curKey], this.dataObject[1][curKey] );
			// 				currentFilter[curKey] = {
			// 					type: this.dataObject[0][curKey],
			// 					value: this.dataObject[1][curKey]
			// 				};
			// 			}
			// 		}
			// 	} );
			// } else {
			// 	currentFilter = {};
			// }
			// this.mainService.fetchMapTable( currentFilter ).subscribe( ( data ) => {
			// 	if ( this.dataObject ) {
			// 		this.dataObject = [this.dataObject[0], this.dataObject[1]];
			// 	} else {
			// 		this.dataObject = [{ id: 'Filter Type' }, { id: 'Filter' }];
			// 	}
			// 	// console.log( 'We received data' );
			// 	data.forEach( ( curData ) => {
			// 		this.dataObject.push( curData );
			// 		// console.log( curData );
			// 	} );
			// 	this.numberofRowsinMap = data.length + ' rows';
			// 	resolve();
			// }, ( error ) => {
			// 	reject( error );
			// } );
		} );
	}
	/*
		private getReady = () => {
			this.waitUntilItemIsReady().
				then( this.prepareColumnOrders ).
				then( this.defineHotItems ).
				then( this.getMapTable ).
				then( this.prepareColumns ).
				then( this.getDescriptions ).
				then( this.applyDescriptions ).
				then( this.prepareDropdowns ).
				then(() => {
					// console.log( 'We are ready, let\'s roll' );
					// console.log( this.dataObject );
					// console.log( this.columns );
					this.rowHeaders = [];
					this.dataObject.forEach(( curData ) => {
						this.rowHeaders.push( curData.id.toString() );
					} );
					this.hotSettings = {
						data: this.dataObject,
						observeChanges: true,
						columns: this.columns,
						fixedRowsTop: 2,
						stretchH: 'all',
						// width: 689,
						autoWrapRow: true,
						height: 441,
						// maxRows: 22,
						contextMenu: true,
						manualColumnResize: true,
						manualColumnMove: true,
						columnSorting: true,
						sortIndicator: true,
						rowHeaders: this.rowHeaders,
						rowHeaderWidth: 75,
						minSpareRows: 0,
						fillHandle: { direction: 'vertical', autoInsertRow: false },
						colHeaders: this.colHeaders,
						cells: function ( row, col, prop ) {
							if ( row === 0 ) {
								if ( prop !== 'saveresult' ) {
									this.type = 'dropdown';
									this.source = ['Exact Match', 'Contains', 'Begins with', 'Ends with'];
									this.readOnly = false;
								}
							}
							if ( row === 1 ) {
								if ( prop !== 'saveresult' ) {
									this.type = 'text';
									this.readOnly = false;
								}
							}
						},
						afterChange: this.hotAfterChange
					};
					this.hot = new Handsontable( this.hotElement, this.hotSettings );
					this.hot.updateSettings( {
						contextMenu: {
							items: {
								'row_above': {
									disabled: () => {
										// if filtertype or filter row, don't enable add row above
										return this.hot.getSelected()[0] === 0 || this.hot.getSelected()[0] === 1;
									}
								},
								'row_below': {
									disabled: () => {
										// if filtertype or filter row, don't enable add row above
										return this.hot.getSelected()[0] === 0 || this.hot.getSelected()[0] === 1;
									}
								},
								'remove_row': {
									disabled: () => {
										// if filtertype or filter row, don't enable add row above
										return this.hot.getSelected()[0] === 0 || this.hot.getSelected()[0] === 1;
									}
								}
							}
						}
					} );
				} ).
				catch(( issue ) => {
					console.log( issue );
					this.toastr.error( 'Map is not ready for data entry' );
				} );
		};


		private filterChange = () => {
			clearTimeout( this.filterChangeWaiter );
			this.filterChangeWaiter = setTimeout( this.filterChangeAction, 1000 );
		};
		private filterChangeAction = () => {
			this.getMapTable().then(() => {
				this.hot.loadData( this.dataObject );
			} );
		};
		private hotEdited = ( change: any ) => {
			let isSaveable = true;
			let toSubmit: any; toSubmit = { id: change.id };
			this.mainService.curItemFields.forEach(( curField ) => {
				if ( curField.srctar === 'target' ) {
					toSubmit['TAR_' + curField.name] = change['TAR_' + curField.name];
					if ( !change['TAR_' + curField.name] ) {
						isSaveable = false;
					} else {
						change['TAR_' + curField.name] = change['TAR_' + curField.name].toString().split( '::' )[0];
					}
				}
			} );
			if ( isSaveable ) {
				change.saveresult = '<center><i class="fa fa-circle-o-notch fa-spin"></i></center>';
				this.mainService.saveMapTuple( toSubmit ).subscribe(( result ) => {
					if ( result.insertId ) {
						change.id = result.insertId;
					}
					change.saveresult = '<center><i class="fa fa-check-circle" style="color:green;font-size:12px;"></i></center>';
					this.hot.loadData( this.dataObject );
				}, ( error ) => {
					change.saveresult = '<center><i class="fa fa-exclamation-circle" style="color:red;font-size:12px;"></i></center>';
					this.hot.loadData( this.dataObject );
					console.error( error );
				} );
			}
		};
		*/
}
