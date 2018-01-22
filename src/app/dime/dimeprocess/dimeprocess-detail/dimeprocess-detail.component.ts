import { Subscription } from 'rxjs/Rx';
import { DimeProcessService } from '../dimeprocess.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component( {
	selector: 'app-dimeprocess-detail',
	templateUrl: './dimeprocess-detail.component.html',
	styleUrls: ['./dimeprocess-detail.component.css']
} )
export class DimeprocessDetailComponent implements OnInit, OnDestroy {
	paramSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		public mainService: DimeProcessService
	) { }

	ngOnInit() {
		// this.paramSubscription = this.route.params.subscribe(( params: Params ) => {
		// 	this.mainService.getOne( params['id'] );
		// } );
	}

	ngOnDestroy() {
		// this.paramSubscription = undefined;
	}

}
