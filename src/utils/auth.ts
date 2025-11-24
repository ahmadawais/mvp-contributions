import Conf from 'conf';

const config = new Conf({
	projectName: 'mvp-activity',
	projectSuffix: ''
});

export const getToken = (): string | undefined => {
	return config.get('mvpAccessToken') as string | undefined;
};

export const getProfileId = (): string | undefined => {
	return config.get('mvpProfileId') as string | undefined;
};

export const setToken = (token: string): void => {
	config.set('mvpAccessToken', token);
};

export const setProfileId = (profileId: string): void => {
	config.set('mvpProfileId', profileId);
};

export const hasCredentials = (): boolean => {
	return !!getToken() && !!getProfileId();
};

export const clearCredentials = (): void => {
	config.delete('mvpAccessToken');
	config.delete('mvpProfileId');
};
