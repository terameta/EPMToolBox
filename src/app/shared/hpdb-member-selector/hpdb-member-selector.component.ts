import { Component, OnInit, Input } from '@angular/core';
import { TreeModule } from 'angular-tree-component';

@Component( {
	selector: 'app-hpdb-member-selector',
	templateUrl: './hpdb-member-selector.component.html',
	styleUrls: ['./hpdb-member-selector.component.scss']
} )
export class HpdbMemberSelectorComponent implements OnInit {
	@Input() members: any[] = [];
	public nodes: any[] = [];

	constructor() { }

	ngOnInit() {
		console.log( this.members );
	}

	private getChildren = ( parent: string ): any[] => {
		const toReturn = this.members.filter( item => item.Parent === parent ).map( item => {
		} );
		toReturn.forEach( item => {
			item.children = this.getChildren( item.id );
		} );
	}
	private member2node = ( item: any ) => {
		const toReturn: any = {};
		const tempItem = JSON.parse( JSON.stringify( item ) );
		toReturn.id = tempItem.
	}

}
