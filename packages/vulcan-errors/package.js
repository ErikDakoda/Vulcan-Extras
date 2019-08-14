Package.describe({
  name: "erikdakoda:vulcan-errors",
  summary: "Vulcan error tracking package",
  version: '1.13.1',
  git: "https://github.com/ErikDakoda/Vulcan-Extras.git"
});


Package.onUse(function(api) {

  api.versionsFrom('1.6.1');
  
  api.use([
    'ecmascript',
    'vulcan:core@1.13.1',
    'vulcan:errors@1.13.1',
  ]);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule('lib/client/main.js', 'client');

});
