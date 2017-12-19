import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';
import { DimeEnvironmentService } from 'app/dime/dimeenvironment/dimeenvironment.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngstore/models';
import { DimeEnvironmentActions } from 'app/dime/dimeenvironment/dimeenvironment.actions';

@Component( {
	selector: 'app-dime-stream-detail-main-definitions',
	templateUrl: './dime-stream-detail-main-definitions.component.html',
	styleUrls: ['./dime-stream-detail-main-definitions.component.css']
} )
export class DimeStreamDetailMainDefinitionsComponent implements OnInit {

	constructor(
		public mainService: DimeStreamService,
		public environmentService: DimeEnvironmentService,
		private store: Store<AppState>
	) {
		this.store.dispatch( DimeEnvironmentActions.ALL.LOAD.initiateifempty() );
	}

	ngOnInit() {
	}

	public isEnvironmentThisType = ( typeName: string ) => {
		if ( this.environmentService.itemObject[this.mainService.currentItem.environment] ) {
			return this.environmentService.typeObject[this.environmentService.itemObject[this.mainService.currentItem.environment].type].label === typeName;
		}
		return false;
	}

	public isEnvironmentNoType = () => {
		let toReturn = true;
		this.environmentService.typeList.forEach( ( curType ) => {
			if ( this.isEnvironmentThisType( curType.label ) ) {
				toReturn = false;
			}
		} );
		return toReturn;
	}

	public markDirty = () => {
		this.mainService.markDirty();
	}

	public isDirty = () => {
		return !this.mainService.currentItemClean;
	}

	public isClean = () => {
		return this.mainService.currentItemClean;
	}
}
