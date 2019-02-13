import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeStreamFieldDetail } from '../../../../../../shared/model/dime/streamfield';
import { DimeStreamService } from '../../dimestream.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component( {
	selector: 'app-dime-stream-detail-field-descriptions-rdbt',
	templateUrl: './dime-stream-detail-field-descriptions-rdbt.component.html',
	styleUrls: ['./dime-stream-detail-field-descriptions-rdbt.component.css']
} )
export class DimeStreamDetailFieldDescriptionsRdbtComponent implements OnInit, OnDestroy {
	public field: DimeStreamFieldDetail = <DimeStreamFieldDetail>{};
	private subscriptions: Subscription[] = [];

	constructor( public mainService: DimeStreamService, private route: ActivatedRoute ) { }

	ngOnInit() {
		this.subscriptions.push( this.route.params.subscribe( params => {
			let fieldIndex = -1;
			this.mainService.currentItem.fieldList.forEach( ( curField, curIndex ) => { if ( curField.id === parseInt( params.fieldid, 10 ) ) { fieldIndex = curIndex; } } );
			if ( fieldIndex >= 0 ) { this.field = this.mainService.currentItem.fieldList[fieldIndex]; }
			if ( this.field && this.field.descriptiveTableList ) {
				if ( !this.field.descriptiveTableList.find( curTable => curTable.name === 'Custom Query' ) ) {
					this.field.descriptiveTableList.push( { name: 'Custom Query', type: 'Custom Query' } );
				}
			}
		} ) );
	}

	ngOnDestroy() {
		this.subscriptions.forEach( curSub => curSub.unsubscribe() );
	}

	public setdrfType = ( event ) => this.field.drfType = this.field.descriptiveFieldList[event.target.selectedIndex].type;
	public setddfType = ( event ) => this.field.ddfType = this.field.descriptiveFieldList[event.target.selectedIndex].type;
}
