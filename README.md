# Service Catalog
- This is the service catalog for the [operate-first](https://github.com/operate-first) community cloud.
- The catalog can be accessed with [this](http://example.org) link or via the operate first [website](https://www.operate-first.cloud).
- Definition files for the catalog components are located [here](https://github.com/SamoKopecky/apps/tree/master/service-catalog).
- The service catalog is implemented using [backstage](https://backstage.io/).

# Development setup
You can either run a development setup locally or in a k8s cluster.
## Run locally
- Configurations for the local setup are in `app-config.local.yaml`
- Before running the app firstly generate a secret and export it to an environmental variable using
```sh
export backend_secret=\
$(node -p 'require("crypto").randomBytes(24).toString("base64")')
```
- If you are running the app for the first time use these commands:
```sh
yarn install
yarn tsc
yarn dev
```
- To run the app again just use `yarn dev`.
- By default, the app will be available on http://localhost:3000

### Catalog components
- Catalog components can either be loaded locally from the `examples` folder or a GitHub repository.
- This can be configured in `app-config.local.yaml` in the `catalog.locations` key.

## Run in a Kubernetes cluster
- Configurations for the cluster dev setup are in `app-config.dev.yaml`
- The manifests in `manifests` folder can be used to deploy the `posgress db` and the `backstage` app itself.

### Image
- The image can be built using:

```sh
yarn build-image
```

- This uses a `Dockerfile` located in `packages/backend/Dockerfile`.
