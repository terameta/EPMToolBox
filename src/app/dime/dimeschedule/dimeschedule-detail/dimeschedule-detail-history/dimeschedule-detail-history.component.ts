import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DimeLog } from '../../../../../../shared/model/dime/log';
import { DimeScheduleService } from '../../dimeschedule.service';
import { DimeScheduleBackend } from '../../dimeschedule.backend';

@Component( {
	selector: 'app-dimeschedule-detail-history',
	templateUrl: './dimeschedule-detail-history.component.html',
	styleUrls: ['./dimeschedule-detail-history.component.css']
} )
export class DimescheduleDetailHistoryComponent implements OnInit, OnDestroy {
	public allLogs: DimeLog[] = [];
	public currentLog = 0;
	private subscriptions: Subscription[] = [];

	constructor(
		public mainService: DimeScheduleService,
		private backend: DimeScheduleBackend
	) { }

	ngOnInit() {
		this.waitForSchedule().then( () => { this.refreshLogs(); } );
	}

	ngOnDestroy() {
		this.subscriptions.forEach( sub => sub.unsubscribe() );
		this.allLogs = [];
		this.currentLog = 0;
	}

	private waitForSchedule = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.mainService.currentItem.id > 0 ) {
				resolve();
			} else {
				setTimeout( () => {
					resolve( this.waitForSchedule() );
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
