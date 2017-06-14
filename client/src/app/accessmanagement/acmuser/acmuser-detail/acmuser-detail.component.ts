import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AcmUserService } from '../acmuser.service';
import { AcmServerService } from '../../acmserver/acmserver.service';

@Component({
	selector: 'app-acmuser-detail',
	templateUrl: './acmuser-detail.component.html',
	styleUrls: ['./acmuser-detail.component.css']
})
export class AcmUserDetailComponent implements OnInit, OnDestroy {
	paramsSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private mainService: AcmUserService,
		private serverService: AcmServerService
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

	private onEmailChange = () => {
		if (this.mainService.curItem.type === 'directory') {
			this.mainService.curItem.username = this.mainService.curItem.email;
		}
	};

}
