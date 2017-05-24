import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { DimeProcessService } from '../dimeprocess.service';
import { DimeStreamService } from '../../dimestream/dimestream.service';

@Component({
	selector: 'app-dimeprocess-step-detail',
	templateUrl: './dimeprocess-step-detail.component.html',
	styleUrls: ['./dimeprocess-step-detail.component.css']
})
export class DimeprocessStepDetailComponent implements OnInit {
	paramSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		private mainService: DimeProcessService,
		private streamService: DimeStreamService
	) { }

	ngOnInit() {
		this.paramSubscription = this.route.params.subscribe((params: Params) => {
			this.mainService.stepGetOne(params['id']);
		})
	}

}
