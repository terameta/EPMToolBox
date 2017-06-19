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
			then(() => {
				console.log( 'We are ready, let\'s roll' );


				this.rowHeaders = [];
				this.dataObject.forEach(( curData ) => {
					this.rowHeaders.push( curData.id.toString() );
				} );
				this.hotSettings = {
					data: this.dataObject,
					// columns: [
					// 	{ data: 'id', type: 'numeric', readonly: true },
					// 	{ data: 'Account', type: 'text' },
					// 	{ data: 'Account_DESC', type: 'text' },
					// 	{ data: 'Entity', type: 'text' },
					// 	{ data: 'Entity_DESC', type: 'text' },
					// 	{ data: 'Product', type: 'text' },
					// 	{ data: 'Product_DESC', type: 'text' },
					// 	{ data: 'level', type: 'numeric', format: '0.0000' },
					// 	{ data: 'units', type: 'text' },
					// 	{ data: 'asOf', type: 'date', dateFormat: 'MM/DD/YYYY' },
					// 	{ data: 'onedChng', type: 'numeric', format: '0.00%' }
					// ],
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
					cell: [
						{ row: 0, col: 1, type: 'autocomplete', source: ['Exact Match', 'Contains', 'Begins with', 'Ends With'] }
					]
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
	private applyDescriptions = () => {
		console.log( this.fieldDescriptions );
		return new Promise(( resolve, reject ) => {
			resolve();
			setTimeout(() => {
				this.dataObject.forEach(( curTuple ) => {
					curTuple.Account_DESC = 'Account Description' + curTuple.id;
				} );
				console.log( 'Descriptions applied' );
			}, 15000 );
			setTimeout( function () { console.log( 1000 ); }, 1000 );
			setTimeout( function () { console.log( 2000 ); }, 2000 );
			setTimeout( function () { console.log( 3000 ); }, 3000 );
			setTimeout( function () { console.log( 4000 ); }, 4000 );
			setTimeout( function () { console.log( 5000 ); }, 5000 );
			setTimeout( function () { console.log( 6000 ); }, 6000 );
			setTimeout( function () { console.log( 7000 ); }, 7000 );
			setTimeout( function () { console.log( 8000 ); }, 8000 );
			setTimeout( function () { console.log( 9000 ); }, 9000 );
			setTimeout( function () { console.log( 10000 ); }, 10000 );
			setTimeout( function () { console.log( 11000 ); }, 11000 );
			setTimeout( function () { console.log( 12000 ); }, 12000 );
			setTimeout( function () { console.log( 13000 ); }, 13000 );
			setTimeout( function () { console.log( 14000 ); }, 14000 );
			setTimeout( function () { console.log( 15000 ); }, 15000 );
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
