import { DimeSetting, DimeSettingObject } from '../../../../shared/model/dime/settings';

export interface DimeSettingsState {
	items: DimeSettingObject
}

export const dimeSettingsInitialState: DimeSettingsState = {
	items: {}
};
