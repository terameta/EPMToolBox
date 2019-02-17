import { ReducingAction } from '../../../shared/models/reducingaction';
import { State, FEATURE } from './central.state';

export const ActionTypes = {
	SetFeature: `${ FEATURE } SetFeature`,
	SetTag: `${ FEATURE } Set Tag`,
};

export class SetFeature implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.SetFeature;

	constructor( public payload: string ) { }

	public reducer = ( state: State ): State => {
		const segments = this.payload.split( '/' ).splice( 1 );
		const newState: State = { ...state, currentAudience: segments[0], currentFeature: segments[1], currentID: parseInt( ( segments[2] || '0' ), 10 ) };
		return newState;
	}
}

export class SetTag implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.SetTag;

	constructor( public payload: { taggroup: number, tag: number } ) { }

	public reducer = ( state: State ): State => {
		const newState: State = { ...state, selectedTags: { ...state.selectedTags, [this.payload.taggroup]: this.payload.tag } };
		localStorage.setItem( 'selectedTags', JSON.stringify( newState.selectedTags ) );
		return newState;
	}
}
