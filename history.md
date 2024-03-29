1.16.0_3 / 2021-03-27
=====================

 * Fixed bug: Rollbar warning: "locals" can't be a boolean
 
1.16.0_2 / 2021-02-13
=====================

 * Removed package `erikdakoda:vulcan-aggregate`
 
1.16.0_1 / 2021-02-03
=====================

 * Fixed bug: Client-side errors not captured by Rollbar [Pulse](https://qeebi.monday.com/boards/228275158/pulses/1019241922)
 
1.13.2 / 2019-09-08
=====================

 * Upgraded to version 1.13.2
 * Moved getUserPayload to vulcan:errors
 
1.13.1 / 2019-08-14
=====================

 * Upgraded to version 1.13.1
 
1.13.0_2 / 2019-06-28
=====================

 * Committed .idea to the repository
 * Hard coded Vulcan version number
 
1.13.0_1 / 2019-06-19
=====================

 * Updated getServerHost
 
1.13.0 / 2019-05-05
===================

 * This package is now based on vulcan:errors and only adds extra functionality
 
1.12.8_3 / 2019-01-21
=====================

 * Removed preserving the original error because it results in RangeError: Maximum call stack size exceeded when serializing the object
 
1.12.8_2 / 2019-01-20
=====================

 * Errors.log now saves err.data (when it exists) to details.errorData
 * RethrownError now preserves the original error in err.original

1.12.8_1 / 2018-11-23
=====================

 * Added new Errors.wrap() function to enable adding a message to an error while preserving its stack track; returns a RethrownError
 * If you pass both a message and an error to Errors.error(), it's automatically wrapped in a RethrownError
