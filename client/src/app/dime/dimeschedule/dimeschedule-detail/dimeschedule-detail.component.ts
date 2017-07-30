import { ActivatedRoute, Params } from '@angular/router';
import { DimeScheduleService } from '../dimeschedule.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component( {
	selector: 'app-dimeschedule-detail',
	templateUrl: './dimeschedule-detail.component.html',
	styleUrls: ['./dimeschedule-detail.component.css']
} )
export class DimescheduleDetailComponent implements OnInit, OnDestroy {
	paramSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		private mainService: DimeScheduleService
	) { }

	ngOnInit() {
		this.paramSubscription = this.route.params.subscribe(( params: Params ) => {
			this.mainService.getOne( params['id'] );
		} );
	}

	ngOnDestroy() {
		this.paramSubscription = undefined;
	}

}
