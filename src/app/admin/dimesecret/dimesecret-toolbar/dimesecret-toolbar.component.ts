import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeSecretService } from '../dimesecret.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { Store } from '@ngrx/store';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { AppState } from '../../../app.state';
import { SecretState } from '../dimesecret.state';

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
		public store: Store<AppState>
	) {
		this.state$ = store.select<SecretState>( state => state.secret );
	}

	ngOnInit() { }

	ngOnDestroy() { }


}
