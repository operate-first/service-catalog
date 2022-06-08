# Operate First Cloud Service Catalog
- Some description

# Development setup
## Run locally
- Configurations for the local setup are in `app-config.local.yaml`
- Run the app first time with:
```sh
export backend_secret=$(node -p 'require("crypto").randomBytes(24).toString("base64")') \
yarn install
yarn tsc
yarn dev
```
- To run the app again just use `yarn dev`

## Run in a Kubernetes cluster
- Configurations for the cluster dev setup are in `app-config.dev.yaml`
- The manifests in `manifests` folder can be used to deploy the `posgress db` and the `catalog` itself.

### Image
- The image can be built using:

```sh
yarn build-image
```
