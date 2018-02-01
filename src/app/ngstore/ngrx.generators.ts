import { Action as NgRXAction, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

export interface Action<T = void> extends NgRXAction {
	payload?: T;
}

interface ActionFactoryType<T> {
	type: string,
	action( payload?: T ): Action<T>,
	observableaction( payload?: T ): Observable<Action<T>>
}

export const actionFactory = <T= void>( type: string ): ActionFactoryType<T> => {
	const toReturn = <ActionFactoryType<T>>{};
	toReturn.type = type;
	toReturn.action = ( payload?: T ): Action<T> => {
		if ( payload ) {
			return <Action<T>>{ type, payload };
		} else {
			return <Action<T>>{ type };
		}
	};
	toReturn.observableaction = ( payload?: T ): Observable<Action<T>> => {
		if ( payload ) {
			return of( <Action<T>>{ type, payload } );
		} else {
			return of( <Action<T>>{ type } );
		}
	};
	return toReturn;
};
