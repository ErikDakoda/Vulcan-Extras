Package.describe({
  name: 'erikdakoda:vulcan-errors-rollbar',
  summary: 'Vulcan Rollbar error tracking package',
  version: '1.16.1',
  git: 'https://github.com/ErikDakoda/Vulcan-Extras.git'
});


Package.onUse(function(api) {
  
  api.versionsFrom('1.6.1');
  
  api.use([
    'ecmascript',
    'vulcan:core@=1.16.1',
    'vulcan:users@=1.16.1',
    'erikdakoda:vulcan-errors@=1.16.1',
  ]);
  
  api.addAssets('lib/private/rollbarSnippet.txt', 'server');
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
