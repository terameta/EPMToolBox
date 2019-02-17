import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component( {
	selector: 'app-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss']
} )
export class ConfirmComponent implements OnInit, OnDestroy {
	@Input() question = 'Are you sure?';
	@Input() okonly = false;

	public onClose: Subject<boolean> = new Subject();

	constructor( public modalRef: BsModalRef ) { }

	ngOnInit() { }

	ngOnDestroy() { this.no(); }

	public yes = () => {
		this.onClose.next( true );
		this.modalRef.hide();
		this.onClose.complete();
	}

	public no = () => {
		this.onClose.next( false );
		this.modalRef.hide();
		this.onClose.complete();
	}

}
