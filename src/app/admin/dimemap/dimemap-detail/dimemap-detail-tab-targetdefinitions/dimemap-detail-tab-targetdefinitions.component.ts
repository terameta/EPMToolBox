import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../../dimemap.service';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMapField } from '../../../../../../shared/model/dime/map';

@Component( {
	selector: 'app-dimemap-detail-tab-targetdefinitions',
	templateUrl: './dimemap-detail-tab-targetdefinitions.component.html',
	styleUrls: ['./dimemap-detail-tab-targetdefinitions.component.css']
} )
export class DimemapDetailTabTargetdefinitionsComponent implements OnInit {
	public targetFields: { name: string, isMapped: boolean }[] = [];

	constructor( public mainService: DimeMapService, public streamService: DimeStreamService ) { }

	ngOnInit() {
		this.waitMapToBeFetched()
			.then( () => this.waitStreamToBeReady( this.mainService.currentItem.target ) )
			.then( () => {
				this.targetFields = [];
				this.streamService.itemObject[this.mainService.currentItem.target].fieldList
					.filter( curField => !curField.isData )
					.forEach( curField => {
						this.targetFields.push( { name: curField.name, isMapped: false } );
					} );
				this.targetFields.forEach( curField => {
					if ( this.mainService.currentItem.targetfields.find( element => element.name === curField.name ) ) {
						curField.isMapped = true;
					}
				} );
			} );
	}

	public redesignFields = () => {
		this.mainService.currentItem.targetfields = this.targetFields.filter( curField => curField.isMapped ).map( curField => ( <DimeMapField>{ map: this.mainService.currentItem.id, name: curField.name } ) );
	}

	private waitMapToBeFetched = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.mainService.currentItem && this.mainService.currentItem.source && this.mainService.currentItem.target ) {
				resolve();
			} else {
				setTimeout( () => {
					resolve( this.waitMapToBeFetched() );
				}, 333 );
			}
		} );
	}

	private waitStreamToBeReady = ( id: number ) => {
		return new Promise( ( resolve, reject ) => {
			if ( this.streamService.itemObject[id] ) {
				if ( this.streamService.itemObject[id].fieldList ) {
					resolve();
				} else {
					setTimeout( () => {
						resolve( this.waitStreamToBeReady( id ) );
					}, 333 );
				}
			} else {
				setTimeout( () => {
					resolve( this.waitStreamToBeReady( id ) );
				}, 333 );
			}
		} );
	}

}
