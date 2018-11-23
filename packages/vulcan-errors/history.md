1.12.8_1 / 2018-11-23
=====================

 * Added new Errors.wrap() function to enable adding a message to an error while preserving its stack track; returns a RethrownError
 * If you pass both a message and an error to Errors.error(), it's automatically wrapped in a RethrownError
