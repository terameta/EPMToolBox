import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeStreamService } from '../dimestream.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';
import { Store } from '@ngrx/store';
import { DimeStreamActions } from '../dimestream.actions';
import { AppState } from '../../../app.state';

@Component( {
	selector: 'app-dimestream-detail',
	templateUrl: './dimestream-detail.component.html',
	styleUrls: ['./dimestream-detail.component.css']
} )
export class DimeStreamDetailComponent implements OnInit, OnDestroy {

	constructor(
		// private route: ActivatedRoute,
		// private router: Router,
		public mainService: DimeStreamService,
		public environmentService: DimeEnvironmentService,
		private store: Store<AppState>
	) { }

	ngOnInit() {
	}

	ngOnDestroy() {
		this.store.dispatch( DimeStreamActions.ONE.unload() );
	}
}
