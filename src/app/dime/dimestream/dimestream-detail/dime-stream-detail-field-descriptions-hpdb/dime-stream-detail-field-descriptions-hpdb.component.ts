import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeStreamFieldDetail } from '../../../../../../shared/model/dime/streamfield';
import { DimeStreamService } from '../../dimestream.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component( {
	selector: 'app-dime-stream-detail-field-descriptions-hpdb',
	templateUrl: './dime-stream-detail-field-descriptions-hpdb.component.html',
	styleUrls: ['./dime-stream-detail-field-descriptions-hpdb.component.css']
} )
export class DimeStreamDetailFieldDescriptionsHpdbComponent implements OnInit, OnDestroy {
	public field: DimeStreamFieldDetail = <DimeStreamFieldDetail>{};
	private subscriptions: Subscription[] = [];

	constructor( public mainService: DimeStreamService, private route: ActivatedRoute ) { }

	ngOnInit() {
		this.subscriptions.push( this.route.params.subscribe( params => {
			let fieldIndex = -1;
			this.mainService.currentItem.fieldList.forEach( ( curField, curIndex ) => { if ( curField.id === parseInt( params.fieldid, 10 ) ) { fieldIndex = curIndex; } } );
			if ( fieldIndex >= 0 ) {
				this.field = this.mainService.currentItem.fieldList[fieldIndex];
				this.field.descriptiveDB = this.mainService.currentItem.dbName;
			}
		} ) );
	}

	ngOnDestroy() {
		this.subscriptions.forEach( curSub => curSub.unsubscribe() );
	}

	public setAllAliasTablesSameAsThisOne = () => {
		this.mainService.currentItem.fieldList.forEach( curField => { curField.descriptiveTable = this.field.descriptiveTable; } );
		this.mainService.update();
	}

}
