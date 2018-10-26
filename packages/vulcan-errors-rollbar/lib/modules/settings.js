import { registerSetting } from 'meteor/vulcan:core';


export const serverSetting = 'rollbar.postServerItemAccessToken';
export const clientSetting = 'rollbar.postClientItemAccessToken';
export const environmentSetting = 'rollbar.environment';
export const tokensUrl = 'https://rollbar.com/{account}/{project}/settings/access_tokens/';

registerSetting(serverSetting, null, `Rollbar post_server_item access token from ${tokensUrl}`);
registerSetting(clientSetting, null, `Rollbar post_client_item access token from ${tokensUrl}`);
registerSetting(environmentSetting, 'development', 'Rollbar environment (staging, production, qa)');
