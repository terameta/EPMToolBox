import { actionFactory } from '../../ngstore/ngrx.generators';
import { DimeSetting } from '../../../../shared/model/dime/settings';

export const DimeSettingsActions = {
	ALL: {
		LOAD: {
			INITIATE: actionFactory( 'DIME SETTINGS ACTIONS ALL LOAD INITIATE' ),
			INITIATEIFEMPTY: actionFactory( 'DIME SETTINGS ACTIONS ALL LOAD INITIATEIFEMPTY' ),
			COMPLETE: actionFactory<DimeSetting[]>( 'DIME SETTINGS ACTIONS ALL LOAD COMPLETE' )
		},
		UPDATE: {
			INITIATE: actionFactory<DimeSetting[]>( 'DIME SETTINGS ACTIONS ALL UPDATE INITIATE' ),
			COMPLETE: actionFactory( 'DIME SETTINGS ACTIONS ALL UPDATE COMPLETE' )
		}
	}
};
