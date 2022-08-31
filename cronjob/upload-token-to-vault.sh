#!/bin/bash

echo "Authenticating with vault using SA JWT token ..."
VAULT_AUTH_TOKEN=$(oc sa get-token vault-secret-fetcher -n service-catalog-k8s-plugin)
VAULT_CLIENT_TOKEN=$(vault write auth/$CLUSTER-k8s/login role=$ENV-ops jwt="$VAULT_AUTH_TOKEN" -format=json | jq -r '.auth.client_token')
vault login -no-print $VAULT_CLIENT_TOKEN

# Push SA token to vault
echo "Pushing k8s plugin SA token to vault ..."
K8S_PLUGIN_TOKEN=$(oc sa get-token service-catalog-k8s-plugin -n service-catalog-k8s-plugin)
vault kv put -mount=k8s_secrets $ENV/$CLUSTER/service-catalog-k8s-plugin token=$K8S_PLUGIN_TOKEN
