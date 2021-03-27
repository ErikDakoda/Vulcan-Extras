import { getSetting } from 'meteor/vulcan:core';
import { Errors, addInitFunction, scrubFields } from 'meteor/vulcan:errors';
import { serverSetting, environmentSetting } from '../modules/settings';
import { getServerHost } from 'meteor/erikdakoda:vulcan-errors';
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
    //locals: true,
    nodeSourceMaps: true,
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
