import PropTypes from 'prop-types';
import { Errors, addLogFunction, getUserPayload, addUserFunction } from 'meteor/erikdakoda:vulcan-errors';
import Users from 'meteor/vulcan:users';
import _isEmpty from 'lodash/isEmpty';


const isRollbarReady = function () {
  if (Errors.rollbar) return true;
  
  if (!window || !window.rollbar) {
    return false;
  }
  Errors.rollbar = window.rollbar;
  
  if (!Errors.rollbar.init || !_rollbarConfig) {
    return false;
  }
  Errors.rollbar.init(_rollbarConfig);
  
  console.log('Rollbar has been initialized');
  
  if (Errors.currentUser) {
    setRollbarUser(Errors.currentUser);
  }
  return true;
};


const logToRollbar = function ({ message, err, details = {}, level = 'debug', callback }) {
  try {
    if (!isRollbarReady()) return;
    
    callback = callback || function (error) {
      const an = 'aeiou'.includes(level[0]) ? 'an' : 'a';
      if (error) {
        console.log(`logToRollbar failed to send ${an} ${level} to Rollbar`);
        console.log(error);
      } else {
        console.log(`logToRollbar successfully sent ${an} ${level} to Rollbar`);
      }
    };
    
    PropTypes.checkPropTypes({
      message: PropTypes.string,
      err: PropTypes.instanceOf(Error),
      details: PropTypes.object.isRequired,
      level: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    }, { message, err, details, level, callback }, 'param', 'logToRollbar');
    
    const request = { level };
    
    if (details.headers) {
      request.headers = details.headers;
      delete details.headers;
    } else if (typeof navigator !== 'undefined') {
      request.headers = { userAgent: navigator.userAgent };
    }
    
    if (details.userId) {
      details.user = Users.findOne(details.userId);
      delete details.userId;
    }
    
    if (details.user) {
      Errors.configuredUser = Errors.currentUser;
      Errors.resetUser = true;
      Errors.setCurrentUser(details.user);
      delete details.user;
    }
    
    Errors.rollbar.log(message, err, request, _isEmpty(details) ? undefined : details, callback);
    
    if (Errors.resetUser) {
      Errors.setCurrentUser(Errors.configuredUser);
      delete Errors.configuredUser;
      delete Errors.resetUser;
    }
  } catch (error) {
    console.log(error);
  }
};
addLogFunction(logToRollbar);


const setRollbarUser = function (user) {
  if (!isRollbarReady() || !user) return;
  
  Errors.rollbar.configure({
    payload: {
      person: getUserPayload(user),
    }
  });
  
  console.log(`Rollbar user has been set to ${user.email}`);
};
addUserFunction(setRollbarUser);
