Vulcan error tracking adapter for Rollbar.

Documentation coming soon. 

## Quick start

Add the following to your settings.json (not inside `public`):

```
  "rollbar": {
    "postServerItemAccessToken": "6e761c**************************",
    "postClientItemAccessToken": "6e4711**************************",
    "environment": "development"
  }
```

Uncaught errors will be sent to Rollbar.

You can send caught errors to Rollbar like this:

```
import { Errors } from 'meteor/erikdakoda:vulcan-errors';

async function doSomething (param1, param2) {
  try {
    . . .
  } catch (error) {
    Errors.error('function doSomething failed', error, { param1, param2 });
  }
}
```

You can also log any info to Rollbar:

```
Errors.debug(message, details);
Errors.info(message, details);
Errors.warning(message, details);
```

## User monitoring

If you want client side errors to be associated with the currently signed in user, simply add the following component anywhere in your main layout component:

```
<Components.ErrorsUserMonitor/>
```
