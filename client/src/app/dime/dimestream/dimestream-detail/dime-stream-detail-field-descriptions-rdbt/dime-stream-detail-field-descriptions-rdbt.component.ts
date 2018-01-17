import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeStreamFieldDetail } from '../../../../../../../shared/model/dime/streamfield';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component( {
	selector: 'app-dime-stream-detail-field-descriptions-rdbt',
	templateUrl: './dime-stream-detail-field-descriptions-rdbt.component.html',
	styleUrls: ['./dime-stream-detail-field-descriptions-rdbt.component.css']
} )
export class DimeStreamDetailFieldDescriptionsRdbtComponent implements OnInit, OnDestroy {
	public field: DimeStreamFieldDetail = <DimeStreamFieldDetail>{};
	private subscriptions: Subscription[] = [];

	constructor( private mainService: DimeStreamService, private route: ActivatedRoute ) { }

	ngOnInit() {
		this.subscriptions.push( this.route.params.subscribe( params => {
			let fieldIndex = -1;
			this.mainService.currentItem.fieldList.forEach( ( curField, curIndex ) => { if ( curField.id === parseInt( params.fieldid, 10 ) ) { fieldIndex = curIndex; } } );
			this.field = this.mainService.currentItem.fieldList[fieldIndex];
		} ) );
	}

	ngOnDestroy() {
		this.subscriptions.forEach( curSub => {
			curSub.unsubscribe();
		} );
	}

}
