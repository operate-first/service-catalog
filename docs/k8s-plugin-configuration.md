# Kubernetes plugin configuration

This document describes how the [Kubernetes plugin][1] in our backstage instance is configured. The Operate First community manages multiple clusters, backstage needs to fetch information about all these clusters via the Kubernetes API using [Service Account][2] tokens for authentication. That is why a token needs to be extracted from each cluster. Backstage will then use these to fetch the required information.

The configuration is split into three separate configurations:

* **Kubernetes configuration** - Service Accounts are created in each cluster
* **Vault configuration** - Service Account tokens are fetched and stored in our [hasicorp vault][3] instance
* **Backstage configuration** - Kubernetes secret is created from a vault secret which backstage then consumes

These configurations are further explained in the sections bellow.

And the end you can read *TL;DR* version for adding a cluster to backstage.

## Kubernetes configuration

First of all, the required Service Accounts need to be created in all the clusters. Manifests for these can be found in the [`service-catalog-k8s-plugin` bundle][4] among other things. In each cluster a Service Account called `service-catalog-k8s-plugin` is created in a namespace with the same name. To fetch tokens for these Service Accounts reliably, a [`service-catalog-k8s-plugin-token` secret][5] is created, so that the name of this secret is always the same for all service accounts.

The bundle is then added to the `common` overlay so that they get applied to all clusters (more information on how Operate First works with overlays can be found [here][6]). Some clusters don't import the `common` overlay such as `curator`, in this case the bundle needs to be added to the `kustomization.yaml` file of that cluster.

## Vault configuration

Service Account tokens are uploaded to vault via this [`CronJob`][7]. Firstly it needs to [authenticate to vault via Kubernetes][8]. A special policy called `service-catalog` is created in vault, which only allows writing to a secret located here: `moc/smaug/service-catalog/k8s-plugin-tokens`. To authenticate to vault correctly a special role for each authentication method is created that is using the `service-catalog` policy.

Each value in this secret is named using `$ENV` and `$CLUSTER` variables which are imported from the `service-catalog-k8s-plugin` `ConfigMap`. The value of the secret is the Service Account token.

Each cluster has its own `ConfigMap`, see the an example [here][9]. The `$ENV` value corresponds to the environment the cluster is in, for example the smaug clusters environment is moc. The `$CLUSTER` variable corresponds to the cluster name, it also corresponds to the name of the authentication method in vault. That means when choosing this value the cluster name from the auth method in vault **needs** to be used.

This `CronJob` runs every hour on every cluster. After every `CronJob` completes the resulting secrets in vault would look something like this:

```
moc/smaug/service-catalog/k8s-plugin-tokens
├── moc_smaug_token
├── moc_infra_token
├── emea_balrog_token
├── osc_osc-cl1_token
...
```

## Backstage configuration

At this stage we utilize [external secrets operator][10] to create a Kubernetes secret from a vault secret in the `service-catalog` namespace on a cluster where backstage is deployed. The secret is created via an [`ExternalSecret`][11], which is set to refresh every hour.

The created Kubernetes secret is then consumed by backstage in the [`app-config.prod.yaml`][12] file. Each cluster configuration consumes the corresponding Service Account token. For example the `smaug` cluster will consume an environmental variable named `moc_smaug_token`.


## TL;DR for adding a new cluster

Follow these steps to add a new cluster to backstage:

1. Add [this bundle][4] to your cluster overlay.

2. Create a ConfigMap like [this one][9] but replace the `ENV` and `CLUSTER` variables with the relevant ones.

  > See the [kubernetes section of the configuration](#kubernetes-configuration) for a guide on how to setup these values.

3. Crate a vault role in the authentication method for your cluster using the policy `service-catalog`. Bind this role to the created namespace and service account in the [bundle][4] added in step 1.

4. Add a new cluster entry to the `app-config.prod.yaml` file.

The CronJob runs every hour and the secret synchronization to backstage from vault might also take a while so you might need to wait a bit for the configuration to take effect.


[1]: configuring-entities.md#kubernetes-plugin
[2]: https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/
[3]: https://developer.hashicorp.com/vault/docs
[4]: https://github.com/operate-first/apps/tree/master/cluster-scope/bundles/service-catalog-k8s-plugin/kustomization.yaml
[5]: https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/#to-create-additional-api-tokens
[6]: https://github.com/operate-first/apps/tree/master/cluster-scope
[7]: https://github.com/operate-first/apps/blob/master/cluster-scope/base/batch/cronjobs/service-catalog-k8s-plugin/cronjob.yaml
[8]: https://www.operate-first.cloud/apps/content/vault_eso/write_to_vault_with_k8s.html
[9]: https://github.com/operate-first/apps/blob/master/cluster-scope/overlays/prod/moc/infra/configmaps/service-catalog-k8s-plugin.yaml
[10]: https://external-secrets.io/v0.5.9/
[11]: https://github.com/operate-first/apps/blob/master/cluster-scope/overlays/prod/moc/smaug/externalsecrets/service-catalog-k8s-plugin-tokens.yaml
[12]: https://github.com/operate-first/service-catalog/blob/main/app-config.prod.yaml
