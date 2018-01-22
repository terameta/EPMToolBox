import { Component, OnInit, OnDestroy } from '@angular/core';
import { DimeStreamService } from 'app/dime/dimestream/dimestream.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component( {
	selector: 'app-dime-stream-detail-field-descriptions-router',
	templateUrl: './dime-stream-detail-field-descriptions-router.component.html',
	styleUrls: ['./dime-stream-detail-field-descriptions-router.component.css']
} )
export class DimeStreamDetailFieldDescriptionsRouterComponent implements OnInit, OnDestroy {
	private subscriptionsArray: Subscription[] = [];

	constructor(
		public mainService: DimeStreamService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit() {
		this.subscriptionsArray.push( this.route.params.subscribe( ( params ) => {
			this.redirectIfNecessary();
		} ) );
		this.subscriptionsArray.push( this.router.events.subscribe( event => {
			if ( event instanceof NavigationEnd ) {
				this.redirectIfNecessary();
			}
		} ) );
	}

	ngOnDestroy() {
		this.subscriptionsArray.forEach( ( curSubscription ) => {
			curSubscription.unsubscribe();
		} );
	}

	public redirectIfNecessary = () => {
		const params: any = { fieldid: 0 };
		this.router.url.split( '/' ).filter( ( curPart, curIndex ) => curIndex === 6 ).map( curPart => { params.fieldid = curPart; } );
		this.waitCurrentItemFieldList().then( () => {
			let doWeHaveThisField = false;
			this.mainService.currentItem.fieldList.forEach( curField => { if ( curField.id === parseInt( params.fieldid, 10 ) ) { doWeHaveThisField = true; } } );
			let fieldtoNavigate = 0;
			if ( !doWeHaveThisField ) {
				this.mainService.currentItem.fieldList.slice( 0 ).reverse().map( curField => { if ( curField.isDescribed ) { fieldtoNavigate = curField.id; } } );
				if ( fieldtoNavigate > 0 ) {
					this.router.navigateByUrl( '/dime/streams/stream-detail/' + this.mainService.currentItem.id + '/fielddescriptions/' + fieldtoNavigate );
				}
			}

		} );

	}

	private waitCurrentItemFieldList = () => {
		return new Promise( ( resolve, reject ) => {
			if ( this.mainService.currentItem.fieldList ) {
				resolve();
			} else {
				setTimeout( () => {
					resolve( this.waitCurrentItemFieldList() );
				}, 200 );
			}
		} );
	}
}
