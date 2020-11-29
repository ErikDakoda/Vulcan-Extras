Package.describe({
  name: "erikdakoda:vulcan-aggregate",
  summary: "Vulcan data aggregation package",
  version: '1.16.0',
  git: "https://github.com/ErikDakoda/Vulcan-Extras.git"
});


Package.onUse(function(api) {
  api.use([
    'ecmascript',
    'vulcan:core@=1.16.0',
  ]);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule('lib/client/main.js', 'client');

});
