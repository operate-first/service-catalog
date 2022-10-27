/* eslint-disable no-nested-ternary */
import React, { createContext, useContext, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography
} from "@material-ui/core";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useDebounce from "react-use/lib/useDebounce";
import { ClusterDetails } from "@internal/plugin-cluster-status-backend";
import {
  InfoCard,
  Link,
  StatusAborted,
  StatusError,
  StatusOK,
  Table
} from "@backstage/core-components";
import { getClusterByName } from "../../../clusterClient";


const defaultClusterDetails: ClusterDetails = {
  status: {
    available: false,
    reason: 'Loading'
  }
}

const ClusterContext = createContext({
  // Have to put a default cluster details since it has to have a status by definition
  data: defaultClusterDetails,
  loading: true,
  error: false,
});

export const ClusterContextProvider = (props: any) => {
  const { entity } = useEntity();
  const configApi = useApi(configApiRef);
  const [cluster, setCluster] = useState<ClusterDetails>(defaultClusterDetails);
  const [{ loading, error }, refresh] = useAsyncFn(
    async () => {
      setCluster(await getClusterByName(configApi, entity.metadata.name))
    }, [], { loading: true }
  );
  useDebounce(refresh, 10);

  let errorBool = false
  /*
  Error can either be undefined or Error(), if its undefined, no error happended
  if cluster has some 'error' key, it means the API sent back an error response
  */
  if (error instanceof Error || 'error' in cluster) {
    errorBool = true
  }

  return (
    <ClusterContext.Provider value={{ data: cluster, loading, error: errorBool }} >
      {props.children}
    </ClusterContext.Provider>
  )
}

const convertToGibibytes = (kibibytes: string): string => {
  const sizeInKibibytes = parseInt(kibibytes.substring(0, kibibytes.length - 2), 10)
  return `${(sizeInKibibytes / 2 ** 20).toFixed(0)} Gi`
}

const valueFormatter = (value: any): any => {
  if (typeof value === 'string') {
    if (value.slice(-2) === 'Ki') {
      return convertToGibibytes(value)
    } else if (value.slice(0, 4) === 'http') {
      return <Link to={value}>{value}</Link>
    }
  }
  return value.toString()
}

const tableFromObject = (
  data: any,
  title: string,
  nameMap: Map<string, string>
) => {
  const parsedData: { name: string; value: string; }[] = []
  const entries = Object.entries(data)

  nameMap.forEach((_, key) => {
    const entry = entries.find(e => (
      e[0] === key
    ))!
    // If key of the map doesnt have an prop in the cluster object, continue
    if (entry === undefined) {
      return
    }
    parsedData.push(
      {
        // entry[0] === name of the prop
        name: nameMap.get(entry[0])!,
        // entry[1] === value of the prop
        value: valueFormatter(entry[1])
      }
    )
  })

  if (parsedData.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader
        title={title}
      />
      <CardContent style={{ padding: 0 }}>
        <Table
          options={{
            search: false,
            paging: false,
            toolbar: false,
            header: false,
            padding: 'dense',
          }}
          data={parsedData}
          columns={[
            { field: 'name', highlight: true, width: '15%', cellStyle: { whiteSpace: 'nowrap' } },
            { field: 'value' },
          ]}
        />
      </CardContent>
    </Card>
  )
}

export const useCluster = () => (useContext(ClusterContext))

export const ClusterInfoTable = () => {
  const { data, loading, error } = useCluster();

  if (error || loading) {
    return null
  }

  const nameMap = new Map<string, string>([
    ['name', 'Name'],
    ['kubernetesVersion', 'Kubernetes version'],
    ['openshiftId', 'OpenShift ID'],
    ['openshiftVersion', 'OpenShift version'],
    ['platform', 'Platform'],
    ['region', 'Region'],
    ['consoleUrl', 'Console URL'],
    ['oauthUrl', 'OAuth URL'],
  ])
  return tableFromObject(data, 'Cluster Info', nameMap)
}

export const ClusterAvaliableResourceTable = (): any => {
  const { data, loading, error } = useCluster();

  if (!('availableResources' in data) || error || loading) {
    return null
  }

  const nameMap = new Map<string, string>([
    ['cpuCores', 'CPU cores'],
    ['memorySize', 'Memory size'],
    ['numberOfPods', 'Number of pods'],
  ])
  return tableFromObject(data.availableResources, 'Available', nameMap)
}

export const ClusterAllocatableResourceTable = (): any => {
  const { data, loading, error } = useCluster();

  if (!('allocatableResources' in data) || error || loading) {
    return null
  }

  const nameMap = new Map<string, string>([
    ['cpuCores', 'CPU cores'],
    ['memorySize', 'Memory size'],
    ['numberOfPods', 'Number of pods'],
  ])
  return tableFromObject(data.allocatableResources, 'Allocatable', nameMap)
}

export const ClusterStatusCard = (): any => {
  const { data, loading, error } = useCluster();
  let reason = data.status.reason

  if (error) {
    data.status.reason = 'Unavailable'
  } else if (loading) {
    /*
    Can't do data.status.reason = 'Loading' since the value
    will not be overwritten by the state update of the cluster (dunno why)
    */
    reason = 'Loading'
  }

  const down = data.status.available && data.status.reason === 'Cluster is down'

  return (
    <InfoCard title="Status" divider={false} >
      <div style={{ textAlign: 'center', margin: 0 }}>
        <Typography variant="h1">
          {data.status.available ? <StatusOK />
            : (down ? <StatusError /> : <StatusAborted />)}
        </Typography>
        <Typography variant="subtitle1">
          {reason}
        </Typography>
      </div>
    </InfoCard>
  )
}
