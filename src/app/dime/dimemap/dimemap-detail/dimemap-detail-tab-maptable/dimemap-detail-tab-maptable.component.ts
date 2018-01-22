import { Component, OnInit } from '@angular/core';

import * as Handsontable from 'handsontable/dist/handsontable.full.js';
import { ToastrService } from 'ngx-toastr';

import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMapService } from 'app/dime/dimemap/dimemap.service';
// import * as Handsontable from 'handsontable/dist/handsontable.full.js';

@Component( {
	selector: 'app-dimemap-detail-tab-maptable',
	templateUrl: './dimemap-detail-tab-maptable.component.html',
	styleUrls: ['./dimemap-detail-tab-maptable.component.css']
} )
export class DimemapDetailTabMaptableComponent implements OnInit {

	public numberofRowsinMap: string;
	private columns: any[];
	private colHeaders: string[];
	private options: any;
	private dataObject;

	private hot: Handsontable;

	private filterChangeWaiter: any;

	private hotElement;
	private hotElementContainer;
	private hotSettings;
	private hotInstance: any;
	private rowHeaders: string[];
	private filterOptions: string[];
	private fieldDescriptions: any;

	constructor(
		public mainService: DimeMapService,
		private toastr: ToastrService,
		private streamService: DimeStreamService
	) {
		this.numberofRowsinMap = 'Please wait, preparing...';
	}

	ngOnInit() {
		// this.getReady();
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
		private hotAfterChange = ( changes: any[], source: string ) => {
			if ( source !== 'loadData' && changes && Array.isArray( changes ) && changes.length > 0 ) {
				let theUpdates: any[];
				if ( Array.isArray( changes[0] ) ) {
					theUpdates = changes;
				} else {
					theUpdates = [changes];
				}
				let dataChanged = false;
				let changedRowNumbers: number[]; changedRowNumbers = [];
				theUpdates.forEach(( currentChange: any[] ) => {
					const changedRowNumber = currentChange[0];
					const changedFieldName = currentChange[1];
					const changedOldValue = currentChange[2];
					const changedNewValue = currentChange[3];
					// console.log( 'Changed Row Number', changedRowNumber );
					// console.log( 'Changed Field Name', changedFieldName );
					// console.log( 'Changed Old Value', changedOldValue );
					// console.log( 'Changed New Value', changedNewValue );
					// console.log( this.dataObject[changedRowNumber] );
					if ( this.dataObject[changedRowNumber].id === 'Filter' || this.dataObject[changedRowNumber].id === 'Filter Type' ) {
						this.filterChange();
					} else {
						if ( changedFieldName !== 'saveresult' && changedFieldName !== 'id' ) {
							// this.hotEdited( this.dataObject[changedRowNumber], changedFieldName );
							dataChanged = true;
							if ( changedRowNumbers.indexOf( changedRowNumber ) < 0 ) {
								changedRowNumbers.push( changedRowNumber );
							}
						}
					}
				} );
				changedRowNumbers.forEach(( curChangedRow: number ) => {
					this.hotEdited( this.dataObject[curChangedRow] );
				} );
				if ( dataChanged ) {
					this.applyDescriptions().then(() => {
						this.hot.loadData( this.dataObject );
					} );
				}
			}
		};
		public windowResized = () => {
			console.log( 'Window Resized called' );
		}
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
		private waitUntilItemIsReady = () => {
			return new Promise(( resolve, reject ) => {
				if ( !this.mainService.curItemIsReady || !this.mainService.curItemFields || !this.mainService.curItemSourceStreamFields || !this.mainService.curItemTargetStreamFields ) {
					// console.log( 'Current  Item:', !!this.mainService.curItemIsReady );
					// console.log( 'CurItemFields:', !!this.mainService.curItemFields );
					// console.log( 'Source Fields:', !!this.mainService.curItemSourceStreamFields );
					// console.log( 'Target Fields:', !!this.mainService.curItemTargetStreamFields );
					setTimeout(() => {
						resolve( this.waitUntilItemIsReady() );
					}, 1000 );
				} else {
					// console.log( this.mainService.curItemFields );
					// console.log( this.mainService.curItemSourceStreamFields );
					// console.log( this.mainService.curItemTargetStreamFields );
					resolve();
				}
			} );
		};
		private prepareColumnOrders = () => {
			return new Promise(( resolve, reject ) => {
				this.mainService.curItemFields.forEach(( curField ) => {
					if ( curField.srctar === 'source' ) {
						this.mainService.curItemSourceStreamFields.forEach(( curSourceField ) => {
							if ( curSourceField.name === curField.name ) {
								curField.fOrder = '00000' + curSourceField.fOrder;
								curField.isDescribed = curSourceField.isDescribed;
								curField.stream = curSourceField.stream;
								curField.streamFieldID = curSourceField.id;
							}
						} );
					} else {
						this.mainService.curItemTargetStreamFields.forEach(( curTargetField ) => {
							if ( curTargetField.name === curField.name ) {
								curField.fOrder = '00000' + curTargetField.fOrder;
								curField.isDescribed = curTargetField.isDescribed;
								curField.stream = curTargetField.stream;
								curField.streamFieldID = curTargetField.id;
							}
						} );
					}
					curField.fOrder = curField.srctar + curField.fOrder.toString().substr( -6 );
				} );
				this.mainService.curItemFields.sort(( a, b ) => {
					if ( a.fOrder > b.fOrder ) {
						return 1;
					} else if ( a.fOrder < b.fOrder ) {
						return -1;
					} else {
						return 0;
					}
				} );
				this.streamService.listTypesFetch().subscribe(( result ) => {
					let srcHyperionPlanning = false;
					let tarHyperionPlanning = false;
					result.forEach(( curType ) => {
						if ( curType.id === this.mainService.curItemSourceStream.type && curType.value === 'HPDB' ) {
							srcHyperionPlanning = true;
						}
						if ( curType.id === this.mainService.curItemTargetStream.type && curType.value === 'HPDB' ) {
							tarHyperionPlanning = true;
						}
					} );
					this.mainService.curItemFields.forEach(( curField ) => {
						if ( curField.srctar === 'source' && srcHyperionPlanning ) {
							curField.isDescribed = 1;
						}
						if ( curField.srctar === 'target' && tarHyperionPlanning ) {
							curField.isDescribed = 1;
						}
					} );
					resolve();
				}, ( error ) => {
					console.error( error );
					reject( 'Error while getting stream type list' );
				} )
			} );
		}
		private defineHotItems = () => {
			return new Promise(( resolve, reject ) => {
				this.hotElement = document.querySelector( '#mapHotTable' + this.mainService.curItem.id );
				this.hotElementContainer = this.hotElement.parentNode;
				resolve();
			} );
		};
		public refreshMapTable = () => {
			this.getMapTable();
		}
		private getMapTable = () => {
			this.numberofRowsinMap = 'Please wait, refreshing...';
			return new Promise(( resolve, reject ) => {
				let currentFilter: any;
				if ( this.dataObject ) {
					currentFilter = {};
					Object.keys( this.dataObject[0] ).forEach(( curKey ) => {
						if ( this.dataObject[0][curKey] !== 'Filter Type' ) {
							if ( this.dataObject[1][curKey] ) {
								// console.log( curKey, this.dataObject[0][curKey], this.dataObject[1][curKey] );
								currentFilter[curKey] = {
									type: this.dataObject[0][curKey],
									value: this.dataObject[1][curKey]
								};
							}
						}
					} );
				} else {
					currentFilter = {};
				}
				this.mainService.fetchMapTable( currentFilter ).subscribe(( data ) => {
					if ( this.dataObject ) {
						this.dataObject = [this.dataObject[0], this.dataObject[1]];
					} else {
						this.dataObject = [{ id: 'Filter Type' }, { id: 'Filter' }];
					}
					// console.log( 'We received data' );
					data.forEach(( curData ) => {
						this.dataObject.push( curData );
						// console.log( curData );
					} );
					this.numberofRowsinMap = data.length + ' rows';
					resolve();
				}, ( error ) => {
					reject( error );
				} );
			} );
		};
		private prepareColumns = () => {
			return new Promise(( resolve, reject ) => {
				this.columns = [];
				this.colHeaders = [];
				// this.columns.push( { data: 'id', type: 'text', readOnly: true } );
				// this.colHeaders.push( 'id' );
				this.mainService.curItemFields.forEach(( curField ) => {
					// console.log( curField );
					let curPrefix = '';
					if ( curField.srctar === 'source' ) { curPrefix = 'SRC_'; }
					if ( curField.srctar === 'target' ) { curPrefix = 'TAR_'; }
					let toPush: any; toPush = {};
					toPush.data = curPrefix + curField.name;
					toPush.type = 'text';
					if ( curField.srctar === 'source' ) { toPush.readOnly = true; }
					this.columns.push( toPush );
					this.dataObject[0][curPrefix + curField.name] = 'Contains';
					this.dataObject[1][curPrefix + curField.name] = '';
					this.colHeaders.push( curField.name );
					if ( curField.isDescribed ) {
						let toPushD: any; toPushD = {};
						toPushD.data = curPrefix + curField.name + '_DESC';
						this.dataObject[0][curPrefix + curField.name + '_DESC'] = 'Contains';
						this.dataObject[1][curPrefix + curField.name + '_DESC'] = '';
						toPushD.type = 'text';
						toPushD.readOnly = true;
						this.columns.push( toPushD );
						this.colHeaders.push( curField.name + ' Description' );
					}
				} );
				this.columns.push( { data: 'saveresult', type: 'text', readOnly: true, renderer: 'html' } );
				this.colHeaders.push( 'Save Result' );
				resolve();
			} );
		};
		private getDescriptions = () => {
			return new Promise(( resolve, reject ) => {
				this.fieldDescriptions = {};
				const promises = [];
				this.mainService.curItemFields.forEach(( curField ) => {
					let curPrefix = '';
					if ( curField.srctar === 'source' ) { curPrefix = 'SRC_'; }
					if ( curField.srctar === 'target' ) { curPrefix = 'TAR_'; }
					if ( curField.isDescribed && curField.srctar === 'target' ) {
						promises.push( this.getDescriptionsAction( curField.name, curField.stream, curField.streamFieldID, curPrefix ) );
					}
				} );
				Promise.all( promises ).then( resolve ).catch( reject );
			} );
		};
		private getDescriptionsAction = ( fieldName: string, stream: number, field: number, prefix: string ) => {
			return new Promise(( resolve, reject ) => {
				// console.log( 'getDescriptiansAction is running', fieldName, stream, field );
				this.streamService.fetchFieldDescriptions( stream, field ).subscribe(( result ) => {
					this.fieldDescriptions[prefix + fieldName] = result;
					this.fieldDescriptions[prefix + fieldName].push( { RefField: 'ignore', Description: 'ignore' } );
					resolve();
				}, ( error ) => {
					reject( error );
				} );
			} );
		};
		private applyDescriptions = () => {
			return new Promise(( resolve, reject ) => {
				Object.keys( this.fieldDescriptions ).forEach(( curFieldName: string ) => {
					// console.log( curFieldName );
					this.fieldDescriptions[curFieldName].forEach(( curDescription ) => {
						this.dataObject.forEach(( curTuple ) => {
							if ( curTuple[curFieldName] === curDescription.RefField ) {
								curTuple[curFieldName + '_DESC'] = curDescription.Description;
							}
						} );
					} );
				} );
				resolve();
			} );
		};
		private prepareDropdowns = () => {
			return new Promise(( resolve, reject ) => {
				// console.log( this.columns );
				this.columns.forEach(( curColumn ) => {
					Object.keys( this.fieldDescriptions ).forEach(( curFieldName: string ) => {
						if ( curColumn.data === curFieldName ) {
							// console.log( curColumn.data, curFieldName );
							curColumn.type = 'autocomplete';
							curColumn.strict = true;
							curColumn.allowInvalid = false;
							curColumn.source = [];
							this.fieldDescriptions[curFieldName].forEach(( curDescription ) => {
								curColumn.source.push( curDescription.RefField + '::' + curDescription.Description );
							} );
							this.fieldDescriptions[curFieldName].forEach(( curDescription ) => {
								curColumn.source.push( curDescription.RefField );
							} );
							// console.log( curColumn.source );
						}
					} );
				} );
				// console.log( this.columns );
				resolve();
			} );
		};*/
}
