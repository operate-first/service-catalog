# Service Catalog

This is the service catalog for the [Operate First Community Cloud][3].

## Architecture

The service catalog is implemented using [Backstage][4]. There are 2 packages present in the repo:

1. `app` package for front end
2. `backend` package for back end

## Catalog items

Backstage can utilize a separate location (for example a GitHub repository) for the catalog entity definitions. More information on how to configure the entities can be found in the [configuring entities section](configuring-entities.md).

Entity definition files for this service catalog are located [here][1]. If you want to edit them, make a pull request in that repository.

For local development you can use an `example` folder that contains dummy catalog items. Switching between local and remote sources can be configured in `app-config.local.yaml` in the `catalog.locations` key.

## Permissions

Access to the service catalog is read-only for everyone. Permissions are defined using a [permission policy][5]. A permission policy is defined [here][2].

## Integrations

It is possible to integrate backstage using many other external providers such as GitHub or GitLab. For now, we decided that using no integrations is the best option. Read more about [integrations][6].

## GitHub OAuth

Some installed plugins like [GitHub Insights](configuring-entities.md#github-insightssecurity-insights) require GitHub OAuth app authentication. It is used only for calling the GitHub API using a token from your account. The account is not being mapped to users in the catalog.

## Configuration files

There are 4 configuration files present in this repository. Backstage handles configuration files similarly to how `kustomize` handles deployment manifests. There is a base configuration file, in this case, `app-config.yaml`. Then 3 other configuration files add on top of the base config file by merging the files. Not all configs are used at the same time, it only makes sense to run the app with a base config and another, depending on the run environment (prod, dev and local).

Only edit the base file if you are sure that the change will be relevant for all other 3 configuration files. More information can be found in the backstage [documentation][8]

## Backstage version

The external `@backstage` packages can be bumped using

```sh
yarn backstage-cli versions:bump
```

The current backstage version can be found in `backstage.json`. More about keeping `backstage` up to date can be found [here][7].

[1]: https://github.com/operate-first/apps/tree/master/service-catalog
[2]: https://github.com/operate-first/service-catalog/blob/main/packages/backend/src/plugins/permission.ts#L14-L25
[3]: https://github.com/operate-first
[4]: https://backstage.io/
[5]: https://backstage.io/docs/permissions/writing-a-policy
[6]: https://backstage.io/docs/integrations/
[7]: https://backstage.io/docs/getting-started/keeping-backstage-updated
[8]: https://backstage.io/docs/conf/
