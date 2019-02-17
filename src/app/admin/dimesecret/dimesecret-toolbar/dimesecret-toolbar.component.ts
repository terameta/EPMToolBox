import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeSecretService } from '../dimesecret.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { Store, select } from '@ngrx/store';
import { DimeUIService } from '../../../ngstore/uistate.service';
import { AppState } from '../../../app.state';

@Component( {
	selector: 'app-dimesecret-toolbar',
	templateUrl: './dimesecret-toolbar.component.html',
	styleUrls: ['./dimesecret-toolbar.component.scss']
} )
export class DimeSecretToolbarComponent implements OnInit, OnDestroy {
	public state$ = this.store.pipe( select( 'secret' ) );

	constructor(
		public secretService: DimeSecretService,
		public tagService: DimeTagService,
		public uiService: DimeUIService,
		public store: Store<AppState>
	) { }

	ngOnInit() { }

	ngOnDestroy() { }


}
