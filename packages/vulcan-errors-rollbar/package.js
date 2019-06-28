Package.describe({
  name: 'erikdakoda:vulcan-errors-rollbar',
  summary: 'Vulcan Rollbar error tracking package',
  version: '1.13.0_2',
  git: 'https://github.com/ErikDakoda/Vulcan-Extras.git'
});


Package.onUse(function(api) {
  api.versionsFrom('1.6.1');
  
  api.use([
    'ecmascript',
    'vulcan:core@1.13.0',
    'vulcan:users@1.13.0',
    'erikdakoda:vulcan-errors',
  ]);
  
  api.addAssets('lib/private/rollbarSnippet.txt', 'server');
  api.addAssets('lib/public/2.4.4/rollbar.js', 'client');
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
