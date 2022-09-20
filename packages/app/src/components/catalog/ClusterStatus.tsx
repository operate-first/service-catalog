import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import { getClusterByName } from "../../clusterClient";
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from "react-use/lib/useDebounce";
import { ClusterDetails } from "@internal/plugin-cluster-status-backend";

interface props {
  cluster: Object
}

const convertToGibibytes = (kibibytes: string): string => {
  const sizeInKibibytes = parseInt(kibibytes.substring(0, kibibytes.length - 2), 10)
  return `${(sizeInKibibytes / 2 ** 20).toFixed(0)} Gi`
}

const fixName = (val: string): string => (
  val.replace(/[A-Z]/g, v => (` ${v.toLowerCase()}`))
    .replace(/^\w/g, v => v.toUpperCase())
)

const ClusterDetailsContent = (
  { cluster }: props
) => {
  return (
    <List >
      {
        Object.entries(cluster).map(e => {
          const name = e[0]
          const value = e[1]
          const primary = `${fixName(name)}:`
          let secondary: string = value.toString()

          if (!(typeof value === 'string' || typeof value === 'boolean')) {
            return (
              <ListItem key={name}>
                <ListItemText
                  primary={primary}
                  secondary={<ClusterDetailsContent cluster={value} />}
                />
              </ListItem>
            )
          }
          else if (secondary.substring(secondary.length - 2) === 'Ki') {
            secondary = convertToGibibytes(secondary)
          }
          return (
            <ListItem key={name}>
              <ListItemText
                primary={primary}
                secondary={secondary}
              />
            </ListItem>
          )
        })
      }
    </List>
  )
}

export const ClusterStatus = () => {
  const { entity } = useEntity();
  const configApi = useApi(configApiRef);
  const [cluster, setCluster] = useState<ClusterDetails>({
    status: {
      available: false,
      reason: 'loading'
    }
  });
  const [_, refresh] = useAsyncFn(
    async () => {
      const thisCluster = await getClusterByName(configApi, entity.metadata.name)
      setCluster(thisCluster)
    }, [], { loading: true }
  );
  useDebounce(refresh, 10);

  return (
    <Card>
      <CardHeader
        title='Cluster status'
      />
      <CardContent>
        <ClusterDetailsContent cluster={cluster} />
      </CardContent>
    </Card>
  );
}

export default ClusterStatus;
