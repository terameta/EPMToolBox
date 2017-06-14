import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AcmServerService } from '../acmserver.service';

@Component({
	selector: 'app-acmserver-detail',
	templateUrl: './acmserver-detail.component.html',
	styleUrls: ['./acmserver-detail.component.css']
})
export class AcmServerDetailComponent implements OnInit, OnDestroy {
	paramsSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private mainService: AcmServerService,
	) { }

	ngOnInit() {
		this.paramsSubscription = this.route.params.subscribe(
			(params: Params) => {
				this.mainService.getOne(params['id']);
			}
		);
	}

	ngOnDestroy() {
		this.paramsSubscription.unsubscribe();
	}

}
