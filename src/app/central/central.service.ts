import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';

@Injectable( { providedIn: 'root' } )
export class Service {
	constructor(
		private modalService: BsModalService
	) { }

	public confirm = ( question: string, okonly = false ): Promise<boolean> => {
		const modalRef: BsModalRef = this.modalService.show( ConfirmComponent, { initialState: { question, okonly } } );
		return new Promise( ( resolve, reject ) => {
			modalRef.content.onClose.subscribe( resolve, reject );
		} );
	}

	public prompt = ( question: string, defaultValue = '' ): Promise<string> => {
		const modalRef: BsModalRef = this.modalService.show( PromptComponent, { initialState: { question, defaultValue } } );
		return new Promise( ( resolve, reject ) => {
			modalRef.content.onClose.subscribe( resolve, reject );
		} );
	}
}
