import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMatrixService } from '../../dimematrix.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as Handsontable from 'handsontable/dist/handsontable.full.js';
import { HotTable } from 'ng2-handsontable';
import { ToastrService } from 'ngx-toastr/toastr/toastr-service';

@Component( {
	selector: 'app-dimematrix-detail-matrix',
	templateUrl: './dimematrix-detail-matrix.component.html',
	styleUrls: ['./dimematrix-detail-matrix.component.css']
} )
export class DimematrixDetailMatrixComponent implements OnInit {

	private columns: any[];
	private colHeaders: string[];
	private options: any;
	private dataObject;
	private currencyCodes = ['EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'BRL', 'CNY', 'RUB', 'INR', 'TRY', 'THB', 'IDR', 'MYR', 'MXN', 'ARS', 'DKK', 'ILS', 'PHP'];

	// @ViewChild( HotTable ) hotTableComponent;


	private hotElement;
	private hotElementContainer;
	private hotSettings;
	private hotInstance: any;
	private rowHeaders: string[];
	private filterOptions: string[];
	private fieldDescriptions: any;

	constructor(
		private mainService: DimeMatrixService,
		private toastr: ToastrService,
		private streamService: DimeStreamService
	) {
		this.filterOptions = ['Exact Match', 'Contains', 'Begins with', 'Ends With'];
	}

	ngOnInit() {
		this.getReady();
	}

	private getReady = () => {
		this.waitUntilItemIsReady().
			then( this.defineHotItems ).
			then( this.getMatrixTable ).
			then( this.prepareColumns ).
			then( this.getDescriptions ).
			then( this.applyDescriptions ).
			then( this.prepareDropdowns ).
			then(() => {
				console.log( 'We are ready, let\'s roll' );


				this.rowHeaders = [];
				this.dataObject.forEach(( curData ) => {
					this.rowHeaders.push( curData.id.toString() );
				} );
				this.hotSettings = {
					data: this.dataObject,
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
					minSpareRows: 1,
					fillHandle: { direction: 'vertical', autoInsertRow: false },
					colHeaders: this.colHeaders,
					// cell: [
					// 	{ row: 0, col: 1, type: 'dropdown', source: ['Exact Match', 'Contains', 'Begins with', 'Ends With'] }
					// ],
					cells: function ( row, col, prop ) {
						if ( row === 0 ) {
							if ( prop !== 'saveresult' ) {
								this.type = 'dropdown';
								this.source = ['Exact Match', 'Contains', 'Begins with', 'Ends With'];
							}
						}
						if ( row === 1 ) {
							if ( prop !== 'saveresult' ) {
								this.readOnly = false;
							}
						}
					},
					afterChange: this.hotAfterChange
				};
				let hot: any; hot = new Handsontable( this.hotElement, this.hotSettings );
				hot.updateSettings( {
					contextMenu: {
						items: {
							'row_above': {
								disabled: () => {
									// if filtertype or filter row, don't enable add row above
									return hot.getSelected()[0] === 0 || hot.getSelected()[0] === 1;
								}
							},
							'row_below': {
								disabled: () => {
									// if filtertype or filter row, don't enable add row above
									return hot.getSelected()[0] === 0 || hot.getSelected()[0] === 1;
								}
							},
							'remove_row': {
								disabled: () => {
									// if filtertype or filter row, don't enable add row above
									return hot.getSelected()[0] === 0 || hot.getSelected()[0] === 1;
								}
							}
						}
					}
				} );
			} ).
			catch(( issue ) => {
				console.log( issue );
				this.toastr.error( 'Matrix is not ready for data entry' );
			} );

	};
	private hotAfterChange = ( changes: any, source: any ) => {
		console.log( changes, source );
	}
	private prepareDropdowns = () => {
		return new Promise(( resolve, reject ) => {
			console.log( this.columns );
			this.columns.forEach(( curColumn ) => {
				Object.keys( this.fieldDescriptions ).forEach(( curFieldName: string ) => {
					if ( curColumn.data === curFieldName ) {
						console.log( curColumn.data, curFieldName );
						curColumn.type = 'autocomplete';
						curColumn.strict = true;
						curColumn.allowInvalid = false;
						curColumn.source = [];
						this.fieldDescriptions[curFieldName].forEach(( curDescription ) => {
							curColumn.source.push( curDescription.RefField + '::' + curDescription.Description );
						} );
					}
				} );
			} );
			console.log( this.fieldDescriptions );
			resolve();
		} );
	};
	private applyDescriptions = () => {
		return new Promise(( resolve, reject ) => {
			Object.keys( this.fieldDescriptions ).forEach(( curFieldName: string ) => {
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
	private getDescriptions = () => {
		return new Promise(( resolve, reject ) => {
			this.fieldDescriptions = {};
			const promises = [];
			this.mainService.curItemFields.forEach(( curField ) => {
				if ( curField.isDescribed ) {
					promises.push( this.getDescriptionsAction( curField.name, curField.stream, curField.streamFieldID ) );
				}
			} );
			Promise.all( promises ).then( resolve ).catch( reject );
		} );
	};
	private getDescriptionsAction = ( fieldName: string, stream: number, field: number ) => {
		return new Promise(( resolve, reject ) => {
			this.streamService.fetchFieldDescriptions( stream, field ).subscribe(( result ) => {
				this.fieldDescriptions[fieldName] = result;
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
				if ( curField.isAssigned ) {
					let toPush: any; toPush = {};
					toPush.data = curField.name;
					toPush.type = 'text';
					this.columns.push( toPush );
					this.dataObject[0][curField.name] = 'Contains';
					this.dataObject[1][curField.name] = '';
					this.colHeaders.push( curField.name );
					if ( curField.isDescribed ) {
						let toPushD: any; toPushD = {};
						toPushD.data = curField.name + '_DESC';
						this.dataObject[0][curField.name + '_DESC'] = 'Contains';
						this.dataObject[1][curField.name + '_DESC'] = '';
						toPushD.type = 'text';
						// toPushD.readOnly = true;
						this.columns.push( toPushD );
						this.colHeaders.push( curField.name + ' Description' );
					}
				}
			} );
			this.columns.push( { data: 'saveresult', type: 'text', readOnly: true } );
			this.colHeaders.push( 'Save Result' );
			resolve();
		} );
	};
	private getMatrixTable = () => {
		return new Promise(( resolve, reject ) => {
			this.mainService.fetchMatrixTable().subscribe(( data ) => {
				this.dataObject = [{ id: 'Filter Type' }, { id: 'Filter' }];
				data.forEach(( curData ) => {
					this.dataObject.push( curData );
				} );
				resolve();
			}, ( error ) => {
				reject( error );
			} );
		} );
	}
	private defineHotItems = () => {
		return new Promise(( resolve, reject ) => {
			this.hotElement = document.querySelector( '#matrixHotTable' + this.mainService.curItem.id );
			this.hotElementContainer = this.hotElement.parentNode;
			resolve();
		} );
	};
	private waitUntilItemIsReady = () => {
		return new Promise(( resolve, reject ) => {
			if ( !this.mainService.curItemReady ) {
				setTimeout(() => {
					resolve( this.waitUntilItemIsReady() );
				}, 1000 );
			} else {
				resolve();
			}
		} );
	};

	//
	// BELOW IS TO BE DELETED
	//
	private windowResized = () => {
		// this.setWidthAndHeight( '100%', window.innerHeight - 320 + 'px' );
		// this.setWidthAndHeight( '100%', window.innerHeight - 284 );
		console.log( 'Window is resized' );
	};

	private setWidthAndHeight = ( width, height ) => {
		// let eGridDiv: any; eGridDiv = document.querySelector( '#MatrixGrid' );
		// eGridDiv.style.width = width;
		// eGridDiv.style.height = height;
		this.options.width = width;
		this.options.height = height;
		// this.hotInstance.render();
	};

	private getReadyNewer = () => {
		this.waitUntilItemIsReady().
			then( this.prepareColumns ).
			then( this.prepareFilterTypeRow ).
			then( this.prepareFilterRow ).
			then( this.prepareFirstRow ).
			then(() => {
				console.log( 'We are done' );
				this.hotElement = document.querySelector( '#matrixHotTable' + this.mainService.curItem.id );
				// console.log( this.hotElement );
				// this.hotElementContainer = this.hotElement.parentNode;
				this.windowResized();
				this.hotInstance = new Handsontable( this.hotElement, this.options );
			} ).
			catch(( issue ) => {
				console.log( issue );
				this.toastr.error( 'Matrix is not ready for data entry' );
			} );
	};

	private getReadyOld = () => {
		this.waitUntilItemIsReady().
			// then( this.waitUntilHotInstanceReady ).
			then( this.prepareColumns ).
			then( this.prepareFilterTypeRow ).
			then( this.prepareFilterRow ).
			then( this.prepareFirstRow ).
			then(() => {
				this.options.rowHeaders = this.rowHeaders;
				this.hotInstance.render();
				this.windowResized();
			} ).
			catch(( issue ) => {
				console.log( issue );
				this.toastr.error( 'Matrix is not ready for data entry' );
			} );
	}
	private prepareFilterTypeRow = () => {
		return new Promise(( resolve, reject ) => {
			let toPush: any; toPush = {};
			this.columns.forEach(( curColumn ) => {
				// console.log( curColumn );
				if ( curColumn.data === 'id' ) {
					toPush[curColumn.data] = 'FilterType';
				} else {
					toPush[curColumn.data] = 'zobelek';
				}
				// toPush.push( 'Filter Type' );
			} );
			this.mainService.matrixTable.push( toPush );
			console.log( 'Matrix:', this.mainService.matrixTable );
			resolve();
		} );
	};
	private prepareFilterRow = () => {
		return new Promise(( resolve, reject ) => {
			let toPush: any; toPush = {};
			this.columns.forEach(( curColumn ) => {
				if ( curColumn.data === 'id' ) {
					toPush[curColumn.data] = 'Filter';
				} else {
					toPush[curColumn.data] = 'kobelek';
				}
			} );
			this.mainService.matrixTable.push( toPush );
			resolve();
		} );
	};
	private prepareFirstRow = () => {
		return new Promise(( resolve, reject ) => {
			for ( let i = 0; i < 100; i++ ) {
				let toPush: any; toPush = {};
				this.columns.forEach(( curColumn ) => {
					if ( curColumn.data === 'id' ) {
						toPush[curColumn.data] = i;
					} else {
						toPush[curColumn.data] = 'dobelek';
					}
				} );
				this.mainService.matrixTable.push( toPush );
			}
			resolve();
		} );
	};
}
