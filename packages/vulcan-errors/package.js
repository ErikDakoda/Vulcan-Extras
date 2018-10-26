Package.describe({
  name: "vulcan:errors",
  summary: "Vulcan error tracking package",
  version: '1.12.8',
  git: "https://github.com/ErikDakoda/Vulcan-Extras.git"
});

Package.onUse(function(api) {

  api.versionsFrom('1.6.1');
  
  api.use([
    'ecmascript',
    'vulcan:core',
  ]);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule('lib/client/main.js', 'client');

});
