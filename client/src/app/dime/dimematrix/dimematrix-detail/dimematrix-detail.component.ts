import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { DimeMatrixService } from '../dimematrix.service';
import { DimeMapService } from '../../dimemap/dimemap.service';

@Component( {
	selector: 'app-dimematrix-detail',
	templateUrl: './dimematrix-detail.component.html',
	styleUrls: ['./dimematrix-detail.component.css']
} )
export class DimeMatrixDetailComponent implements OnInit, OnDestroy {
	paramSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		public mainService: DimeMatrixService,
		private mapService: DimeMapService
	) { }

	ngOnInit() {
		this.paramSubscription = this.route.params.subscribe(( params: Params ) => {
			// this.mainService.getOne( params['id'] );
		} );
	}

	ngOnDestroy() {
		this.paramSubscription = undefined;
	}

}
