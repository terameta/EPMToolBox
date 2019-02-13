import { Action } from '@ngrx/store';

export interface ReducingAction<T> extends Action {
	readonly feature: string,
	reducer?( state: T ): T
}
