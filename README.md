# Service Catalog

This is the service catalog for the [operate-first](https://github.com/operate-first) community cloud. The catalog can be accessed with [this](https://service-catalog.operate-first.cloud) link or via the operate first [website](https://www.operate-first.cloud).

## Architecture

The service catalog is implemented using [backstage](https://backstage.io/). This instance of backstage is built using two basic packages, `app` and `backend`. The `app` packages serves as the frontend and `backend` package as the backend. These two applications then communicate with each other to create the service catalog.

## Catalog items

Backstage can utilize a separate location (for example a GitHub repository) for the catalog component definitions. More information on how these files are defined can be found in the backstage [documentation](https://backstage.io/docs/features/software-catalog/descriptor-format).

Component definition files for this service catalog are located [here](https://github.com/operate-first/apps/tree/master/service-catalog). If you want to edit them, make a pull request in that repository.

There is an `example` folder located that only contains catalog items dedicated to local development. Switching between local and remote sources can be configured in `app-config.local.yaml` in the `catalog.locations` key.

## Permissions

Access to the service catalog is read-only for everyone. Permissions are defined using a [permission policy](https://backstage.io/docs/permissions/writing-a-policy). A permission policy is defined [here](https://github.com/operate-first/service-catalog/blob/main/packages/backend/src/plugins/permission.ts#L14-L21).

## Integrations

It is possible to integrate backstage using many other external providers such as GitHub or GitLab. For now, we decided that using no integrations is the best option. Read more about [integrations](https://backstage.io/docs/integrations/).

## Configuration files

There are 4 configuration files present in this repository. Backstage handles configuration files similarly to how `kustomize` handles deployment manifests. There is a base configuration file, in this case, `app-config.yaml`. Then 3 other configuration files add on top of the base config file by merging the files. Not all configs are used at the same time, it only makes sense to run the app with a base config and another, depending on the run environment.

Only edit the base file if you are sure that the change will be relevant for all other 3 configuration files. More information can be found in the backstage [documentation](https://backstage.io/docs/conf/).

## Backstage version

The external `@backstage` packages can be bumped using

```sh
yarn backstage-cli versions:bump
```

The current backstage version can be found in `backstage.json`. More about keeping `backstage` up to date can be found [here](https://backstage.io/docs/getting-started/keeping-backstage-updated).

## GitHub Insights/Security Insights

For the insights plugins to work it is required to put `github.com/project-slug` annotation to your components definition. The value of this annotation is a GitHub project slug which consists of the organization/user and the repository name, see the example below.

```yaml
annotations:
    github.com/project-slug: operate-first/service-catalog
```

## ADR plugin

ADR plugin requires an annotation to be present in your component definition. Right now the only value that is accepted by the annotation is a GitHub repository link to the folder which contains your ADRs, see the example below.

```yaml
annotations:
    backstage.io/adr-location: https://github.com/operate-first/blueprint/tree/main/adr
```

## Grafana plugin

The [grafana plugin](https://github.com/K-Phoen/backstage-plugin-grafana/) can display either links to dashboards or alerts on the overview page for a configured tag in the components annotations. For example:

```yaml
annotations:
    grafana/tag-selector: thoth
```

## Kubernetes plugin

The [kubernetes plugin](https://backstage.io/docs/features/kubernetes/overview) requires a label attached to the metadata of a deployment and then it requires a special annotation in the component definition file, for example:

Deployment manifest:

```yaml
metadata:
  labels:
    backstage.io/kubernetes-id: service1
```

Component definition:

```yaml
annotations:
  backstage.io/kubernetes-id: service1
```

The plugin can also fetch Kubernetes resources using any Kubernetes labels:

Deployment manifest:

```yaml
metadata:
  labels:
    app: my-app
    component: front-end
```

Component definition:

```yaml
annotations:
  backstage.io/kubernetes-label-selector: 'app=my-app,component=front-end'
```

## Contributing

### Submitting a pull request

1. Fork and clone the repository
2. Make your changes
3. Push to your fork and submit a pull request
4. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Install and use [pre-commit](https://pre-commit.com/) to follow the same code style and conventions.
- Keep your change as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html), please use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you. Please open such pull requests as *Draft*.

## Development setup

You can either run a development setup locally or in a k8s cluster.

### Run locally

Before you begin please install and use the supported Node.js version (we support [NVM](https://github.com/nvm-sh/nvm)), check `.nvmrc` for the appropriate version.

Configurations for the local setup are located in `app-config.local.yaml`.

1. Firstly create your `.env` file from the template in `.env.example`.

2. If you are running the app for the first time run:

    ```sh
    # Install depedencies
    yarn install

    # Compile
    yarn tsc
    ```

3. Run the app with:

    ```sh
    # Run with hot reload capabilities
    yarn dev
    ```

4. A tab in your default browser should appear if not by default, the app will be available on http://localhost:3000.

For local development with the kubernetes plugin, kubectl proxy is by default started on port `8001`, if you have something already running on this port make sure to add the `--port=<your_port>` option to the kubectl proxy command in `yarn dev` script.

### Run in a Kubernetes cluster

Configurations for the cluster dev setup are in `app-config.dev.yaml`.

1. Update the image repository URL with your image repository:

    ```sh
    cd manifests/overlays/dev && kustomize edit set image quay.io/operate-first/service-catalog=<your url>
    ```

2. Deploy using

    ```sh
    {oc,kubectl} apply -k manifests/overlays/dev
    ```

### S2I image

This repository uses s2i to create images. To create image run script located in `packages/backend`:

```sh
./packages/backend/build-image.sh
```

This will generate an image called `service-catalog`, this image is aimed to be used in production so it needs access to PostgreSQL database. To run this image with podman run:

```sh
export BACKEND_SECRET=$(node -p 'require("crypto").randomBytes(24).toString("base64")')
podman run -it -p 7007:7007 --env "BACKEND_SECRET" service-catalog:latest
```
