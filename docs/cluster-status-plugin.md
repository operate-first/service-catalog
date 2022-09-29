# Cluster status backend plugin

This plugin is a wrapper to the ACM (Advanced cluster management) operator installed on our `infra` cluster. It exposes two endpoints:

1. `/api/cluster-status/status/{cluster-name}` - Provides information for the queried cluster, the name has to be chosen from one of the configured clusters in the `app-config.prod.yaml` file.
2. `/api/cluster-status/status` - Provides information for all configured clusters in the `app-config.prod.yaml` file.

The data that it provides can be found in the [`backstage`](https://service-catalog.operate-first.cloud/catalog/default/api/backstage) API entity in the service catalog.

## Plugin configuration

A new configuration value for this plugin is added:

```yaml
clusterStatus:
  acmCluster: <acm_cluster_name>
```

The value `<acm_cluster_name>` is the name of a configured cluster that has the ACM operator installed. It is required to use this plugin.
