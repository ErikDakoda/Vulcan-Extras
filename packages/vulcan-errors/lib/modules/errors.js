import Users from 'meteor/vulcan:users';
import { getSetting } from 'meteor/vulcan:core';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'meteor/vulcan:i18n';
import RethrownError from './rethrown';
import _isEmpty from 'lodash/isEmpty';
import { inspect } from 'util';


export const initFunctions = [];
export const logFunctions = [];
export const userFunctions = [];
export const scrubFields = new Set();


export const userFields = {
  id: '_id',
  email: 'email',
  username: 'profile.username',
  isAdmin: 'isAdmin',
};


export const addInitFunction = fn => {
  initFunctions.push(fn);
  // execute init function as soon as possible
  fn();
};


export const addLogFunction = fn => {
  logFunctions.push(fn);
};


export const addUserFunction = fn => {
  userFunctions.push(fn);
};


export const addUserFields = fields => {
  Object.assign(userFields, fields);
};


export const addScrubFields = fields => {
  fields = Array.isArray(fields) ? fields : [fields];
  for (const field of fields) {
    scrubFields.add(field);
  }
};


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


export const getServerHost = function () {
  return process.env.GALAXY_CONTAINER_ID
    ?
    process.env.GALAXY_CONTAINER_ID.split('-')[1]
    :
    getSetting('public.environment');
};


export const processApolloErrors = function (err) {
  if (!err) return;
  
  const apolloErrors = err.original && err.original.data && err.original.data.errors ?
    formatApolloError(err.original, formatMessage, '\n', '  ApolloError: ') :
    err.data && err.data.errors ?
      formatApolloError(err, formatMessage, '\n', '  ApolloError: ') :
      '';
  
  err.message = err.message + '\n' + apolloErrors;
};


export const formatApolloError = (err, formatMessage, separator = ', ', prefix = '') => {
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
        message = formatMessage({ id: error.id }, error.properties);
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


export const Errors = {
  
  
  currentUser: null,
  
  
  wrap: function (message, err) {
    return new RethrownError(message, err, { stack: true, remove: 1 });
  },
  
  
  log: function (params) {
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
  },
  
  
  debug: function (message, details) {
    Errors.log({ message, details, level: 'debug' });
  },
  
  
  info: function (message, details) {
    Errors.log({ message, details, level: 'info' });
  },
  
  
  warning: function (message, details) {
    Errors.log({ message, details, level: 'warning' });
  },
  
  
  error: function (message, err, details) {
    Errors.log({ message, err, details, level: 'error' });
  },
  
  
  critical: function (message, err, details) {
    Errors.log({ message, err, details, level: 'critical' });
  },
  
  
  setCurrentUser: function (user) {
    if (isEqual(this.currentUser, user)) return;
    
    for (const fn of userFunctions) {
      try {
        fn(user);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`// ${fn.name} with ${user && user.email}`);
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
    
    this.currentUser = user;
  },
  
  
  getMethodDetails: function (method) {
    return {
      userId: method.userId,
      headers: method.connection && method.connection.httpHeaders
    }
  }
  
  
};
