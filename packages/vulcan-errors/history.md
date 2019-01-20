1.12.8_2 / 2019-01-20
=====================

 * Errors.log now saves err.data (when it exists) to details.errorData
 * RethrownError now preserves the original error in err.original

1.12.8_1 / 2018-11-23
=====================

 * Added new Errors.wrap() function to enable adding a message to an error while preserving its stack track; returns a RethrownError
 * If you pass both a message and an error to Errors.error(), it's automatically wrapped in a RethrownError
