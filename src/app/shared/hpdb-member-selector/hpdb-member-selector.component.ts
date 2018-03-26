import { Component, OnInit, Input } from '@angular/core';
import { ITreeOptions } from 'angular-tree-component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component( {
	selector: 'app-hpdb-member-selector',
	templateUrl: './hpdb-member-selector.component.html',
	styleUrls: ['./hpdb-member-selector.component.scss']
} )
export class HpdbMemberSelectorComponent implements OnInit {
	@Input() members: any[] = [];
	public nodes: any[] = [];
	public selectedMember = '';
	public options: ITreeOptions = {
		displayField: 'name',
		actionMapping: {
			mouse: {
				click: ( tree, node, $event ) => {
					this.selectedMember = node.data.id;
				}
			}
		}
	};

	public onClose: Subject<any>;

	constructor(
		public modalRef: BsModalRef
	) { }

	ngOnInit() {
		this.nodes = this.getChildren( '' );
		this.onClose = new Subject();
	}

	private getChildren = ( parent: string ): any[] => {
		const toReturn = this.members.filter( item => item.Parent === parent ).map( item => this.member2node( item ) );
		toReturn.forEach( item => {
			item.children = this.getChildren( item.id );
		} );
		return toReturn;
	}
	private member2node = ( item: any ) => {
		const toReturn: any = {};
		const tempItem = JSON.parse( JSON.stringify( item ) );
		toReturn.id = tempItem.RefField;
		toReturn.name = tempItem.RefField === tempItem.Description ? tempItem.RefField : tempItem.RefField + ':' + tempItem.Description;
		toReturn.isExpanded = true;
		return toReturn;
	}

	public assign = () => {
		this.onClose.next( this.selectedMember );
		this.modalRef.hide();
	}

	public cancel = () => {
		this.onClose.next();
		this.modalRef.hide();
	}

}
