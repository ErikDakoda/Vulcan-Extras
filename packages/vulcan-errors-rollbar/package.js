Package.describe({
  name: 'vulcan:errors-rollbar',
  summary: 'Vulcan Rollbar error tracking package',
  version: '1.12.8',
  git: 'https://github.com/ErikDakoda/Vulcan-Extras.git'
});


Package.onUse(function(api) {
  api.versionsFrom('1.6.1');
  
  api.use([
    'ecmascript',
    'vulcan:core',
    'vulcan:users',
    'vulcan:errors',
  ]);
  
  api.addAssets('lib/private/rollbarSnippet.txt', 'server');
  api.addAssets('lib/public/2.4.4/rollbar.js', 'client');
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
