import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component( {
	selector: 'app-prompt',
	templateUrl: './prompt.component.html',
	styleUrls: ['./prompt.component.scss']
} )
export class PromptComponent implements OnInit, OnDestroy {
	@Input() question = 'Please respond';
	@Input() defaultValue = '';

	public result = '';
	public onClose: Subject<string | boolean> = new Subject();

	constructor( public modalRef: BsModalRef ) { }

	ngOnInit() { this.result = this.defaultValue; }

	ngOnDestroy() { this.cancel(); }

	public ok = () => {
		this.onClose.next( this.result );
		this.modalRef.hide();
		this.onClose.complete();
	}

	public cancel = () => {
		this.onClose.next( false );
		this.modalRef.hide();
		this.onClose.complete();
	}

}
