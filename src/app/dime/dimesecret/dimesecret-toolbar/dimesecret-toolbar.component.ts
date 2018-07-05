import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeSecretService } from '../dimesecret.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { Store } from '@ngrx/store';
import { DimeSecretState } from '../dimesecret.state';
import { AppState } from '../../../ngstore/models';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DimeSecretActions } from '../dimesecret.actions';
import { DimeSecret } from '../../../../../shared/model/secret';
import { Router } from '@angular/router';
import { DimeUIService } from '../../../ngstore/uistate.service';

@Component( {
	selector: 'app-dimesecret-toolbar',
	templateUrl: './dimesecret-toolbar.component.html',
	styleUrls: ['./dimesecret-toolbar.component.scss']
} )
export class DimeSecretToolbarComponent implements OnInit, OnDestroy {
	public state$;

	constructor(
		public secretService: DimeSecretService,
		public tagService: DimeTagService,
		public uiService: DimeUIService,
		public store: Store<AppState>,
		private router: Router
	) {
		this.state$ = store.select<DimeSecretState>( state => state.dimeSecret );
	}

	ngOnInit() { }

	ngOnDestroy() { }


}
