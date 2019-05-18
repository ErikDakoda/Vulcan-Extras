import { getSetting } from 'meteor/vulcan:lib';

export const getServerHost = function () {
  return process.env.GALAXY_CONTAINER_ID
    ? process.env.GALAXY_CONTAINER_ID.split('-')[1]
    : getSetting('public.environment');
};
