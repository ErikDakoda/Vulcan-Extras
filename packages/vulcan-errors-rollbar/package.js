Package.describe({
  name: 'erikdakoda:vulcan-errors-rollbar',
  summary: 'Vulcan Rollbar error tracking package',
  version: '1.16.0_3',
  git: 'https://github.com/ErikDakoda/Vulcan-Extras.git'
});


Package.onUse(function(api) {
  api.use([
    'ecmascript',
    'vulcan:core@=1.16.0',
    'vulcan:users@=1.16.0',
    'erikdakoda:vulcan-errors@=1.16.0',
  ]);
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
