import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMatrixService } from '../../dimematrix.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ATReadyStatus } from '../../../../../../shared/enums/generic/readiness';
import Handsontable from 'handsontable';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngstore/models';
import { HotRegisterer } from 'angular-handsontable';
import * as _ from 'lodash';
import { DimeFieldDescription } from '../../../../../../shared/model/dime/fielddescription';
import { DimeMatrixActions } from '../../dimematrix.actions';

@Component( {
	selector: 'app-dimematrix-detail-matrix',
	templateUrl: './dimematrix-detail-matrix.component.html',
	styleUrls: ['./dimematrix-detail-matrix.component.css']
} )
export class DimematrixDetailMatrixComponent implements OnInit {
	public atReadyStatus = ATReadyStatus;

	public numberofRowsinMatrix: string;
	public hotTableHeight = 250;
	public currentItemID = 0;
	public filtersShown = false;
	public sortersShown = false;
	public filters: any[] = [];
	public availableSorters = [];
	public activeSorters = [];

	public matrixSettings;
	public matrixColumns: any[] = [];
	public matrixData: any[] = [];

	private instance = 'hotMatrixInstance';
	private hotInstance: Handsontable;
	private invalidRows: number[] = [];

	constructor(
		public mainService: DimeMatrixService,
		private toastr: ToastrService,
		private streamService: DimeStreamService,
		private store: Store<AppState>,
		private hotRegisterer: HotRegisterer
	) {
		this.numberofRowsinMatrix = 'Rows: initiating...';

		this.store.select( 'dimeMatrix' ).subscribe( currentState => {
			if ( currentState.curItem.id !== this.currentItemID ) {
				this.currentItemID = currentState.curItem.id;
				this.getReady();
			}
			this.matrixData = currentState.curItem.matrixData;
			if ( !this.matrixData ) { this.matrixData = []; }
			this.numberofRowsinMatrix = 'Rows: ' + this.matrixData.length;
			if ( currentState.curItem.isMatrixDataRefreshing ) {
				this.numberofRowsinMatrix = 'Please wait, refreshing the data...';
			}
			this.hotInstance = this.hotRegisterer.getInstance( this.instance );
		} );
	}

	ngOnInit() {
		this.windowResized();
		this.prepareSettings();
	}
	public windowResized = () => {
		this.hotTableHeight = window.innerHeight - 320;
		if ( this.hotTableHeight < 100 ) {
			this.hotTableHeight = 100;
		}
	}
	private getReady = () => {
		this.waitUntilItemIsReady()
			.then( this.prepareFilters )
			.then( this.prepareAvailableSorters )
			.then( this.prepareColumns )
			.then( this.prepareDescriptions )
			.then( this.prepareDropdowns )
			.then( this.prepareSettings )
			.then( this.refreshMatrixTable )
			.catch( console.error );
	}
	private waitUntilItemIsReady = () => {
		return new Promise( ( resolve, reject ) => {
			if ( !this.mainService.currentItem
				|| _.values( this.mainService.currentItem.fields ).filter( value => value ) === 0
				|| !this.streamService.itemObject[this.mainService.currentItem.stream]
			) {
				setTimeout( () => {
					resolve( this.waitUntilItemIsReady() );
				}, 300 );
			} else {
				resolve();
			}
		} );
	}
	private prepareFilters = () => {
		return new Promise( ( resolve, reject ) => {
			this.filters = [];
			this.streamService.itemObject[this.mainService.currentItem.stream].fieldList
				.filter( currentStreamField => this.mainService.currentItem.fields[currentStreamField.id] )
				.forEach( currentStreamField => {
					this.filters.push( { name: currentStreamField.name, type: 'is', value: '', isDescribed: currentStreamField.isDescribed } );
				} );
			resolve();
		} );
	}
	private prepareAvailableSorters = () => {
		return new Promise( ( resolve, reject ) => {
			this.availableSorters = [];
			this.activeSorters = [];
			this.streamService.itemObject[this.mainService.currentItem.stream].fieldList
				.filter( currentStreamField => this.mainService.currentItem.fields[currentStreamField.id] )
				.forEach( currentStreamField => {
					this.availableSorters.push( { name: currentStreamField.name, isAsc: true, label: currentStreamField.name } );
				} );
			resolve();
		} );
	}
	private prepareColumns = () => {
		return new Promise( ( resolve, reject ) => {
			this.matrixColumns = [];
			let currentColumn: any;
			this.matrixColumns.push( { data: 'id', type: 'text', readOnly: true, title: 'ID' } );
			this.streamService.itemObject[this.mainService.currentItem.stream].fieldList
				.filter( currentStreamField => this.mainService.currentItem.fields[currentStreamField.id] )
				.forEach( currentStreamField => {
					currentColumn = {};
					currentColumn.data = currentStreamField.name;
					currentColumn.type = 'text';
					currentColumn.title = currentStreamField.name;
					this.matrixColumns.push( currentColumn );
					if ( currentStreamField.isDescribed ) {
						currentColumn = {};
						currentColumn.data = currentStreamField.name + '_DESC';
						currentColumn.title = currentStreamField.name + ' Description';
						currentColumn.type = 'text';
						currentColumn.readOnly = true;
						this.matrixColumns.push( currentColumn );
					}
				} );
			resolve();
		} );
	}
	private prepareDescriptions = () => {
		return new Promise( ( resolve, reject ) => {
			const promises = [];
			this.streamService.itemObject[this.mainService.currentItem.stream].fieldList
				.filter( currentStreamField => this.mainService.currentItem.fields[currentStreamField.id] )
				.forEach( currentStreamField => {
					promises.push( this.prepareDescriptionsAction( currentStreamField.stream, currentStreamField.id ) );
				} );
			Promise.all( promises ).then( resolve ).catch( reject );
		} );
	}
	private prepareDescriptionsAction = ( stream: number, field: number ) => {
		return new Promise( ( resolve, reject ) => {
			this.streamService.fetchFieldDescriptions( stream, field ).subscribe( ( result: DimeFieldDescription[] ) => {
				this.mainService.currentItem.fieldDescriptions[field] = result;
				this.mainService.currentItem.fieldDescriptions[field].push( { RefField: 'ignore', Description: 'ignore' } );
				this.mainService.currentItem.fieldDescriptions[field].push( { RefField: 'missing', Description: 'missing' } );
				resolve();
			}, ( error ) => {
				reject( error );
			} );
		} );
	}
	private prepareDropdowns = () => {
		return new Promise( ( resolve, reject ) => {
			this.streamService.itemObject[this.mainService.currentItem.stream].fieldList
				.filter( currentStreamField => this.mainService.currentItem.fields[currentStreamField.id] )
				.forEach( currentStreamField => {
					let columnIndex: number;
					this.matrixColumns
						.forEach( ( currentColumn, currentIndex ) => {
							if ( currentColumn.data === currentStreamField.name ) {
								columnIndex = currentIndex;
							}
						} );
					this.matrixColumns[columnIndex].type = 'autocomplete';
					this.matrixColumns[columnIndex].strict = true;
					this.matrixColumns[columnIndex].allowInvalid = true;
					this.matrixColumns[columnIndex].source = [];
					this.mainService.currentItem.fieldDescriptions[currentStreamField.id].forEach( currentDescription => {
						this.matrixColumns[columnIndex].source.push( currentDescription.RefField + '::' + currentDescription.Description );
					} );
					this.matrixColumns[columnIndex].validator = ( query, callback ) => {
						let isValid = false;
						if ( this.mainService.currentItem.fieldDescriptions[currentStreamField.id].findIndex( element => element.RefField === query ) >= 0 ) {
							isValid = true;
						}
						if ( this.mainService.currentItem.fieldDescriptions[currentStreamField.id].findIndex( element => element.RefField + '::' + element.Description === query ) >= 0 ) {
							isValid = true;
						}
						callback( isValid );
					};
				} );
			resolve();
		} );
	}
	private prepareSettings = () => {
		return new Promise( ( resolve, reject ) => {
			this.matrixSettings = {
				colHeaders: true,
				rowHeaders: false,
				stretchH: 'all',
				manualColumnResize: true,
				manualColumnMove: true,
				fixedColumnsLeft: 1
				// afterChange: this.hotAfterChange,
				// afterValidate: this.hotAfterValidate,
				// afterOnCellMouseDown: this.hotAfterOnCellMouseDown
			};
			resolve();
		} );
	}
	public refreshMatrixTable = () => {
		this.filtersShown = false;
		this.sortersShown = false;
		this.numberofRowsinMatrix = 'Please wait, refreshing the data...';
		this.matrixData = [];
		this.store.dispatch( DimeMatrixActions.ONE.REFRESH.INITIATE.action( { id: this.mainService.currentItem.id, filters: this.filters, sorters: this.activeSorters } ) );
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
	/*
		private getReady = () => {
			this.waitUntilItemIsReady().
				then( this.defineHotItems ).
				then( this.getMatrixTable ).
				then( this.prepareColumns ).
				then( this.getDescriptions ).
				then( this.applyDescriptions ).
				then( this.prepareDropdowns ).
				then(() => {
					// console.log( 'We are ready, let\'s roll' );


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
						minSpareRows: 10,
						fillHandle: { direction: 'vertical', autoInsertRow: false },
						colHeaders: this.colHeaders,
						// cell: [
						// 	{ row: 0, col: 1, type: 'dropdown', source: ['Exact Match', 'Contains', 'Begins with', 'Ends with'] }
						// ],
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
					this.toastr.error( 'Matrix is not ready for data entry' );
				} );

		};
		private hotAfterChange = ( changes: any[], source: string ) => {
			// console.log( changes, source );
			if ( source !== 'loadData' && changes && Array.isArray( changes ) && changes.length > 0 ) {
				let theUpdates: any[];
				if ( Array.isArray( changes[0] ) ) {
					theUpdates = changes;
				} else {
					theUpdates = [changes];
				}
				// console.log( 'We will put our logic here' );
				// console.log( 'Number of changed cells:', changes.length );
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
		}
		private filterChange = () => {
			clearTimeout( this.filterChangeWaiter );
			this.filterChangeWaiter = setTimeout( this.filterChangeAction, 1000 );
		};
		private filterChangeAction = () => {
			this.getMatrixTable().then(() => {
				this.hot.loadData( this.dataObject );
			} );
		};
		private hotEdited = ( change: any ) => {
			// console.log( 'Data on hotable changed', change );
			let isSaveable = true;
			this.mainService.curItemAssignedFields.forEach(( curAssignedField ) => {
				if ( !change[curAssignedField.name] ) {
					isSaveable = false;
				}
				if ( change[curAssignedField.name] ) {
					change[curAssignedField.name] = change[curAssignedField.name].toString().split( '::' )[0];
				}
			} );
			if ( isSaveable ) {
				change.saveresult = '<center><i class="fa fa-circle-o-notch fa-spin"></i></center>';
				/ *this.mainService.saveMatrixTuple( change ).subscribe(( result ) => {
					// console.log( result );
					if ( result.insertId ) {
						change.id = result.insertId;
					}
					change.saveresult = '<center><i class="fa fa-check-circle" style="color:green;font-size:12px;"></i></center>';
					this.hot.loadData( this.dataObject );
				}, ( error ) => {
					change.saveresult = '<center><i class="fa fa-exclamation-circle" style="color:red;font-size:12px;"></i></center>';
					this.hot.loadData( this.dataObject );
					console.error( error );
				} );* /
			}
		}
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
						}
					} );
				} );
				// console.log( this.fieldDescriptions );
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
							toPushD.readOnly = true;
							this.columns.push( toPushD );
							this.colHeaders.push( curField.name + ' Description' );
						}
					}
				} );
				this.columns.push( { data: 'saveresult', type: 'text', readOnly: true, renderer: 'html' } );
				this.colHeaders.push( 'Save Result' );
				resolve();
			} );
		};
		private getMatrixTable = () => {
			return new Promise(( resolve, reject ) => {
				let currentFilter: any;
				if ( this.dataObject ) {
					currentFilter = {};
					Object.keys( this.dataObject[0] ).forEach(( curKey ) => {
						if ( this.dataObject[0][curKey] !== 'Filter Type' ) {
							if ( this.dataObject[1][curKey] ) {
								console.log( curKey, this.dataObject[0][curKey], this.dataObject[1][curKey] );
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
				/ *this.mainService.fetchMatrixTable( currentFilter ).subscribe(( data ) => {
					if ( this.dataObject ) {
						this.dataObject = [this.dataObject[0], this.dataObject[1]];
					} else {
						this.dataObject = [{ id: 'Filter Type' }, { id: 'Filter' }];
					}
					data.forEach(( curData ) => {
						this.dataObject.push( curData );
					} );
					resolve();
				}, ( error ) => {
					reject( error );
				} );* /
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
		public windowResized = () => {
			// this.setWidthAndHeight( '100%', window.innerHeight - 320 + 'px' );
			// this.setWidthAndHeight( '100%', window.innerHeight - 284 );
			console.log( 'Window is resized', event );
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
		*/
}
