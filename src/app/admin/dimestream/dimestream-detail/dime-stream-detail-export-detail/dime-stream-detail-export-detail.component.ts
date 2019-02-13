import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { DimeStreamType } from '../../../../../../shared/enums/dime/streamtypes';
import { ActivatedRoute } from '@angular/router';

@Component( {
	selector: 'app-dime-stream-detail-export-detail',
	templateUrl: './dime-stream-detail-export-detail.component.html',
	styleUrls: ['./dime-stream-detail-export-detail.component.scss']
} )
export class DimeStreamDetailExportDetailComponent implements OnInit, OnDestroy {
	public streamTypes = DimeStreamType;
	public export: any = {};


	constructor(
		public mainService: DimeStreamService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.params.subscribe( params => {
			this.waitForCurrentItem().then( () => {
				this.export = this.mainService.currentItem.exports.find( e => e.id === parseInt( params.exportid, 10 ) );
			} );
		} );
	}

	ngOnDestroy() { }

	private waitForCurrentItem = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.mainService.currentItem && this.mainService.currentItem.exports ) {
				resolve();
			} else {
				setTimeout( () => {
					this.waitForCurrentItem().then( resolve );
				}, 300 );
			}
		} );
	}

}
