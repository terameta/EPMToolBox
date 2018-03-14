import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeProcessBackend } from '../../dimeprocess.backend';
import { DimeProcessService } from '../../dimeprocess.service';
import { Subscription } from 'rxjs/Subscription';
import { DimeLog } from '../../../../../../shared/model/dime/log';

@Component( {
	selector: 'app-dimeprocess-detail-tab-history',
	templateUrl: './dimeprocess-detail-tab-history.component.html',
	styleUrls: ['./dimeprocess-detail-tab-history.component.scss']
} )
export class DimeprocessDetailTabHistoryComponent implements OnInit, OnDestroy {
	public allLogs: DimeLog[] = [];
	public currentLog = 0;
	private subscriptions: Subscription[] = [];

	constructor(
		public mainService: DimeProcessService,
		private backend: DimeProcessBackend
	) { }

	ngOnInit() {
		this.waitForProcess().then( () => { this.refreshLogs(); } );
	}

	ngOnDestroy() {
		this.subscriptions.forEach( sub => sub.unsubscribe() );
		this.allLogs = [];
	}

	private waitForProcess = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.mainService.currentItem.id > 0 ) {
				resolve();
			} else {
				setTimeout( () => {
					resolve( this.waitForProcess() );
				}, 500 );
			}
		} );
	}

	public refreshLogs = () => {
		this.subscriptions.push( this.backend.getAllLogs( this.mainService.currentItem.id ).subscribe( ( result: DimeLog[] ) => { this.allLogs = this.prepareLogs( result ); } ) );
	}
	private prepareLogs = ( logs: DimeLog[] ) => {
		logs.forEach( log => {
			log.start = new Date( log.start );
			log.end = new Date( log.end );
		} );
		return logs;
	}
}
