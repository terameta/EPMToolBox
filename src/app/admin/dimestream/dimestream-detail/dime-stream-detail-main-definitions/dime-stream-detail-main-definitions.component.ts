import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../../dimestream.service';
import { DimeEnvironmentService } from '../../../dimeenvironment/dimeenvironment.service';
import { Store } from '@ngrx/store';
import { DimeEnvironmentActions } from '../../../dimeenvironment/dimeenvironment.actions';
import { DimeTagService } from '../../../dimetag/dimetag.service';
import { DimeStreamType } from '../../../../../../shared/enums/dime/streamtypes';
import { AppState } from '../../../../app.state';

@Component( {
	selector: 'app-dime-stream-detail-main-definitions',
	templateUrl: './dime-stream-detail-main-definitions.component.html',
	styleUrls: ['./dime-stream-detail-main-definitions.component.css']
} )
export class DimeStreamDetailMainDefinitionsComponent implements OnInit {
	public dimeStreamType = DimeStreamType;

	constructor(
		public mainService: DimeStreamService,
		public environmentService: DimeEnvironmentService,
		private store: Store<AppState>,
		public tagService: DimeTagService
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
		if ( this.isEnvironmentThisType( 'HP' ) || this.isEnvironmentThisType( 'PBCS' ) ) {
			this.mainService.currentItem.type = this.dimeStreamType.HPDB;
		} else {
			this.mainService.currentItem.type = this.dimeStreamType.RDBT;
		}
		this.mainService.markDirty();
	}

	public isDirty = () => {
		return !this.mainService.currentItemClean;
	}

	public isClean = () => {
		return this.mainService.currentItemClean;
	}

	public decideColWidth = ( numCols: number ) => {
		let colWidth = 12;
		if ( numCols > 0 ) {
			colWidth = Math.floor( colWidth / numCols );
		}
		if ( colWidth < 1 ) { colWidth = 1; }
		return colWidth;
	}
}
