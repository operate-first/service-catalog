# Service Catalog
- This is the service catalog for the [operate-first](https://github.com/operate-first) community cloud.
- The catalog can be access with [this](http://example.org) link or via the operate first [website](https://www.operate-first.cloud).
- Definition files for the catalog components are located [here](https://github.com/SamoKopecky/apps/tree/master/service-catalog)

# Development setup
You can either run a development setup locally or in a k8s cluster.
## Run locally
- Configurations for the local setup are in `app-config.local.yaml`
- Before running the app firstly generate a secret using
```sh
node -p 'require("crypto").randomBytes(24).toString("base64")
```
- and edit the `config.yaml` file by using the generated value as the value for the key `secret`.
- If you are running the app for the first time use these commands:
```sh
yarn install
yarn tsc
yarn dev
```
- To run the app again just use `yarn dev`.

## Run in a Kubernetes cluster
- Configurations for the cluster dev setup are in `app-config.dev.yaml`
- The manifests in `manifests` folder can be used to deploy the `posgress db` and the `backstage` app itself.

### Image
- The image can be built using:

```sh
yarn build-image
```

- This uses a `Dockerfile` located in `packages/backend/Dockerfile`.
