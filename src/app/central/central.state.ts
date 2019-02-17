import { JSONDeepCopy } from '../../../shared/utilities/utilityFunctions';

export const FEATURE = '[CENTRAL]';

export interface State {
	currentAudience: string,
	currentFeature: string,
	currentID: number,
	selectedTags: { [key: number]: number }
}

const baseState = (): State => {
	return {
		currentAudience: 'guest',
		currentFeature: '',
		currentID: 0,
		selectedTags: JSON.parse( localStorage.getItem( 'selectedTags' ) ) || {}
		// selectedTags: {}
	};
};

export const initialState = (): State => JSONDeepCopy( baseState() );
