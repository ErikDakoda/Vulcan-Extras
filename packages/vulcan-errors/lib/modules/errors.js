import Users from 'meteor/vulcan:users';
import { getSetting, getString } from 'meteor/vulcan:core';
import get from 'lodash/get';
import { Errors } from 'meteor/vulcan:errors';
import { logFunctions } from 'meteor/vulcan:errors';
// import isEqual from 'lodash/isEqual';
// import { formatMessage } from 'meteor/vulcan:i18n';
import RethrownError from './rethrown';
import _isEmpty from 'lodash/isEmpty';
import { inspect } from 'util';


export const getUserPayload = function (userOrUserId) {
  try {
    const user = Users.getUser(userOrUserId);
    if (!user) return null;
    
    const userPayload = {};
    
    for (const field in userFields) {
      const path = userFields[field];
      userPayload[field] = get(user, path);
    }
    
    return userPayload;
  } catch (error) {
    return null;
  }
};


export const getServerHost = function (long) {
  let serverHost = process.env.GALAXY_CONTAINER_ID
    ?
    process.env.GALAXY_CONTAINER_ID.split('-')[1]
    :
    process.env.HOST_NAME;
  
  serverHost = getSetting('public.environment') + '_' + serverHost;
  
  if (long) serverHost = getSetting('public.hostPrefix') + '_' + serverHost;
  
  return serverHost;
};


export const processApolloErrors = function (err) {
  if (!err) return;
  
  const apolloErrors = err.original && err.original.data && err.original.data.errors ?
    formatApolloError(err.original, getString, '\n', '  ApolloError: ') :
    err.data && err.data.errors ?
      formatApolloError(err, getString, '\n', '  ApolloError: ') :
      '';
  
  err.message = err.message + '\n' + apolloErrors;
};


export const formatApolloError = (err, getString, separator = ', ', prefix = '') => {
  let formatted = '';
  
  const formatProperties = (properties) => {
    return _isEmpty(properties) ?
      '' :
      ' ' + inspect(properties);
  };
  
  const addError = (error) => {
    let message = '';
    
    if (error.id) {
      try {
        message = getString({ id: error.id, locale: 'en' }, error.properties);
      } catch (err) {
        message = error.id + formatProperties(error.properties);
      }
    } else if (error.message) {
      message = error.message + formatProperties(error.properties);
    }
    
    formatted += formatted ? separator : '';
    formatted += prefix + message;
  };
  
  const graphQLErrors = (err.data && err.data.errors) ? [err] : err.graphQLErrors;
  
  if (graphQLErrors) {
    for (let graphQLError of graphQLErrors) {
      if (graphQLError.data && graphQLError.data.errors) {
        for (let innerError of graphQLError.data.errors) {
          if (innerError.data) {
            addError(innerError.data);
          } else {
            addError(innerError);
          }
        }
      } else if (graphQLError.data) {
        addError(graphQLError.data);
      } else {
        addError(graphQLError);
      }
    }
  } else {
    let message = err.message;
    const graphqlPrefixIsPresent = message.match(/GraphQL error: (.*)/);
    addError({ message: graphqlPrefixIsPresent ? graphqlPrefixIsPresent[1] : message });
  }
  
  return formatted;
};


Errors.wrap = function (message, err) {
  return new RethrownError(message, err, { stack: true, remove: 1 });
};


Errors.log = function (params) {
  const { message, level = 'error' } = params;
  const err = params.err || params.error;
  params.err = err;
  delete params.error;
  
  processApolloErrors(err);
  
  // Send error data in details
  if (err && err.data) {
    if (!params.details) {
      params.details = {};
    }
    params.details.errorData = err.data;
  }
  
  // If both message and error object are provided, wrap the error in message
  params.err = message && err ?
    Errors.wrap(message, err) :
    err;
  
  for (const fn of logFunctions) {
    try {
      fn(params);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`// ${fn.name} ${level} error for '${(err && err.message) || message}'`);
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};


/*Errors.log = function (params) {
  // TODO: We should not mutate params.err; clone it first
  processApolloErrors(params.err);
  
  if (params.err && params.err.data) {
    if (!params.details) {
      params.details = {};
      params.details.errorData = params.err.data;
    }
  }
  
  params.err = params.message && params.err ?
    Errors.wrap(params.message, params.err) :
    params.err;
  
  for (const fn of logFunctions) {
    try {
      fn(params);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`// ${fn.name} ${params.level} error for '${params.err && params.err.message || params.message}'`);
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
  
  return params.err;
};


Errors.debug = function (message, details) {
  Errors.log({ message, details, level: 'debug' });
};


Errors.info = function (message, details) {
  Errors.log({ message, details, level: 'info' });
};


Errors.warning = function (message, details) {
  Errors.log({ message, details, level: 'warning' });
};


Errors.error = function (message, err, details) {
  Errors.log({ message, err, details, level: 'error' });
};


Errors.critical = function (message, err, details) {
  Errors.log({ message, err, details, level: 'critical' });
};*/


Errors.getMethodDetails = function (method) {
  return {
    userId: method.userId,
    headers: method.connection && method.connection.httpHeaders
  };
};
