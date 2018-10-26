import { Head, getSetting } from 'meteor/vulcan:core';
import { Errors, addInitFunction, getServerHost, scrubFields } from 'meteor/vulcan:errors';
import { serverSetting, clientSetting, environmentSetting } from '../modules/settings';
import Rollbar from 'rollbar';


const initRollbarForNode = () => {
  console.log('initRollbarForNode');
  const postServerItemAccessToken = getSetting(serverSetting);
  const environment = getSetting(environmentSetting) || 'development';
  
  if (!postServerItemAccessToken) {
    console.log(`Rollbar for Node.js was not installed because the setting ${serverSetting} is not defined`);
    return;
  }
  
  Errors.rollbar = new Rollbar({
    accessToken: postServerItemAccessToken,
    environment: environment,
    captureUncaught: true,
    captureUnhandledRejections: true,
    verbose: true,
  });
  
  Errors.rollbar.configure({
    payload: {
      server: {
        branch: getSetting('branch'),
        host: getServerHost(),
      }
    },
    scrubFields: [...scrubFields]
  });
};
addInitFunction(initRollbarForNode);


const initRollbarForBrowser = () => {
  console.log('initRollbarForBrowser');
  const postClientItemAccessToken = getSetting(clientSetting);
  const environment = getSetting(environmentSetting) || 'development';
  
  if (!postClientItemAccessToken) {
    console.log(`Rollbar for Browser was not installed because the setting ${clientSetting} is not defined`);
    return;
  }
  
  const rollbarSnippet = Assets.getText('lib/private/rollbarSnippet.txt')
  .replace('POST_CLIENT_ITEM_ACCESS_TOKEN', postClientItemAccessToken).replace('ENVIRONMENT', environment);
  
  Head.script.push({
    contents: rollbarSnippet,
  });
};
addInitFunction(initRollbarForBrowser);
