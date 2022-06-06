# Operate First Cloud Service Catalog
- Some description 

# Development setup
## Run locally
- Configurations for the local setup are in `app-config.local.yaml`
- Run the app with:
```sh
yarn install
yarn dev
```

## Run in a Kubernetes cluster
- Configurations for the cluster dev setup are in `app-config.dev.yaml`
- The manifests in `manifests` folder can be used to deploy the `posgress db` and the `catalog` itself.

### Image
- The image can be built using:

```sh
yarn build-image
```

