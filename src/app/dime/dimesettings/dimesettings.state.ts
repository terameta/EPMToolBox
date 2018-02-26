import { DimeSetting, DimeSettingObject, DimeEmailServerSettings } from '../../../../shared/model/dime/settings';

export interface DimeSettingsState {
	items: DimeSettingObject,
	isLoaded: boolean
}

export const dimeSettingsInitialState: DimeSettingsState = {
	items: {
		emailserver: <DimeSetting>{ name: 'emailserver', value: { host: '', port: 25 } },
		systemadmin: <DimeSetting>{ name: 'systemadmin', value: { emailaddress: '' } }
	},
	isLoaded: false
};
