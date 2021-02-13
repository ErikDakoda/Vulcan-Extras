Vulcan error tracking package.

Documentation coming soon. See vulcan-errors-rollbar README.md.


This is a Meteor package designed as an addon to [Vulcan.js](https://github.com/VulcanJS/Vulcan).
It's created and maintained by [Erik Dakoda](https://github.com/ErikDakoda) and is available on GitHub in
[Vulcan-Extras](https://github.com/ErikDakoda/Vulcan-Extras), a collection of supplementary Vulcan packages.
I use all these packages in my own production code on [Etail21](https://www.etail21.com).

This software is provided under an MIT License.
With questions, comments, and suggestions you can contact me at [erik@uvilo.com](mailto:erik@uvilo.com),
or feel free to open a GitHub [Issue](https://github.com/ErikDakoda/Vulcan-Extras/issues) or
[Pull request](https://github.com/ErikDakoda/Vulcan-Extras/pulls) against the `dev` branch.


### Goal

The `vulcan-aggregate` package is designed to make adding aggregate queries, and queries not associated with a
collection, quick and easy. It generates all the required GraphQL so that you can hit the ground running.

### Install

The package is published to Atmosphere, so it's easy to add it to your project:

```
meteor add erikdakoda:vulcan-aggregate
```

### Contribute

Alternatively, you can clone or fork the source code and use it in a Multi-Repo Install configuration.
This is similar to a [Two-Repo Install](https://docs.vulcanjs.org/#Two-Repo-Install-Optional) except
using three or more repos.

```
METEOR_PACKAGE_DIRS="/Users/erik/Vulcan/packages:/Users/erik/Vulcan-Extras/packages" meteor --port 3000 --settings settings.json
```

### Use

