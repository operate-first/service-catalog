<!-- add badges here and more information about the service catalog, maybe a logo -->

# Service Catalog

This is the service catalog for the [operate-first](https://github.com/operate-first) community cloud. The catalog can be accessed with [this](https://service-catalog.operate-first.cloud).

## Documentation

The documentation for the service catalog can be found in the [component for the service catalog](https://service-catalog.operate-first.cloud/docs/default/component/service-catalog).

## Architecture

The service catalog is implemented using [backstage](https://backstage.io/). This instance of backstage is built using two basic packages, `app` and `backend`. The `app` packages serves as the frontend and `backend` package as the backend. These two applications then communicate with each other to create the service catalog.

## Catalog items

Backstage can utilize a separate location (for example a GitHub repository) for the catalog component definitions. More information on how these files are defined can be found in the backstage [documentation](https://backstage.io/docs/features/software-catalog/descriptor-format).

Component definition files for this service catalog are located [here](https://github.com/operate-first/apps/tree/master/service-catalog). If you want to edit them, make a pull request in that repository.

There is an `example` folder located that only contains catalog items dedicated to local development. Switching between local and remote sources can be configured in `app-config.local.yaml` in the `catalog.locations` key.
