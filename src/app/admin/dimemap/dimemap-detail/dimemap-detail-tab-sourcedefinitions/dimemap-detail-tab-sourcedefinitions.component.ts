import { Component, OnInit } from '@angular/core';

import { DimeMapService } from '../../dimemap.service';
import { DimeStreamService } from '../../../dimestream/dimestream.service';
import { DimeMapField } from '../../../../../../shared/model/dime/map';

@Component( {
	selector: 'app-dimemap-detail-tab-sourcedefinitions',
	templateUrl: './dimemap-detail-tab-sourcedefinitions.component.html',
	styleUrls: ['./dimemap-detail-tab-sourcedefinitions.component.css']
} )
export class DimemapDetailTabSourcedefinitionsComponent implements OnInit {
	public sourceFields: { name: string, isMapped: boolean }[] = [];

	constructor( public mainService: DimeMapService, public streamService: DimeStreamService ) { }

	ngOnInit() {
		this.waitMapToBeFetched()
			.then( () => this.waitStreamToBeReady( this.mainService.currentItem.source ) )
			.then( () => {
				this.sourceFields = [];
				this.streamService.itemObject[this.mainService.currentItem.source].fieldList
					.filter( curField => !curField.isData )
					.forEach( curField => {
						this.sourceFields.push( { name: curField.name, isMapped: false } );
					} );
				this.sourceFields.forEach( curField => {
					if ( this.mainService.currentItem.sourcefields.find( element => element.name === curField.name ) ) {
						curField.isMapped = true;
					}
				} );
			} );
	}

	public redesignFields = () => {
		this.mainService.currentItem.sourcefields = this.sourceFields.filter( curField => curField.isMapped ).map( curField => ( <DimeMapField>{ map: this.mainService.currentItem.id, name: curField.name } ) );
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
