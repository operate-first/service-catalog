<p align="center">
    <img src="https://raw.githubusercontent.com/operate-first/operate-first.github.io/main/src/assets/landing-logo.svg" width="300" alt="Operate-first logo" />
</p>
<h1 align="center"><a href="https://service-catalog.operate-first.cloud/">Service Catalog</a></h1>
<p align="center">
  <a href="https://github.com/operate-first/peribolos-as-a-service/releases">
    <img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/operate-first/peribolos-as-a-service">
  </a>
  <a href="https://github.com/operate-first/service-catalog">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/operate-first/service-catalog">
  </a>
  <a href="https://github.com/operate-first/service-catalog/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/operate-first/service-catalog?color=blue">
  </a>
  <a href="https://service-catalog.operate-first.cloud/catalog/default/component/backstage">
    <img alt="Link to backstage in Operate First Cloud, Component: backstage" src="https://service-catalog.operate-first.cloud/api/badges/entity/default/component/backstage/badge/pingback">
  </a>
  <a href="https://service-catalog.operate-first.cloud/catalog/default/component/backstage/docs">
    <img alt="Link to backstage in Operate First Cloud, Component: backstage" src="https://service-catalog.operate-first.cloud/api/badges/entity/default/component/backstage/badge/docs">
  </a>

</p>

This is the service catalog for the [operate first community cloud][1]. The catalog can be accessed via [this link][2].

## Documentation

The documentation for the service catalog can be found in the [backstage component][3].

## Architecture

The service catalog is implemented using [Backstage][4]. There are 2 packages present in the repo:

1. `app` package for front end
2. `backend` package for back end

## Catalog items

Backstage can utilize a separate location (for example a GitHub repository) for the catalog component definitions. More information on how these files are defined can be found in the backstage [documentation][5] or our [documentation][3].

Component definition files for this service catalog are located [here][6]. If you want to edit them, make a pull request in that repository.

There is an `example` folder located that only contains catalog items dedicated to local development. Switching between local and remote sources can be configured in `app-config.local.yaml` in the `catalog.locations` key.


[1]: https://github.com/operate-first
[2]: https://service-catalog.operate-first.cloud
[3]: https://service-catalog.operate-first.cloud/catalog/default/component/backstage/docs
[4]: https://backstage.io/
[5]: https://backstage.io/docs/features/software-catalog/descriptor-format
[6]: https://github.com/operate-first/apps/tree/master/service-catalog
